angular
    .module('rubycampusApp')
    .controller('billingDetailsCtrl', [
        '$scope',
        '$rootScope',
        '$window',
        '$timeout',
        '$http',
        '$stateParams',
        '$filter',
        '$localStorage',
        function ($scope, $rootScope, $window, $timeout, $http, $stateParams, $filter, $localStorage) {
        	$http({
                method:'GET',
                url: $localStorage.service+'inventoryApi/fetchAllBilling',
                params: {
                    'id' : $stateParams.id,
                },
                headers:{'access_token':$localStorage.access_token}
            }).then(function(purchase_order_data){
            	console.log(purchase_order_data,'purchase_order_data');
            	$scope.billing_data = purchase_order_data.data.data[0];
            });
        }
    ]);