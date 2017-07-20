angular
    .module('rubycampusApp')
    .controller('employee_profileCtrl', [
        '$rootScope',
        '$scope',
        'user_data',
        '$stateParams',
        '$filter',
        '$http',
        '$localStorage',
        function ($rootScope,$scope,user_data,$stateParams,$filter,$http,$localStorage) {    
            // console.log($stateParams,'stateParams');
            // var paramsData=$filter('filter')(user_data, {id : $stateParams.emp_id});
            // $scope.user_data = paramsData[0];

			$scope.proId=$stateParams.emp_id;
			$scope.empProtype='overAll';
            if($scope.proId==null){
        		$scope.proId=$localStorage.userProfile_id;
				$scope.empProtype='myProfile';
        	}
			
            $http({
              method : "GET",
              url : $localStorage.service+"EmployeemgmntAPI/fetchEmployeeData",
              params :{id : $scope.proId,empProtype:$scope.empProtype},
              headers:{'access_token':$localStorage.access_token}
            }).then(function mySucces(response) {
                $scope.user_data = response.data.data[0];
                $scope.getMailingContactDetails(response.data.data[0].MAILING_ADDRESS);
                $scope.getPermanantContactDetails(response.data.data[0].PERMANANT_ADDRESS);
            },function myError(response){
                console.log(response);
            });


            $scope.getMailingContactDetails=function(mailling_id){
                $http({
                  method : "GET",
                  url : $localStorage.service+"EmployeemgmntAPI/mailingAddress",
                  params :{id : mailling_id},
                  headers:{'access_token':$localStorage.access_token}
                }).then(function mySucces(response) {
                    $scope.mailing = response.data.data[0];
                },function myError(response){
                    console.log(response);
                });
            }
            $scope.getPermanantContactDetails=function(perm_id){
                $http({
                  method : "GET",
                  url : $localStorage.service+"EmployeemgmntAPI/mailingAddress",
                  params :{id : perm_id},
                  headers:{'access_token':$localStorage.access_token}
                }).then(function mySucces(response) {
                    $scope.permanant = response.data.data[0];
                },function myError(response){
                    console.log(response);
                });
            }

            // Previous Institute Details
            $http({
              method : "GET",
              url : $localStorage.service+"EmployeemgmntAPI/previousInstitute",
              params :{id : $scope.proId,empProtype:$scope.empProtype},
              headers:{'access_token':$localStorage.access_token}
            }).then(function mySucces(response) {
                console.log(response.data.data,'previous_Inst');
                // $scope.previous_Inst = response.data.data;
                $scope.form_dynamic=response.data.data;
            },function myError(response){
                console.log(response);
            });


            $scope.form_dynamic = [];
            $scope.form_dynamic.push({'ID':'','DESIGNATION':'','INST_NAME':'','ADDRESS': '','CITY': '','STATE':'','ZIP_CODE': '','COUNTRY': '','PERIOD_FROM': '','PERIOD_TO':''});

            $scope.form_dynamic_model = [];

            // clone section
            $scope.cloneSection = function($event,$index,CurrForm) {
                if(CurrForm.DESIGNATION =='' || CurrForm.PERIOD_FROM=='' || CurrForm.PERIOD_TO==''){
                    UIkit.notify({
                        message : 'Please Fill current form',
                        status  : 'warning',
                        timeout : 2000,
                        pos     : 'top-center'
                    });
                }else {
                    console.log('Not Empty');
                    $event.preventDefault();
                    $scope.form_dynamic.push({'ID':'','DESIGNATION':'','INST_NAME':'','ADDRESS': '','CITY': '','STATE':'','ZIP_CODE': '','COUNTRY': '','PERIOD_FROM': '','PERIOD_TO':''});
                }
                // $event.preventDefault();
                // $scope.form_dynamic.push({'ID':'','DESIGNATION':'','INST_NAME':'','ADDRESS': '','CITY': '','STATE':'','ZIP_CODE': '','COUNTRY': '','PERIOD_FROM': '','PERIOD_TO':''});
            };

            // delete section
            $scope.deleteSection = function($event,$index,CurrForm) {
                console.log(CurrForm,'CurrForm');
                $event.preventDefault();
                $scope.form_dynamic_model.splice($index,1);
                $scope.form_dynamic.splice($index,1);
            };

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                altair_uikit.reinitialize_grid_margin();
            });
        }
    ])
;