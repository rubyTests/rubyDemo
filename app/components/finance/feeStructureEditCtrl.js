angular
    .module('altairApp')
    .controller('feeStructureEditCtrl', [
        '$scope',
        '$rootScope',
        '$window',
        '$timeout',
        '$stateParams',
        '$resource',
        '$filter',
        function ($scope,$rootScope,$window,$timeout,$stateParams,$resource,$filter) {
            // $scope.checkCondition=function (data, value) {
            //     if (data==value) {
            //         console.log(data,'Data');
            //         console.log(value,'Value');
            //         return true;
            //     }
            // }
            $scope.EditableData = [];
            $resource('data/finance/feestructureNew.json')
            .query()
            .$promise
            .then(function(return_data) {
                var paramsData=$filter('filter')(return_data, {id : $stateParams.Assign_Id});
                $scope.EditableData=paramsData[0];
                 console.log($scope.EditableData,'TestData');
            });

        }
    ]);