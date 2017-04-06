angular
    .module('rubycampusApp')
    .controller('windowCtrl', [
        '$scope',
        function ($scope) {
            $scope.hello = "Hello from Controller!";
        }
    ]);