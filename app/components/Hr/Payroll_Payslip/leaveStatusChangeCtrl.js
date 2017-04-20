angular
    .module('rubycampusApp')
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
        '$state',
        function ($scope,$rootScope,$timeout,$resource,$stateParams,$filter,$location,$http,$window,$state) {
            $scope.viewData=[];
            $scope.leaveList=[];
            $http({
                method:'get',
                url: 'http://localhost/rubyServices/api/LeavemgmntAPI/leaveEntitlement',
                params: {
                    'id' : $stateParams.empid
                },
                // headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.viewData=return_data.data.message[0];
            });

            $http({
                method:'get',
                url: 'http://localhost/rubyServices/api/LeavemgmntAPI/fetchLeaveDetailList',
                params: {
                    'id' : $stateParams.empid,
                    'lineid' : $stateParams.id
                },
                // headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.leaveList=return_data.data.data[0];
            });

            $scope.changeStatus=function(id,status){
                 $http({
                    method:'POST',
                    url: 'http://localhost/rubyServices/api/LeavemgmntAPI/updateLeaveStatus',
                    data: {
                        'id' : id,
                        'check_status':status
                    },
                    // headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_data');
                    if(return_data.data.data.status==true){
                        $state.go('restricted.hr.leave_application');
                    }
                });
            }
        }
    ]);