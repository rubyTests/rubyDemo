angular
    .module('rubycampusApp')
    .controller('addMarkDetailsCtrl', [
        '$compile',
        '$scope',
        '$window',
        '$timeout',
        '$resource',
        function ($compile,$scope,$window,$timeout,$resource) {

			$resource('app/components/academics/examination/marks.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.dt_data = dt_data;
                });
        }
    ]);