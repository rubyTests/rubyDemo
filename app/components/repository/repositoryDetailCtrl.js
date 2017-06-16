angular
.module('rubycampusApp')
.controller('repositoryDetailCtrl', [
    '$scope',
    '$rootScope',
    '$window',
    '$timeout',
    '$stateParams',
    '$resource',
    '$filter',
    '$http',
    '$localStorage',
    function ($scope,$rootScope,$window,$timeout,$stateParams,$resource,$filter,$http,$localStorage) {
                
        // $scope.viewData = [];
        // $resource('data/repository/post.json')
        // .query()
        // .$promise
        // .then(function(return_data) {
        //     var paramsData=$filter('filter')(return_data, {id : $stateParams.ReposId});
        //     $scope.viewData.push(paramsData[0]);
        //     $scope.recentpost = return_data;
        //     $scope.repData = paramsData[0];
        // });

        // $scope.repData = [];

        $scope.Rep_data = [];
        $http({
            method:'GET',
            url: $localStorage.service+'RepositoryAPI/Rep_Post',
            params: {
                'id' : $stateParams.ReposId,
            },
            headers:{'access_token':$localStorage.access_token}
        }).then(function(return_data){
            // console.log(return_data,'return_datareturn_data');
            $scope.Rep_data = return_data.data.message[0];
            $scope.Rep_data.extention = $scope.Rep_data.UPLOAD_FILE.split(".").pop().toLowerCase();
            if($scope.Rep_data.extention=='mp4' || $scope.Rep_data.extention=='ogg'){
                var myVideo = document.getElementsByTagName('video')[0];
                myVideo.src = 'assets/uploads/'+$scope.Rep_data.UPLOAD_FILE;
                myVideo.load();
                myVideo.play();    
            }
            
            $scope.recentpost = return_data.data.message;
        });

        $scope.viewData=[];
        $http({
            method:'GET',
            url: $localStorage.service+'RepositoryAPI/Rep_Post',
            headers:{'access_token':$localStorage.access_token}
        }).then(function(return_data){
            $scope.viewData=return_data.data.message;
        });

        // $scope.getDetails = function(data){
        //     $scope.repData = data;
        // }
    }
]);