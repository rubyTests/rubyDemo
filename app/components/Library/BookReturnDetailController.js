angular
    .module('rubycampusApp')
    .controller('BookReturnDetailController', [
        '$scope',
        '$rootScope',
        'utils',
        '$stateParams',
        '$filter',
        '$state',
        '$localStorage',
        '$http',
        function ($scope,$rootScope,utils,$stateParams,$filter,$state,$localStorage,$http) {
            $scope.id=$stateParams.id;
            // $scope.indexid=$stateParams.indexId;
            // // alert($scope.indexid);
            // $scope.Book_Details=Book_Details;
            // $scope.currentBookdata=$scope.Book_Details[$scope.indexid];

            $scope.book_data = [];
            $http({
                method:'GET',
                url: $localStorage.service+'LibraryAPI/fetchBookReturnIdViewData',
                params: {
                    'id' : $stateParams.id,
                },
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                console.log(return_data,'return_datareturn_data');
                $scope.book_data = return_data.data.message[0];
            });
        }
    ]);