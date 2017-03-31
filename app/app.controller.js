/*
 *  Altair Admin angularjs
 *  controller
 */

// angular
    // .module('altairApp')
    // .controller('mainCtrl', [
        // function () {}
    // ])
// ;

angular
    .module('altairApp')
    .controller('mainCtrl',
        function($scope, $http, $rootScope, $localStorage,$location) {
			$localStorage.service='http://192.168.1.136/rubyServices/api/';
            //alert($localStorage.access_token);
			if($localStorage.access_token=='' || $localStorage.access_token==undefined){
				$location.path('/');
			}
        }
    );
