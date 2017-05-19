angular
    .module('rubycampusApp')
    .controller('feeStructureViewCtrl', [
        '$scope',
        '$rootScope',
        '$window',
        '$timeout',
        '$stateParams',
        '$resource',
        '$filter','$localStorage','$http',
        function ($scope,$rootScope,$window,$timeout,$stateParams,$resource,$filter,$localStorage,$http) {
            $http({
                url: $localStorage.service+'FinanceAPI/feeStructureView',
                method : 'GET',
                params:{'id':$stateParams.Assign_Id},
                headers: { 'access_token':$localStorage.access_token},
            }).success(function(response) {
                console.log(response.message,'success');
                $scope.viewData=response.message[0];
            }).error(function(data){
                console.log('error');
            });
        }
    ]);