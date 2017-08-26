angular
    .module('rubycampusApp')
    .controller('birthdayListViewCtrl', [
        '$rootScope',
        '$scope',
        '$window',
		'$http',
        '$localStorage',
		function ($rootScope,$scope,$window,$http,$localStorage) {

			$scope.default_image='assets/img/man.png'
			// bday list
			$http.get($localStorage.service+'ProfileAPI/birthDayList',{headers: {'access_token':$localStorage.access_token}})
            .success(function(data){
				if(data.status==true){
					$scope.contact_list=data.result;
				}
            }).error(function(err){
            });
			
            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $scope.$apply(function () {
                    UIkit.grid($('#contact_list'),{
                        controls: '#contact_list_filter',
                        gutter: 20
                    });
                });
            })

        }
    ]);