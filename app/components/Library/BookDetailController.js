angular
    .module('rubycampusApp')
    .controller('BookDetailController', [
        '$scope',
        '$rootScope',
        'utils',
        '$stateParams',
        'Book_Details',
        '$filter',
        function ($scope,$rootScope,utils,$stateParams,Book_Details,$filter) {
            $scope.id=$stateParams.id;
            $scope.indexid=$stateParams.indexId;
            // alert($scope.indexid);
            $scope.Book_Details=Book_Details;
            $scope.currentBookdata=$scope.Book_Details[$scope.indexid];
        }
    ]);