angular
    .module('rubycampusApp')
    .controller('feeStructViewCtrl', [
        '$scope',
        '$window',
        '$timeout','$localStorage','$http','$filter','$stateParams',
        function ($scope,$window,$timeout,$localStorage,$http,$filter,$stateParams) {
        	console.log($stateParams.feepaymentId,'$stateParams');
        	$http({
                url: $localStorage.service+'FinanceAPI/fetchStudentDetailfeelist',
                method : 'GET',
                params:{'feepaymentid':$stateParams.feepaymentId},
                headers: { 'access_token':$localStorage.access_token},
            }).success(function(response) {
                $scope.studentDetails=response.message[0];
                $scope.studentDetailsList=response.message;
            }).error(function(data){
                console.log('error');
            });

        }
    ]);