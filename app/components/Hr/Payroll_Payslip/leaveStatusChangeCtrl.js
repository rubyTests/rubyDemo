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

            $scope.changeStatus=function(id,empProID,status){
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
                        if(status=='Approved'){
                            $scope.emailSending(empProID);
                        }
                        $state.go('restricted.hr.leave_application');
                    }
                });
            }

            // $timeout(function() {
                $scope.emailSending=function(Emp_PROF_ID){
                    $http({
                        method:'POST',
                        url: $localStorage.service+'LeavemgmntAPI/sendApproveEmail',
                        data:{
                            'emp_prof_Id':Emp_PROF_ID,
                        },
                        headers:{'access_token':$localStorage.access_token}
                    }).then(function(response){
                        console.log(response,'response');
                    });
                }
            // }, 100);
        }
    ]);