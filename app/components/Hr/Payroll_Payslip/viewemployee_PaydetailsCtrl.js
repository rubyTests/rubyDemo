angular
    .module('rubycampusApp')
    .controller('viewemployee_PaydetailsCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$stateParams',
        '$filter',
        '$http',
        '$localStorage',
        '$state',
        function ($scope,$rootScope,$timeout,$resource,$stateParams,$filter,$http,$localStorage,$state) {

            console.log($localStorage.structureName,'$localStorage.structureName',$stateParams.assign_id);
            $http({
                method:'GET',
                url: $localStorage.service+'PayrollPayslipAPI/fetchEmployeeDetails',
                params:{id:$stateParams.assign_id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.tableView_data = return_data.data.message[0];
                $scope.basic_val=return_data.data.message[0].BASIC_PAY;
            });

            $http({
                method:'GET',
                url: $localStorage.service+'PayrollPayslipAPI/fetchPayStructureDetails',
                params:{id:$localStorage.structureName},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                console.log(return_data,'structure');
                $scope.PaySrtuctureData = return_data.data.message;
            });

            $('#tblBody').find('input').attr('disabled',true);
            $scope.btnStatus=false;
            $scope.editBTN=true;
            $scope.editPayDetails=function(){
                $('#basicvalue').attr('disabled',false);
                $scope.btnStatus=true;
                $scope.editBTN=false;
            }
            $timeout(function(){            
                // var perOfTotalEarn=0;
                // var perOfTotalDeduc=0;
                // $('[name="earningAmount"]').each(function(){
                //     perOfTotalEarn+=parseFloat($scope.basic_val)/parseFloat($(this).val());
                // })

                //  $('[name="deductionAmount"]').each(function(){
                //     perOfTotalDeduc+=parseFloat($scope.basic_val)/parseFloat($(this).val());
                // })
                // var SUMTotal_Earning=parseFloat($scope.basic_val) + parseFloat(perOfTotalEarn);
                // $scope.Total_Earning=SUMTotal_Earning.toFixed(2);
                // $scope.total_deduction=parseFloat(perOfTotalDeduc).toFixed(2);
                // $scope.showTotalNetpay=parseFloat($scope.Total_Earning-$scope.total_deduction).toFixed(2);

                var totalEarn=0;
                var totalDeduct=0;
                // var basicVal=basicVal || 0;
                angular.forEach($scope.PaySrtuctureData,function(value, keys){
                    if (value.ITEM_TYPE=='Earnings') {
                        value.AMOUNT= value.AMOUNT || 0;
                        value.changedAmount=($scope.basic_val/value.AMOUNT).toFixed(2);
                        totalEarn+=parseFloat(value.changedAmount);
                    }else if (value.ITEM_TYPE=='Deductions'){
                        value.AMOUNT= value.AMOUNT || 0;
                        value.changedAmount=($scope.basic_val/value.AMOUNT).toFixed(2);
                        totalDeduct+=parseFloat(value.changedAmount);
                    }
                    
                });
                var TotalNumberE=(parseFloat($scope.basic_val)+parseFloat(totalEarn)).toFixed(2);
                $scope.Total_Earning=(angular.isNumber(TotalNumberE)? 0.00:TotalNumberE);
                $scope.total_deduction=(angular.isNumber(totalDeduct)? totalDeduct:0.00).toFixed(2);
                var totalNetpay=parseFloat($scope.Total_Earning) - parseFloat($scope.total_deduction);
                $scope.showTotalNetpay = totalNetpay.toFixed(2);
            },700);

            // $scope.earningCalculation=function(basicVal){
            //     // console.log(basicVal,'basicVal');
            //     // $scope.EarningTotal=parseInt(basicVal) + parseInt($scope.Total_Earning);
            //     // $scope.DeductionTotal=parseInt($scope.total_deduction);
            //     // $scope.showTotalNetpay=$scope.EarningTotal-$scope.DeductionTotal;
            //     var perOfTotalEarn=0;
            //     var perOfTotalDeduc=0;
            //     $('[name="earningAmount"]').each(function(){
            //         perOfTotalEarn+=parseFloat(basicVal)/parseFloat($(this).val());
            //     })

            //      $('[name="deductionAmount"]').each(function(){
            //         perOfTotalDeduc+=parseFloat(basicVal)/parseFloat($(this).val());
            //     })
            //     var SUMTotal_Earning=parseFloat(basicVal) + parseFloat(perOfTotalEarn);
            //     $scope.Total_Earning=SUMTotal_Earning.toFixed(2);
            //     $scope.total_deduction=parseFloat(perOfTotalDeduc).toFixed(2);
            //     $scope.showTotalNetpay=parseFloat($scope.Total_Earning-$scope.total_deduction).toFixed(2);
            // }

            $scope.earningCalculation=function(basicVal){
                var totalEarn=0;
                var totalDeduct=0;
                // var basicVal=basicVal || 0;
                angular.forEach($scope.PaySrtuctureData,function(value, keys){
                    if (value.ITEM_TYPE=='Earnings') {
                        value.AMOUNT= value.AMOUNT || 0;
                        value.changedAmount=(basicVal/value.AMOUNT).toFixed(2);
                        totalEarn+=parseFloat(value.changedAmount);
                    }else if (value.ITEM_TYPE=='Deductions'){
                        value.AMOUNT= value.AMOUNT || 0;
                        value.changedAmount=(basicVal/value.AMOUNT).toFixed(2);
                        totalDeduct+=parseFloat(value.changedAmount);
                    }
                    
                });
                var TotalNumberE=(parseFloat(basicVal)+parseFloat(totalEarn)).toFixed(2);
                $scope.Total_Earning=(angular.isNumber(TotalNumberE)? 0.00:TotalNumberE);
                $scope.total_deduction=(angular.isNumber(totalDeduct)? totalDeduct:0.00).toFixed(2);
                var totalNetpay=parseFloat($scope.Total_Earning) - parseFloat($scope.total_deduction);
                $scope.showTotalNetpay = totalNetpay.toFixed(2);
            }

            // console.log($localStorage.structureName,'$localStorage.structureName');
            $scope.PayStru_name=[];
            $http({
                method:'GET',
                url: $localStorage.service+'PayrollPayslipAPI/payStructure',
                params:{id:$localStorage.structureName},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(pay_structure){
                console.log(pay_structure.data.message[0],'pay_structure');
                $scope.PayStru_name=pay_structure.data.message[0];
            });

            $scope.assignPayroll=function(empId,empName,struct_Name){
                console.log(empId,'empId');
                var alertMessage='Are you sure to assign '+empName+ ' to ' +struct_Name+ ' pay structure?';
                if(empId){
                    UIkit.modal.confirm(alertMessage, function(e) {
                        if(empId){
                            $http({
                                method:'POST',
                                url: $localStorage.service+'PayrollPayslipAPI/assignPayroll',
                                data:{
                                    'emp_id':empId,
                                    'stru_id':$localStorage.structureName,
                                    'basic_pay':$scope.basic_val
                                },
                                headers:{'access_token':$localStorage.access_token}
                            }).then(function(return_data){
                                console.log(return_data.data.message.message,'return_data');
                                if(return_data.data.status==true){
                                    UIkit.notify({
                                        message : return_data.data.message.message,
                                        status  : 'success',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                    $state.go('restricted.hr.StructureGroup');
                                }else {
                                    UIkit.notify({
                                        message : 'Failed',
                                        status  : 'danger',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                }
                            });
                        }
                    },function(){
                        // console.log("false");
                    }, {
                        labels: {
                            'Ok': 'Ok'
                        }
                    });
                }
            }
        }
    ]);