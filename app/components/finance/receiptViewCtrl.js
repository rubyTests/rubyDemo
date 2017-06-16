angular
    .module('rubycampusApp')
    .controller('receiptViewCtrl', [
        '$scope',
        '$rootScope',
        '$window',
        '$timeout','$localStorage','$http','$filter','$stateParams',
        function ($scope,$rootScope,$window,$timeout,$localStorage,$http,$filter,$stateParams) {
            $scope.itemsTotal=0;
            console.log($stateParams,'stateParams-Feepayment');
            $rootScope.page_full_height = true;
            $rootScope.headerDoubleHeightActive = true;

            $scope.$on('$destroy', function() {
                $rootScope.page_full_height = false;
                $rootScope.headerDoubleHeightActive = false;
            });

            $http({
                url: $localStorage.service+'FinanceAPI/paymentDetails',
                method : 'GET',
                params : {
                    'student_feeid':$stateParams.feepaymentid
                },
                headers: { 'access_token':$localStorage.access_token},
            }).success(function(response) {
                // console.log(response.message[0],'response');
                $scope.viewDetail=response.message[0];
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

            $http({
                url: $localStorage.service+'FinanceAPI/institutionDetails',
                method : 'GET',
                headers: { 'access_token':$localStorage.access_token},
            }).success(function(response) {
                console.log(response,'Institution');
                $scope.instituteDetails=response.message[0];
            }).error(function(data){
                console.log('error');
            });
        }
    ]);