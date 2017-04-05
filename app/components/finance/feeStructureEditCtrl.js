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
                $scope.EditableData.push(paramsData[0]);
                 console.log($scope.EditableData,'TestData');
            });
            
            $scope.dataVal = { "Fee_Item_Name": "", "Amount": "", "DueDate": "", "Frequency": "", "Fine": "" };
            $scope.cloneSection = function($event,$index) {
                $event.preventDefault();
                $scope.EditableData[0].FeeItemCount.push($scope.dataVal);
            };

            $scope.backBtn = function(){
                window.history.back();
            }

        }
    ]);