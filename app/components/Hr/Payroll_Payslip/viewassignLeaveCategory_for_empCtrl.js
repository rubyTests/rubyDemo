angular
    .module('rubycampusApp')
    .controller('feeStructureViewCtrl', [
        '$scope',
        '$window',
        '$timeout',
        '$resource',
        '$filter',
        '$stateParams',
        function ($scope,$window,$timeout,$resource,$filter,$stateParams) {
            $scope.employeeData=[];
            $scope.employeeCategory=[];
            $resource('app/components/employeemanagement/employee_list.json')
            .query()
            .$promise
            .then(function(employee_data) {
                var paramsData=$filter('filter')(employee_data, {id : $stateParams.empid});
                $scope.employeeData=paramsData;
            });

            $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/LeaveCategory.json')
            .query()
            .$promise
            .then(function(leavecategory_data) {
                var paramsData1=$filter('filter')(leavecategory_data, {id : $stateParams.empid});
                $scope.employeeCategory = paramsData1;
            });
        }
    ]);