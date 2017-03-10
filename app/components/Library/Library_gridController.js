angular
    .module('altairApp')
    .controller('Library_gridController', [
        '$scope',
        '$rootScope',
        'products_data',
        function ($scope,$rootScope,products_data) {
            // products data
            $scope.products_data =products_data;
            console.log($scope.products_data,'$scope.products_data');

        }
    ])
;