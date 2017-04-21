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
        '$localStorage',
        function ($scope,$rootScope,$timeout,$resource,$stateParams,$filter,$location,$http,$window,$state,$localStorage) {
            $scope.viewData=[];
            $scope.leaveList=[];
            $http({
                method:'get',
                url: $localStorage.service+'LeavemgmntAPI/leaveEntitlement',
                params: {
                    'id' : $stateParams.empid
                },
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.viewData=return_data.data.message[0];
            });

            $http({
                method:'get',
                url: $localStorage.service+'LeavemgmntAPI/fetchLeaveDetailList',
                params: {
                    'id' : $stateParams.empid,
                    'lineid' : $stateParams.id
                },
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.leaveList=return_data.data.data[0];
            });

            $scope.changeStatus=function(id,status){
                 $http({
                    method:'POST',
                    url: $localStorage.service+'LeavemgmntAPI/updateLeaveStatus',
                    data: {
                        'id' : id,
                        'check_status':status
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_data');
                    if(return_data.data.data.status==true){
                        $state.go('restricted.hr.leave_application');
                    }
                });
            }
        }
    ]);