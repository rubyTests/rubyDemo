angular
    .module('rubycampusApp')
    .controller('institution_detailsViewCtrl', [
        '$scope',
        'utils',
        '$http','$rootScope', '$filter','$compile', '$scope', '$timeout','$state','$localStorage',
        function ($scope,utils,$http,$rootScope, $filter,$compile, $scope, $timeout,$state,$localStorage) {
            
            $http({
              method : "GET",
              url : $localStorage.service+"InstitutionAPI/institutionDetails",
              headers:{'access_token':$localStorage.access_token}
            }).then(function(response) {
                $timeout(function(){
					$scope.instView=response.data.data[0];
                },200);
              });
        }
    ]);