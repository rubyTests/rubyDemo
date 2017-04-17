angular
.module('rubycampusApp')
.controller('repositoryDetailCtrl', [
    '$scope',
    '$rootScope',
    '$window',
    '$timeout',
    '$stateParams',
    '$resource',
    '$filter',
    function ($scope,$rootScope,$window,$timeout,$stateParams,$resource,$filter) {
                
        $scope.viewData = [];
        $resource('data/repository/post.json')
        .query()
        .$promise
        .then(function(return_data) {
            var paramsData=$filter('filter')(return_data, {id : $stateParams.ReposId});
            $scope.viewData.push(paramsData[0]);
            $scope.recentpost = return_data;
            $scope.repData = paramsData[0];
        });

        $scope.repData = [];

        $scope.getDetails = function(data){
            $scope.repData = data;
        }
    }
]);