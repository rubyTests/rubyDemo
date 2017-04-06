angular
    .module('rubycampusApp')
    .controller('LeaveEntitleAddCtrl',
        function($scope,$resource) {
            // console.log(get_Payitem,'get_Payitem');
            $scope.PayFrequency_options = ["Monthly", "Weekly", "Daily"];
            $scope.PayFrequency_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Frequency'
            };
            $scope.itemType_options = ["HR", "DA", "TA"];
            $scope.itemType_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Items'
            };

            $scope.form_template = [
                [
                    {
                        'type': 'text',
                        'name': 'firstName',
                        'label': 'First Name'
                    },
                    {
                        'type': 'text',
                        'name': 'lastName',
                        'label': 'Last Name'
                    }
                                ]
            ];

            $scope.form_dynamic = [];
            $scope.form_dynamic.push($scope.form_template);

            $scope.form_dynamic_model = [];

            $scope.employeeData=[];
            $scope.leaveCategory=[];

            $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/LeaveCategory.json')
            .query()
            .$promise
            .then(function(leavecategory_data) {
                $scope.leaveCategory.push(leavecategory_data);
            });

            $resource('app/components/employeemanagement/employee_list.json')
            .query()
            .$promise
            .then(function(employee_data) {
                $scope.employeeData.push(employee_data);
            });

            $scope.selectize_employee_option = $scope.employeeData;
            $scope.selectize_employee_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Employee',
                valueField: 'id',
                labelField: 'firstname',
                onInitialize: function(selectize){
                    selectize.on('change', function() {
                        console.log('on "change" event fired');
                    });
                }
            };

            $scope.selectize_dept_option = $scope.employeeData;
            $scope.selectize_dept_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department',
                valueField: 'id',
                labelField: 'Dept',
                onInitialize: function(selectize){
                    selectize.on('change', function() {
                        console.log('on "change" event fired');
                    });
                }
            };

            $scope.selectize_leaveCat_option = $scope.leaveCategory;
            $scope.selectize_leaveCat_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Leave Type',
                valueField: 'id',
                labelField: 'Name',
                onInitialize: function(selectize){
                    selectize.on('change', function() {
                        console.log('on "change" event fired');
                    });
                }
            };

            // clone section
            $scope.cloneSection = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic.push($scope.form_template);
            };

            // delete section
            $scope.deleteSection = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic_model.splice($index,1);
                $scope.form_dynamic.splice($index,1);
            };

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                altair_uikit.reinitialize_grid_margin();
            })

            $scope.backBtn = function(){
                window.history.back();
            }

        }
    );
