angular
    .module('rubycampusApp')
    .controller('empAdmCtrl', [
        '$scope',
        'utils',
        function ($scope,utils) {

            var $wizard_advanced_form = $('#wizard_advanced_form');

            $scope.finishedWizard = function() {
                var form_serialized = JSON.stringify( utils.serializeObject($wizard_advanced_form), null, 2 );
                UIkit.modal.alert('<p>Wizard data:</p><pre>' + form_serialized + '</pre>');
            };

            $scope.selectize_marital_options = ["Single", "Married"];
            $scope.selectize_marital_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Marital Status...'
            };
            $scope.selectize_d_options = ["Computer Science & Engineering", "Electrical and Electronics Engineering", "Electronic Communication Engineering","Information Technology"];
            $scope.selectize_d_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department...'
            };
            $scope.selectize_pos_options = ["CSE", "EEE", "ECE ","MECH"];
            $scope.selectize_pos_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Position...'
            };
            $scope.selectize_nation_options = ["India", "Sri Langa", "America"];
            $scope.selectize_nation_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select natioanality...'
            };
            $scope.selectize_country_options = ["India", "Sri Langa", "America"];
            $scope.selectize_country_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Country...'
            };
            $scope.selectize_blood_options = ["O+ve", "A+ve","A+ve","B-ve","B+ve","O-ve"];
            $scope.selectize_blood_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Blood Group...'
            };
            $scope.selectize_cat_options = ["Teaching", "Non-Teaching"];
            $scope.selectize_cat_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Category...'
            };
            $scope.selectize_city_options = ["Cuddalore", "Villupuram","Puducherry","Chennai"];
            $scope.selectize_city_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select City...'
            };
            $scope.selectize_state_options = ["Tamilnadu", "Andhra Pradesh","Assam","Bihar"];
            $scope.selectize_state_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select State...'
            };

            // Clone functionality

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
                ],
                [
                    {
                        'type': 'text',
                        'name': 'company',
                        'label': 'Company'
                    }
                ],
                [
                    {
                        'type': 'radio',
                        'label': 'Gender',
                        'name': 'gender',
                        'inputs': [
                            {
                                'label': 'Man',
                                'value': 'man'
                            },
                            {
                                'label': 'Woman',
                                'value': 'woman'
                            }
                        ]
                    },
                    {
                        'type': 'switch',
                        'label': 'Contact',
                        'inputs': [
                            {
                                'label': 'Email',
                                'name': 'switch_email'
                            },
                            {
                                'label': 'Phone',
                                'name': 'switch_phone'
                            }
                        ]
                    }
                ],
                [
                    {
                        'type': 'selectize',
                        'name': 'city',
                        'position': 'bottom',
                        'config': {
                            'valueField': 'value',
                            'labelField': 'title',
                            'placeholder': 'City...'
                        },
                        'data': [
                            {
                                "value": "city_a",
                                "title": "City A"
                            },
                            {
                                "value": "city_b",
                                "title": "City B"
                            },
                            {
                                "value": "city_c",
                                "title": "City C"
                            },
                            {
                                "value": "city_d",
                                "title": "City D"
                            },
                            {
                                "value": "city_e",
                                "title": "City E"
                            }
                        ]
                    },
                    {
                        'type': 'selectize',
                        'name': 'country',
                        'config': {
                            'valueField': 'value',
                            'labelField': 'title',
                            'create': false,
                            'maxItems': 1,
                            'placeholder': 'Country...'
                        },
                        'data': [
                            {
                                "value": "country_a",
                                "title": "Country A"
                            },
                            {
                                "value": "country_b",
                                "title": "Country B"
                            },
                            {
                                "value": "country_c",
                                "title": "Country C"
                            },
                            {
                                "value": "country_d",
                                "title": "Country D"
                            },
                            {
                                "value": "country_e",
                                "title": "Country E"
                            }
                        ]
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
            });
        }
    ]);