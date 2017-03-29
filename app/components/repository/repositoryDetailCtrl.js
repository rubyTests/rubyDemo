angular
.module('altairApp')
.controller('repositoryDetailCtrl', [
    '$scope',
    '$rootScope',
    '$window',
    '$timeout',
    '$stateParams',
    '$resource',
    '$filter',
    function ($scope,$rootScope,$window,$timeout,$stateParams,$resource,$filter) {
        
        console.log($stateParams,'$stateParams');
        
        $scope.viewData = [];
        $resource('data/repository/post.json')
        .query()
        .$promise
        .then(function(return_data) {
            var paramsData=$filter('filter')(return_data, {id : $stateParams.ReposId});
            $scope.viewData.push(paramsData[0]);
            $scope.recentpost = return_data;
        });
    }
]);