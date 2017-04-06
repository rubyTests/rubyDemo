angular
    .module('rubycampusApp')
    .controller('Library_gridController', [
        '$scope',
        '$rootScope',
        'products_data',
        function ($scope,$rootScope,products_data) {

            $rootScope.toBarActive = true;
            $scope.$on('$destroy', function() {
                $rootScope.toBarActive = false;
            });

            // products data
            $scope.products_data =products_data;
            console.log($scope.products_data,'$scope.products_data');

            var categoryDataNames = $scope.products_data.map(function(item){return item.Category;});

            var subjectNames = $scope.products_data.map(function(item){return item.Subject;});

            $scope.selectize_subject_options = subjectNames;
            $scope.selectize_subject_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Find Subject'
            };

            $scope.selectize_category_options = categoryDataNames;
            $scope.selectize_category_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Find Catecory'
            };

        }
    ])
;