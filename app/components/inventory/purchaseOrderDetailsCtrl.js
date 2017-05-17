angular
    .module('rubycampusApp')
    .controller('purchaseOrderDetailsCtrl', [
    	'$rootScope',
        '$scope',
        '$window',
        '$timeout',
        'variables',
        '$http',
        '$stateParams',
        '$filter',
        '$localStorage',
        function ($rootScope, $scope, $window, $timeout, variables, $http, $stateParams, $filter, $localStorage) {
        	$http({
                method:'GET',
                url: $localStorage.service+'inventoryApi/fetchAllPurchaseOrder',
                params: {
                    'id' : $stateParams.id,
                },
                headers:{'access_token':$localStorage.access_token}
            }).then(function(purchase_order_data){
            	console.log(purchase_order_data,'purchase_order_data');
            	$scope.po_data = purchase_order_data.data.data[0];
            });
        }
    ]);