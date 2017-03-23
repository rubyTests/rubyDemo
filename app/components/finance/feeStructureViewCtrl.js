angular
    .module('altairApp')
    .controller('feeStructureViewCtrl', [
        '$scope',
        '$rootScope',
        '$window',
        '$timeout',
        '$stateParams',
        '$resource',
        '$filter',
        function ($scope,$rootScope,$window,$timeout,$stateParams,$resource,$filter) {

            $scope.ViewData = [];
            $resource('data/finance/feestructureNew.json')
            .query()
            .$promise
            .then(function(return_data) {
                var paramsData=$filter('filter')(return_data, {id : $stateParams.Assign_Id});
                $scope.ViewData=paramsData[0];
                 console.log($scope.ViewData,'TestData');
            });


            $scope.checkbox_demo_1 = true;

        }
    ]);