angular
    .module('rubycampusApp')
    .controller('mainCtrl',
        function($scope, $http, $rootScope, $localStorage,$location,$state) {
			$localStorage.uploadUrl='http://192.168.1.139/rubyServices/upload/';
			$localStorage.service='http://192.168.1.139/rubyServices/api/';
			// $localStorage.service='http://campusenter.com/services/api/';
			// $localStorage.uploadUrl='http://campusenter.com/services/upload/';
            //alert($localStorage.access_token);
			
			$http.get($localStorage.service+'GeneralAPI/checkAccessToken',{params:{access_token:$localStorage.access_token}})
			.success(function(data){
				console.log(data,"data");
				if(data.message=='Invalid User Access Token'){
					$localStorage.access_token='';
					$state.go("login");
				}
			});
			
			// if($localStorage.access_token=='' || $localStorage.access_token==undefined){
				// $location.path('/');
			// }
        }
    );
