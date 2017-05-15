angular
    .module('rubycampusApp')
    .controller('verificationCtrl', [
        '$scope',
        '$rootScope',
        'utils',
		'$http',
		'$location',
		'$localStorage',
		'$stateParams',
		'$state',
		'$timeout',
        function ($scope,$rootScope,utils,$http,$location,$localStorage,$stateParams,$state,$timeout) {
			//console.log($stateParams.token,"Token");
			$scope.checkOtp=false;
			$scope.phoneOtp=true;
			$scope.user={};
			$http.get('http://192.168.1.139/rubyServices/api/GeneralAPI/setPasswordDetail',{params:{token:$stateParams.token}})
			.success(function(data){
				//console.log(data,"data");
				if(data.status==true){
					$scope.statusMsg=true;
					$scope.profileId=data.result[0].USER_PROFILE_ID;
					$scope.user={id:data.result[0].USER_PROFILE_ID,email:data.result[0].USER_EMAIL,password:'',cPassword:''};
				}else{
					UIkit.modal.confirm('Sorry Your token has been already verified', function(){
						$state.go('login');
					}, function(){
						$state.go('login');
					});
				}
			}).error(function(err){
			});
			
			setTimeout(function(){
				var $formValidate = $('#verification');
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
			},1500)
			
			// $scope.pass1=function(){
				// $timeout(function(){
					// $('#verification').find('#pass2').parsley().validate(true);
				// },500);
				// //console.log($scope.user.password)
			// }
			$scope.otp={};
			$scope.setPassword=function(){
				// console.log($scope.otp.phoneOtp,'phoneOtp');
				if($scope.checkOtp==false){
					$http.get('http://192.168.1.139/rubyServices/api/GeneralAPI/checkOtp',{params:{otp:$scope.otp.phoneOtp,profileId:$scope.profileId}})
					.success(function(data){
						//console.log(data,"data");
						if(data.status==true){
							$scope.checkOtp=data.status;
							$scope.phoneOtp=false;
							UIkit.notify({
								message : 'Your OTP Verified Successfully',
								status  : 'success',
								timeout : 1000,
								pos     : 'top-right'
							});
						}
					}).error(function(err){
					});
				}else{
					if($scope.user.password==$scope.user.cPassword){
						$http({
						method:'POST',
						url: 'http://192.168.1.139/rubyServices/api/GeneralAPI/setPasswordDetail',
						data: {userData:$scope.user}
						}).then(function(response){
							//console.log(response,'Resp');
							if(response.data.status==true){
								$state.go('login');
							}
						});
					}
				}
			}
			
        }
    ]);