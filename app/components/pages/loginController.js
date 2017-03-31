angular
    .module('altairApp')
    .controller('loginCtrl', [
        '$scope',
        '$rootScope',
        'utils',
		'$http',
		'$location',
		'$localStorage',
        function ($scope,$rootScope,utils,$http,$location,$localStorage) {

            $scope.registerFormActive = false;

            var $login_card = $('#login_card'),
                $login_form = $('#login_form'),
                $login_help = $('#login_help'),
                $register_form = $('#register_form'),
                $login_password_reset = $('#login_password_reset');

            // show login form (hide other forms)
            var login_form_show = function() {
                $login_form
                    .show()
                    .siblings()
                    .hide();
            };

            // show register form (hide other forms)
            var register_form_show = function() {
                $register_form
                    .show()
                    .siblings()
                    .hide();
            };

            // show login help (hide other forms)
            var login_help_show = function() {
                $login_help
                    .show()
                    .siblings()
                    .hide();
            };

            // show password reset form (hide other forms)
            var password_reset_show = function() {
                $login_password_reset
                    .show()
                    .siblings()
                    .hide();
            };

            $scope.loginHelp = function($event) {
                $event.preventDefault();
                utils.card_show_hide($login_card,undefined,login_help_show,undefined);
            };

            $scope.backToLogin = function($event) {
                $event.preventDefault();
                $scope.registerFormActive = false;
                utils.card_show_hide($login_card,undefined,login_form_show,undefined);
            };

            $scope.registerForm = function($event) {
                $event.preventDefault();
                $scope.registerFormActive = true;
                utils.card_show_hide($login_card,undefined,register_form_show,undefined);
            };

            $scope.passwordReset = function($event) {
                $event.preventDefault();
                utils.card_show_hide($login_card,undefined,password_reset_show,undefined);
            };
			
			// Get Login Details
			$scope.getLogin=function(){
				$http({
					method : "GET",
					url : "http://192.168.1.136/rubyServices/api/GeneralAPI/login",
					params : {"USER_EMAIL": $scope.login_username, "USER_PASSWORD": $scope.login_password},
				}).then(function(response){
					if(response.data.status==true){
						$localStorage.user_id=response.data.message[0].USER_FIRST_NAME;
						$localStorage.access_token=response.data.access_token;
						$location.path('/dashboard');
					}
				}, function myError(response) {
					$scope.authError = 'Please Enter Valid Email';
				});
			}
			
			if($localStorage.access_token=='' || $localStorage.access_token==undefined){
				$location.path('/');
			}else{
				$location.path('/dashboard');
			}

        }
    ]);