angular
    .module('rubycampusApp')
    .controller('paymentParentsCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$stateParams',
        '$filter',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        '$compile',
        '$location',
        '$window',
        '$http',
        '$localStorage','$state',
        function ($scope,$rootScope,$timeout,$resource,$stateParams,$filter,DTOptionsBuilder, DTColumnDefBuilder,$compile,$location,$window,$http,$localStorage,$state) {
            var vm = this;
            $scope.viewData=[];
            $scope.Payment_History=[];
            $scope.nextDueList=[];
            $http({
                method:'GET',
                url: $localStorage.service+'ProfileAPI/studentBasicandPaymentDetails',
                params:{profileId:$localStorage.userProfile_id,roleId:$localStorage.role_id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(response_data){
                console.log(response_data.data.message,'response_data');
                $scope.viewData=response_data.data.message[0];
            });

            // payment History

            $http({
                method:'GET',
                url: $localStorage.service+'ProfileAPI/studentFeePaymentHistory',
                params:{profileId:$localStorage.userProfile_id,roleId:$localStorage.role_id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(response_history){
                console.log(response_history.data.message,'response_history');
                $scope.Payment_History=response_history.data.message;
            });

            // next due
            $http({
                method:'GET',
                url: $localStorage.service+'ProfileAPI/getNextDueList',
                params:{profileId:$localStorage.userProfile_id,roleId:$localStorage.role_id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(response_history){
                console.log(response_history.data.message,'response_history');
                $scope.nextDueList=response_history.data.message;
            });
            $scope.payAmount=function(amount,paidAmount){
                $localStorage.PayAMounts=parseFloat(amount)-parseFloat(paidAmount);
                $state.go('restricted.student.paymentPay');
            }
        }
    ]);