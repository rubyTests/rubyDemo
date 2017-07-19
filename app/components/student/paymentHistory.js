angular
    .module('rubycampusApp')
    .controller('paymentHistory', [
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
        '$localStorage',
        function ($scope,$rootScope,$timeout,$resource,$stateParams,$filter,DTOptionsBuilder, DTColumnDefBuilder,$compile,$location,$window,$http,$localStorage) {
            var vm = this;
            $scope.paymentList=[];
            console.log($stateParams.FEE_PAYMENT_ID,'$stateParams');

            $http({
                method:'GET',
                url: $localStorage.service+'ProfileAPI/studentFeepaymentList',
                params:{feepayment_id:$stateParams.FEE_PAYMENT_ID},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(response_history){
                console.log(response_history.data.message,'response_history');
                $scope.paymentList=response_history.data.message;
                $scope.totalAmount=0;
                angular.forEach($scope.paymentList,function(value,key){
                    console.log(value,'va',key);
                    $scope.totalAmount +=parseFloat(value.PAID_AMOUNT || 0) + parseFloat(value.FINE_AMOUNT || 0);
                })
                $scope.Total_PAID_AMOUNT=parseFloat($scope.totalAmount).toFixed(2);
            });
        }
    ]);