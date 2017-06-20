angular
    .module('rubycampusApp')
    .controller('parentReceiptViewCtrl', [
        '$scope',
        '$rootScope',
        '$window',
        '$timeout','$localStorage','$http','$stateParams',
        function ($scope,$rootScope,$window,$timeout,$localStorage,$http,$stateParams) {

            $rootScope.page_full_height = true;
            $rootScope.headerDoubleHeightActive = true;

            $scope.$on('$destroy', function() {
                $rootScope.page_full_height = false;
                $rootScope.headerDoubleHeightActive = false;
            });

            $http({
                url: $localStorage.service+'FinanceAPI/institutionDetails',
                method : 'GET',
                headers: { 'access_token':$localStorage.access_token},
            }).success(function(response) {
                console.log(response,'Institution');
                $scope.instituteDetails=response.message[0];
                var totalPaidAMOUNTS=0;
                angular.forEach(response.message[0].itemlist, function(value, key) {
                  console.log(value.PAID_AMOUNT,'value');
                  totalPaidAMOUNTS+=value.PAID_AMOUNT;
                });
                // console.log(totalPaidAMOUNTS,'totalPaidAMOUNTS');
                $scope.TOTAL_PAID=totalPaidAMOUNTS;
            }).error(function(data){
                console.log('error');
            });

            console.log($stateParams.PAYMENT_ID,'$stateParams');
            $http({
                url: $localStorage.service+'FinanceAPI/paymentDetails',
                method : 'GET',
                params : {
                    'student_feeid':$stateParams.PAYMENT_ID
                },
                headers: { 'access_token':$localStorage.access_token},
            }).success(function(response) {
                $scope.viewDetail=response.message[0];
            }).error(function(data){
                console.log('error');
            });
        }
    ]);