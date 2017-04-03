angular
    .module('altairApp')
    .controller('leaveStatusChangeCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$stateParams',
        '$filter',
        '$location',
        '$http',
        '$window',
        function ($scope,$rootScope,$timeout,$resource,$stateParams,$filter,$location,$http,$window) {
            $resource('app/components/employeemanagement/employee_list.json')
                .query()
                .$promise
                .then(function(return_data) {
                    var paramsData=$filter('filter')(return_data, {id : $stateParams.empid});
                    $scope.tableArray=paramsData;
                });

                var path=$location.path().split( '/' );
                $scope.urlname=path[1];

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


                $('#tblBody').find('input').attr('disabled',true);
                $scope.editPayDetails=function(){
                    $('#tblBody').find('input').attr('disabled',false);
                }
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

            $scope.generatePdf = function(id) {
              $http({
                url : 'http://localhost/ruby/Rubyctrl/index',
                method : 'POST',
                data : { 'id':id},
                responseType : 'arraybuffer',
                headers: {
                 'Content-type' : 'application/pdf'
                },
                cache: true,
               }).success(function(data) {
                var blob = new Blob([data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(blob);
                var fileName = "1099.pdf";
                var contentFile = blob;
                $window.open(fileURL, "_blank");
               }).error(function(data){
                console.log('error');
               });
            }

            $scope.backBtn = function(){
                window.history.back();
            }
        }
    ]);