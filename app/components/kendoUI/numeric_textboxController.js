angular
    .module('rubycampusApp')
    .controller('numericTextboxCtrl', [
        '$scope',
        function ($scope) {
            $scope.value = 50;
        }
    ]);