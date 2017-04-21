angular
    .module('rubycampusApp')
    .controller('feeStructureViewCtrl', [
        '$scope',
        '$window',
        '$timeout',
        '$resource',
        '$filter',
        '$stateParams',
        '$http',
        '$localStorage',
        function ($scope,$window,$timeout,$resource,$filter,$stateParams,$http,$localStorage) {
            $scope.viewData=[];
            // $scope.categoryList=[];
            $http({
            method:'get',
            url: $localStorage.service+'LeavemgmntAPI/leaveEntitlement',
            params: {
                'id' : $stateParams.empid
            },
            headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                console.log(return_data,'return_data');
                $scope.viewData=return_data.data.message[0];
            });

            $http({
            method:'get',
            url: $localStorage.service+'LeavemgmntAPI/fetchEmployeeLeaveType',
            params: {
                'id' : $stateParams.empid
            },
            headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                // console.log(return_data.data.message,'list11');
                $scope.categoryList=return_data.data.message;
            });
            // $resource('app/components/employeemanagement/employee_list.json')
            // .query()
            // .$promise
            // .then(function(employee_data) {
            //     var paramsData=$filter('filter')(employee_data, {id : $stateParams.empid});
            //     $scope.employeeData=paramsData;
            // });

            // $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/LeaveCategory.json')
            // .query()
            // .$promise
            // .then(function(leavecategory_data) {
            //     var paramsData1=$filter('filter')(leavecategory_data, {id : $stateParams.empid});
            //     $scope.employeeCategory = paramsData1;
            // });
        }
    ]);