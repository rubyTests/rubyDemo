angular
    .module('rubycampusApp')
    .controller('mainCtrl',
        function($scope, $http, $rootScope, $localStorage,$location) {
			$localStorage.service='http://192.168.1.122/rubyServices/api/';
			$localStorage.uploadUrl='http://192.168.1.122/rubyServices/upload/';
            //alert($localStorage.access_token);
			if($localStorage.access_token=='' || $localStorage.access_token==undefined){
				$location.path('/');
			}
        }
    );
