angular
    .module('rubycampusApp')
    .controller('mainCtrl',
        function($scope, $http, $rootScope, $localStorage,$location) {
			$localStorage.service='http://192.168.1.139/rubyServices/api/';
			$localStorage.uploadUrl='http://192.168.1.139/rubyServices/upload/';
			// $localStorage.service='http://campusenter.com/services/api/';
			// $localStorage.uploadUrl='http://campusenter.com/services/upload/';
            //alert($localStorage.access_token);
            // $localStorage.service='http://localhost/rubyServices/api/';
			if($localStorage.access_token=='' || $localStorage.access_token==undefined){
				$location.path('/');
			}
        }
    );
