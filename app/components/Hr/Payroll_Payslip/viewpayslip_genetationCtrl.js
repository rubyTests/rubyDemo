angular
    .module('rubycampusApp')
    .controller('viewpayslip_genetationCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$stateParams',
        '$filter',
        '$http','$localStorage','$state',
        function ($scope,$rootScope,$timeout,$resource,$stateParams,$filter,$http,$localStorage,$state) {

            var $formValidate = $('#form_validation');
            $formValidate
            .parsley()
            .on('form:validated',function() {
                $scope.$apply();
            })
            .on('field:validated',function(parsleyField) {
                if($(parsleyField.$element).hasClass('md-input')) {
                    $scope.$apply();
                }
            });

            var $formValidate = $('#form_validation1');
            $formValidate
            .parsley()
            .on('form:validated',function() {
                $scope.$apply();
            })
            .on('field:validated',function(parsleyField) {
                if($(parsleyField.$element).hasClass('md-input')) {
                    $scope.$apply();
                }
            });

            $scope.clearValidation=function(){
                $('#form_validation').parsley().reset();
            }
            
                $scope.monthSelectorOptions = {
                    start: "year",
                    depth: "year"
                };
                $scope.getType = function(x) {
                    return typeof x;
                };
                $scope.isDate = function(x) {
                    return x instanceof Date;
                };


            $scope.addEarning=function(){
                $scope.tit_caption="Add Earning";
                $scope.pay_type='Earnings';
                $scope.pay_name='';
                $scope.pay_amount='';
                $('.uk-modal').find('input').trigger('blur');
            }
            $scope.addDeduction=function(){
                $scope.tit_caption="Add Deduction";
                $scope.pay_type='Deductions';
                $scope.pay_name='';
                $scope.pay_amount='';
                $('.uk-modal').find('input').trigger('blur');
            }

            $scope.tableData=[];
            $scope.PaySrtuctureData=[];
            $scope.PaySrtuctureData1=[];
            $http({
                method:'GET',
                url: $localStorage.service+'PayrollPayslipAPI/fetchEmployeePayDetails',
                params:{id:$stateParams.gen_id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.tableData=return_data.data.message[0];
                $scope.employeeID=return_data.data.message[0].ID;
                $scope.structureID=return_data.data.message[0].PAY_STRUCTURE_ID;
                $scope.getPayStructure(return_data.data.message[0].PAY_STRUCTURE_ID);
            });

            console.log($scope.structureID,'$scope.structureID');
            $scope.getPayStructure=function(stru_id){
                $http({
                    method:'GET',
                    url: $localStorage.service+'PayrollPayslipAPI/fetchPayStructureDetails',
                    params:{id:stru_id},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    $scope.PaySrtuctureData = return_data.data.message;
                    angular.forEach($scope.PaySrtuctureData, function(value, keys){
                        value.changedAmount=parseFloat(value.AMOUNT).toFixed(2);
                        value.payitemVal=value.PAYITEM_ID;
                    });
                    $scope.getCalculation();       
                });
            }
            

            $scope.getCalculation=function(){ 
                var totalEarn=0;
                var totalDeduct=0;
                var basicVal=$scope.tableData.BASIC_PAY;
                angular.forEach($scope.PaySrtuctureData,function(value, keys){
                     if (value.ITEM_TYPE=='Earnings') {
                        value.AMOUNT= value.AMOUNT || 0;
                        value.payitemVal= value.PAYITEM_ID;
                        // value.changedAmount=(basicVal/value.AMOUNT).toFixed(2);
                        value.changedAmount=((value.AMOUNT/100)*basicVal).toFixed(2);
                        totalEarn+=parseFloat(value.changedAmount);
                    }else if (value.ITEM_TYPE=='Deductions'){
                        value.AMOUNT= value.AMOUNT || 0;
                        value.payitemVal= value.PAYITEM_ID;
                        // value.changedAmount=(basicVal/value.AMOUNT).toFixed(2);
                        value.changedAmount=((value.AMOUNT/100)*basicVal).toFixed(2);
                        totalDeduct+=parseFloat(value.changedAmount);
                    }
                    
                });

                var totalADDEarn=0;
                var totalADDDeduct=0;
                angular.forEach($scope.PaySrtuctureData1,function(value, keys){
                    if (value.TYPE=='Earnings') {
                        value.AMOUNT= value.AMOUNT || 0;
                        totalADDEarn+=parseFloat(value.AMOUNT);
                    }else if (value.TYPE=='Deductions'){
                        value.AMOUNT= value.AMOUNT || 0;
                        totalADDDeduct+=parseFloat(value.AMOUNT);
                    }
                    
                });
                console.log(totalADDEarn,'totalADDEarn',totalADDDeduct,'totalADDDeduct');
                var TotalNumberE=(parseFloat(basicVal)+parseFloat(totalEarn)+parseFloat(totalADDEarn)).toFixed(2);
                $scope.Total_Earning=(angular.isNumber(TotalNumberE)? 0.00:TotalNumberE);
                var TotalNumberD=parseFloat(totalDeduct)+parseFloat(totalADDDeduct);
                $scope.total_deduction=(angular.isNumber(TotalNumberD)? TotalNumberD:0.00).toFixed(2);
                var totalNetpay=parseFloat($scope.Total_Earning) - parseFloat($scope.total_deduction);
                $scope.showTotalNetpay = totalNetpay.toFixed(2);
            }
            $scope.earningCalculation=function(basicVal){
                console.log(basicVal,'basicVal');
                var perOfTotalEarn=0;
                var perOfTotalDeduc=0;
                $('[name="earningAmount"]').each(function(){
                    perOfTotalEarn+=parseFloat(basicVal)/parseFloat($(this).val());
                })

                 $('[name="deductionAmount"]').each(function(){
                    perOfTotalDeduc+=parseFloat(basicVal)/parseFloat($(this).val());
                })
                var SUMTotal_Earning=parseFloat(basicVal) + parseFloat(perOfTotalEarn);
                $scope.Total_Earning=SUMTotal_Earning.toFixed(2);
                $scope.total_deduction=parseFloat(perOfTotalDeduc).toFixed(2);
                $scope.showTotalNetpay=parseFloat($scope.Total_Earning-$scope.total_deduction).toFixed(2);
                $scope.NetpayAmount=parseFloat($scope.Total_Earning-$scope.total_deduction).toFixed(2);
            }

            $scope.addEarnVal = [];
            $scope.addDeductVal = [];
            $scope.saveAddonData=function(){
                console.log($scope.pay_type,'$scope.pay_type',$scope.pay_amount);
                if($scope.pay_type=='Earnings'){
                    $scope.PaySrtuctureData1.push({'NAME':$scope.pay_name,'AMOUNT':$scope.pay_amount,'TYPE':'Earnings'});
                }else if($scope.pay_type=='Deductions'){
                    $scope.PaySrtuctureData1.push({'NAME':$scope.pay_name,'AMOUNT':$scope.pay_amount,'TYPE':'Deductions'});
                }
                $timeout(function(){
                    $scope.getCalculation();
                },200);
                UIkit.modal("#open_Model").hide();
            }

            $scope.removeEarningItem=function($index){
                $scope.PaySrtuctureData1.splice($index, 1);
                $timeout(function(){
                    $scope.getCalculation();
                },200);
            }
            $scope.removeDeductionItem=function($index){
                $scope.PaySrtuctureData1.splice($index, 1);
                $timeout(function(){
                    $scope.getCalculation();
                },200);
            }
            // $scope.generation_date=kendo.toString(kendo.parseDate(new Date()), 'DD-MMM-YYYY');
            // $scope.generatePayslip=function(){
            //     // console.log($scope.generation_date);
            //     var date=moment($scope.generation_date,["DD-MMM-YYYY"])._d;
            //     var y = date.getFullYear(), m = date.getMonth();
            //     var firstDay = moment([y, m, 1]);
            //     var lastDay = moment(firstDay).endOf('month');
            //     var locale = "en-us";
            //     var firstDate= firstDay._d.getDate() < 10 ? '0' + firstDay._d.getDate() : '' + firstDay._d.getDate();
            //     var fromDate=firstDate+"-"+date.toLocaleString(locale, { month: "short" })+"-"+y;
            //     var toDate=lastDay._d.getDate()+"-"+date.toLocaleString(locale, { month: "short" })+"-"+y;

            //     // console.log(firstDay._d.getDate(),'fromDate');
            //     $http({
            //         method:'POST',
            //         url: $localStorage.service+'PayrollPayslipAPI/payslipGeneration',
            //         data: {
            //             'empid' : $scope.employeeID,
            //             'struc_id' : $scope.structureID,
            //             'payslipId':$scope.payslipId,
            //             'payStatus':$scope.payslip_status,
            //             'generatoin_date' : $scope.generation_date,
            //             'default_data' : $scope.PaySrtuctureData,
            //             'addon_data' : $scope.PaySrtuctureData1,
            //             'Net_pay' : $scope.showTotalNetpay,
            //             'fromdate' : fromDate,
            //             'enddate' : toDate
            //         },
            //         // headers:{'access_token':$localStorage.access_token}
            //     }).then(function(return_data){
            //         console.log(return_data.data,'rrrrrr');
            //         if(return_data.data.status==true){
            //             UIkit.notify({
            //                 message : return_data.data.message.message,
            //                 status  : 'success',
            //                 timeout : 2000,
            //                 pos     : 'top-center'
            //             });
            //             $state.go('restricted.hr.payslipGenaration_view');
            //         }else {
            //             UIkit.modal.alert('Payslip already generated for this month');
            //         }
            //     });
            // }

            // $scope.generation_date=kendo.toString(kendo.parseDate(new Date()), 'DD-MMM-YYYY');
            // $scope.generation_date=kendo.toString(kendo.parseDate(new Date()), 'YYYY-MM-DD');

            $scope.generatePayslip=function(){
                var date=moment($scope.generation_date,["YYYY-MM-DD"])._d;
                console.log(date,'dateee');
                var y = date.getFullYear(), m = date.getMonth();
                var firstDay = moment([y, m, 1]);
                var lastDay = moment(firstDay).endOf('month');
                var locale = "en-us";
                var currMonth=firstDay._d.getMonth()+1;
                var currMonth1=lastDay._d.getMonth()+1;
                var firstDate= firstDay._d.getDate() < 10 ? '0' + firstDay._d.getDate() : '' + firstDay._d.getDate();
                var firstmonth= currMonth < 10 ? '0' + currMonth : '' + currMonth;
                var lastDataofmonth= currMonth1 < 10 ? '0' + currMonth1 : '' + currMonth1;
                var fromDate=y+"-"+firstmonth+"-"+firstDate;
                var toDate=y+"-"+lastDataofmonth+"-"+lastDay._d.getDate();
                console.log(fromDate,'fromDate',toDate);
                $http({
                    method:'POST',
                    url: $localStorage.service+'PayrollPayslipAPI/payslipGeneration',
                    data: {
                        'empid' : $scope.employeeID,
                        'struc_id' : $scope.structureID,
                        'payslipId':$scope.payslipId,
                        'payStatus':$scope.payslip_status,
                        'generatoin_date' : $scope.generation_date,
                        'default_data' : $scope.PaySrtuctureData,
                        'addon_data' : $scope.PaySrtuctureData1,
                        'Net_pay' : $scope.showTotalNetpay,
                        'fromdate' : fromDate,
                        'enddate' : toDate,
                        'basicPay' : $scope.tableData.BASIC_PAY
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data,'rrrrrr');
                    if(return_data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $state.go('restricted.hr.payslipGenaration_view');
                        $timeout(function() {
                            $scope.emailSending();
                        }, 1000);
                    }else {
                        UIkit.modal.alert('Payslip already generated for this month');
                    }
                });
            }
            $scope.emailSending=function(){
                $http({
                    method:'POST',
                    url: $localStorage.service+'PayrollPayslipAPI/mailSendAfterGeneration',
                    data: {
                        'empid' : $scope.employeeID
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_data');
                });
            }
            $scope.checkStatus=function(){
                console.log($scope.generation_date,'$scope.generation_date');
                if($scope.generation_date==undefined){
                    UIkit.notify({
                        message : 'Date is Required',
                        status  : 'danger',
                        timeout : 2000,
                        pos     : 'top-center'
                    });
                }
            }
        }
    ]);