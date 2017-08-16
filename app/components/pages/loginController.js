angular
    .module('rubycampusApp')
    .controller('loginCtrl', [
        '$scope',
        '$rootScope',
        'utils',
		'$http',
		'$location',
		'$localStorage',
		'$timeout',
		'$state',
		'variables',
		'$window',
        function ($scope,$rootScope,utils,$http,$location,$localStorage,$timeout,$state,variables, $window) {

            $scope.registerFormActive = false;

			
			$timeout(function(){
				var $formValidate = $('#login');
				$formValidate
				.parsley()
				.on('form:validated',function() {
					$scope.$apply();
				})
				.on('field:validated',function(parsleyField) {
					if($(parsleyField.$element).hasClass('md-input')) {
						$scope.$apply();
					}
				});
			},500)
			
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
					// url : "http://localhost/rubyServices/api/GeneralAPI/login",
					url : "http://192.168.1.139/rubyServices/api/GeneralAPI/login",
					// url : "http://campusenter.com/services/api/GeneralAPI/login",
					params : {"USER_EMAIL": $scope.login_username, "USER_PASSWORD": $scope.login_password},
				}).then(function(response){
					//console.log(response,'response111');
					if(response.data.status==true){
						$localStorage.user_id=response.data.message[0].USER_ID;
						$localStorage.access_token=response.data.access_token;
						$localStorage.role=response.data.message[0].role_name;
						$localStorage.role_id=response.data.message[0].USER_ROLE_ID;
						$localStorage.Additional_RoleId=response.data.message[0].Additional_RoleId;
						$localStorage.userProfile_id=response.data.message[0].USER_PROFILE_ID;
						$window.localStorage.access_token = response.data.access_token;
						console.log(variables,"variables");						
						// expect(variables).toEqual(response.data.access_token);
						// $localStorage.user_privileges=response.data.message[0].user_privileges;
						//$location.path('/dashboard');
						if($localStorage.role=='student'){
							$state.go('restricted.studentDashboard');
						}else{
							$state.go('restricted.dashboard');
						}
					}else{
						UIkit.notify({
							message : response.data.message,
							status  : 'danger',
							timeout : 2000,
							pos     : 'top-right'
						});
					}
				}, function myError(response) {
					$scope.authError = 'Please Enter Valid Email';
				});
			}
			
			// Recovery Details
			$scope.recovery={};
			$scope.recoveryData=function(){
				//console.log($scope.recovery,"recovery");
				if($scope.recovery!='' || $scope.recovery!=undefined){
					$http.get('http://192.168.1.139/rubyServices/api/GeneralAPI/passwordReset',{params:{userData:$scope.recovery.data}})
					.success(function(data){
						//console.log(data,"data");
						if(data.status==true){
							UIkit.modal.confirm('Password has been reset successfully,Please check your email or phone', function(){
								$state.go('login');
							});
						}
					}).error(function(err){
					});
				}
			}
			
			if($localStorage.access_token=='' || $localStorage.access_token==undefined){
				$location.path('/');
			}else{
				//$location.path('/dashboard');
				if($localStorage.role=='student'){
					$state.go('restricted.studentDashboard');
				}else{
					$state.go('restricted.dashboard');
				}
			}

        }
    ]);