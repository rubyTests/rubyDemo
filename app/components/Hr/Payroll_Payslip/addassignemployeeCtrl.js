angular
    .module('rubycampusApp')
    .controller('addassignemployeeCtrl', [
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
            $scope.tableView_data=[];
            $scope.PaySrtuctureData=[];
            $http({
                method:'GET',
                url: $localStorage.service+'PayrollPayslipAPI/fetchEmployeeDetails',
                params:{id:$stateParams.id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.tableView_data = return_data.data.message[0];
            });

            $http({
                method:'GET',
                url: $localStorage.service+'PayrollPayslipAPI/fetchPayStructureDetails',
                params:{id:$localStorage.structureName},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.PaySrtuctureData = return_data.data.message;
                angular.forEach($scope.PaySrtuctureData, function(value, keys){
                    var data=0;
                    value.changedAmount=data.toFixed(2);
                });
            });
            console.log($localStorage.structureName,'$localStorage.structureName');
            // $scope.basic_val=0;
            // $timeout(function(){
            //     // var totalEarn=0;
            //     // var totalDeduction=0;
            //     // $('[name="earningAmount"]').each(function(){
            //     //     totalEarn+=parseFloat($(this).val());
            //     // })

            //     //  $('[name="deductionAmount"]').each(function(){
            //     //     totalDeduction+=parseFloat($(this).val());
            //     // })
            //     // // console.log(totalEarn,'totalEarn');
            //     // // console.log(totalDeduction,'totalDeduction');
            //     // $scope.Total_Earning=totalEarn.toFixed(2);
            //     // $scope.total_deduction=totalDeduction.toFixed(2);
            //     // $scope.showTotalNetpay=parseFloat(totalEarn-totalDeduction).toFixed(2);
            //     var basicVal=0;
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

            // },1500);
            var initValue=0;
            $scope.Total_Earning=initValue.toFixed(2);
            $scope.total_deduction=initValue.toFixed(2);
            $scope.earningCalculation=function(basicVal){
                var totalEarn=0;
                var totalDeduct=0;
                var basicVal=basicVal || 0;
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