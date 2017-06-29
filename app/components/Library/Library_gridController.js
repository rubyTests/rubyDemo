angular
    .module('rubycampusApp')
    .controller('Library_gridController', [
        '$scope',
        '$rootScope',
        'products_data',
        '$stateParams',
        '$filter',
        '$state',
        '$localStorage',
        '$http',
        function ($scope,$rootScope,products_data,$stateParams,$filter,$state,$localStorage,$http) {

            $rootScope.toBarActive = true;
            $scope.$on('$destroy', function() {
                $rootScope.toBarActive = false;
            });

            // products data
            // $scope.products_data =products_data;
            // console.log($scope.products_data,'$scope.products_data');

            $scope.viewData=[];
            $http({
                method:'GET',
                url: $localStorage.service+'LibraryAPI/lBook',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.viewData = return_data.data.message;
            });
            var categoryDataNames = $scope.viewData.map(function(item){return item.Category;});

            var subjectNames = $scope.viewData.map(function(item){return item.Subject;});

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

            $scope.pageSize = 20;
            $scope.filter_pageSize = ['10', '20', '30' , '50'];
        }
    ])
;