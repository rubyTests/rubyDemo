angular
    .module('altairApp')
    .controller('viewpayslip_genetationCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$stateParams',
        '$filter',
        function ($scope,$rootScope,$timeout,$resource,$stateParams,$filter) {
            $resource('app/components/employeemanagement/employee_list.json')
                .query()
                .$promise
                .then(function(return_data) {
                    var paramsData=$filter('filter')(return_data, {id : $stateParams.gen_id});
                    $scope.tableArray=paramsData;
                });

                $scope.basic_val=5000;
                $scope.housing_allow=1000;
                $scope.hr_allowance=500;
                $scope.transport=750;
                $scope.Total_Earning=7250;
                $scope.grasspayTotal=7250;

                $scope.income_deduction=450;
                $scope.fund_deduction=100;
                $scope.toatl_deduction=550;
                $scope.showTotalNetpay=6700;

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

                // $('#tblBody').find('input').attr('disabled',true);
                // $scope.editPayDetails=function(){
                //     $('#tblBody').find('input').attr('disabled',false);
                // }
            $scope.earningCalculation=function(){
                var basic_val=$scope.basic_val || 0;
                var housing_allow=$scope.housing_allow || 0;
                var transport=$scope.transport || 0;
                var hr_allowance=$scope.hr_allowance || 0;
                $scope.Total_Earning=parseInt(basic_val) + parseInt(housing_allow) + parseInt(transport) + parseInt(hr_allowance);            
                $scope.grasspayTotal=$scope.Total_Earning;
                $('#earningTotal').trigger('change');
                $scope.getTotalNetPay();
            }
            $scope.getTotalDeduction=function(){
                var income_deduction=$scope.income_deduction || 0;
                var fund_deduction=$scope.fund_deduction || 0;
                $scope.toatl_deduction=parseInt(income_deduction) + parseInt(fund_deduction);
                $('#duductionTotal').trigger('change');
                $scope.getTotalNetPay();
            }
            $scope.getTotalNetPay=function(){
                var Total_Earning=$scope.Total_Earning || 0;
                var toatl_deduction=$scope.toatl_deduction || 0;
                $scope.showTotalNetpay=parseInt(Total_Earning) - parseInt(toatl_deduction);
            }

            $scope.addEarning=function(){
                $scope.tit_caption="Add Earning";
                
            }
            $scope.addDeduction=function(){
                $scope.tit_caption="Add Deduction";
            }

            $scope.addEarnVal = [];
            $scope.getPayrollEarning = function(){
                var category_name = $scope.category_name;
                var category_desc = $scope.category_desc;
                // console.log(this,'$scope.category_name');
                $scope.addEarnVal.push({'category_name':category_name,'category_desc':category_desc});
                console.log($scope.addEarnVal,"addEarnVal");
                $scope.category_name='';
                $scope.category_desc='';
            }

            $scope.addDeductVal = [];
            $scope.getPayrollDeduction = function(){
                var category_name = $scope.category_name;
                var category_desc = $scope.category_desc;
                // console.log(this,'$scope.category_name');
                $scope.addDeductVal.push({'category_name':category_name,'category_desc':category_desc});
                console.log($scope.addEarnVal,"addEarnVal");
                $scope.category_name='';
                $scope.category_desc='';
            }

            $scope.removeEarn = function(val){
                $scope.addEarnVal.pop(val);
            }

            $scope.removeDeduct = function(val){
                $scope.addDeductVal.pop(val);
            }
            // $('input').focusin(function(){
            //   $(this).css({"border": "1px solid rgb(173,208,242)" });
            // });
            // $('input').focusout(function(){
            //   $(this).css({"border": "1px solid #b3b3b3"});
            // });
        }
    ]);