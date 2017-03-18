angular
    .module('altairApp')
    .controller('addassignemployeeCtrl', [
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
                    var paramsData=$filter('filter')(return_data, {id : $stateParams.id});
                    $scope.tableArray=paramsData;
                });
            $scope.selectize_dept_data =['Computer Science And Engineering','Electronic Communication Engineering','Materials Science engineering','Electrical and Electronics Engineering'];
            $scope.selectize_dept_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department...',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        var deptReturn_Data=$filter('filter')($scope.tableArray, {Dept : value});
                        $scope.tableView_data = deptReturn_Data;
                        $('#page_content_inner').trigger('click');
                    });
                }
            };

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

            // $('input').focusin(function(){
            //   $(this).css({"border": "1px solid rgb(173,208,242)" });
            // });
            // $('input').focusout(function(){
            //   $(this).css({"border": "1px solid #b3b3b3"});
            // });
        }
    ]);