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

            $http({
              method : "GET",
              url : $localStorage.service+"EmployeemgmntAPI/fetchEmployeeData",
              params :{id : $stateParams.emp_id},
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
              params :{id : $stateParams.emp_id},
              headers:{'access_token':$localStorage.access_token}
            }).then(function mySucces(response) {
                console.log(response.data.data,'previous_Inst');
                $scope.previous_Inst = response.data.data;
            },function myError(response){
                console.log(response);
            });
        }
    ])
;