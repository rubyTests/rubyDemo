angular
    .module('rubycampusApp')
    .controller('vehicleDetailAddCtrl', [
        '$scope',
		'$resource',
        function ($scope,$resource) {
			$('.dropify').dropify();
			
			$scope.emp_data=[];
			$resource('app/components/employeemanagement/employee_list.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.emp_data.push(dt_data);
                });
                $scope.selectize_emp_options = $scope.emp_data;
                $scope.selectize_emp_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Responsible Person',
					valueField: 'id',
                    labelField: 'firstname',
					onInitialize: function(val){
                        console.log(val);
                    }
                };
				
			$scope.backBtn=function(){
				window.history.back();
			}
				
        }
    ]);