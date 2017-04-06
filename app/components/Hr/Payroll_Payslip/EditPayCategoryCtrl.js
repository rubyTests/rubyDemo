angular
    .module('rubycampusApp')
    .controller('EditPayCategoryCtrl',
        function($scope) {
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

            $scope.backbtn = function(){
                window.history.back();
            }

        }
    );
