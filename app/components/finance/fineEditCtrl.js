angular
.module('altairApp')
.controller('fineEditCtrl', [
    '$scope',
    '$rootScope',
    '$window',
    '$timeout',
    '$stateParams',
    '$resource',
    '$filter',
    function ($scope,$rootScope,$window,$timeout,$stateParams,$resource,$filter) {
        
        $scope.EditData = [];
        $resource('data/finance/fine.json')
        .query()
        .$promise
        .then(function(return_data) {
            var paramsData=$filter('filter')(return_data, {id : $stateParams.Row_Id});
            $scope.EditData.push(paramsData[0]);
             console.log($scope.EditData,'TestData');
        });

        $scope.$on('onLastRepeat', function (scope, element, attrs) {
            altair_uikit.reinitialize_grid_margin();
        });

        $scope.dataVal = { "Days_After_Due": "", "Fine_Value": "", "Fine_Mode": "" };
        $scope.cloneSection = function($event,$index) {
            $event.preventDefault();
            $scope.EditData[0].Fine_Slab.push($scope.dataVal);
        };
        $scope.checkedcallback=function(name, value){
            console.log(name +"---"+ value)
            if(name == value){
                // name = value;
                return true;
            }else{
                return false;
            }
        }
    }
]);