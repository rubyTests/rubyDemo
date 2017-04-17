angular
    .module('rubycampusApp')
    .controller('studentprofileCtrl', [
        '$rootScope',
        '$scope',
        'user_data',
        '$stateParams',
        '$filter',
		'$localStorage',
		'$http',
        function ($rootScope,$scope,user_data,$stateParams,$filter,$localStorage,$http) {    
            console.log($stateParams,'stateParams');
            
			$http.get($localStorage.service+'ProfileAPI/parentsDetails',{params:{id:$stateParams.stu_id},headers: {'access_token':$localStorage.access_token} })
			.success(function(data){
				// console.log(data.result,"data");
				$scope.user_data=data.result[0].user_detail;
				console.log($scope.user_data,"data")
				$scope.profileId=$scope.user_data.id;
				$scope.parents_data=data.result[0].user_parents;
				$scope.pre_edu=data.result[0].pre_edu;
				//console.log($scope.parents_data,"parents_data")
			}).error(function(err){
			});
			
			// var paramsData=$filter('filter')(user_data, {id : $stateParams.stu_id});
            // $scope.user_data = paramsData[0];
        }
    ])
;