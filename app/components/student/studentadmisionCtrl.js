angular
    .module('altairApp')
    .controller('studentadmisionCtrl', [
        '$scope',
        'utils',
        function ($scope,utils) {

            var $wizard_advanced_form = $('#wizard_advanced_form');

            $scope.finishedWizard = function() {
                var form_serialized = JSON.stringify( utils.serializeObject($wizard_advanced_form), null, 2 );
                UIkit.modal.alert('<p>Wizard data:</p><pre>' + form_serialized + '</pre>');
            };
            $scope.selectize_a_data = {
                options: [
                    {
                        id: 1,
                        title: "Batch A",
                        value: "a1",
                        parent_id: 1
                    },
                    {
                        id: 2,
                        title: "Batch B",
                        value: "b1",
                        parent_id: 1
                    },
                    {
                        id: 3,
                        title: "Batch C",
                        value: "c1",
                        parent_id: 1
                    }
                ]
            };

            $scope.selectize_a_config = {
                // plugins: {
                //     'disable_options': {
                //         disableOptions: ["c1","c2"]
                //     }
                // },
                create: false,
                maxItems: 1,
                placeholder: 'Select Batch...',
                optgroupField: 'parent_id',
                optgroupLabelField: 'title',
                optgroupValueField: 'ogid',
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                onInitialize: function(selectize){
                    selectize.on('change', function() {
                        console.log('on "change" event fired');
                    });
                    selectize.on('focus', function() {
                        console.log('on "focus" event fired');
                    });
                    selectize.on('dropdown_open', function() {
                        console.log('on "dropdown_open" event fired');
                    });
                }
            };

            $scope.selectize_c_options = ["Course A", "Course B", "Course C"];
            $scope.selectize_c_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Course...'
            };

            $scope.selectize_b_options = ["Hinduism", "Buddhism", "Jainism ","Sikhism"];
            $scope.selectize_b_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Religion...'
            };
            $scope.selectize_d_options = ["CSE", "EEE", "ECE ","MECH"];
            $scope.selectize_d_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department...'
            };
            $scope.selectize_n_options = ["India", "Sri Langa", "America"];
            $scope.selectize_n_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select natioanality...'
            };
            $scope.selectize_m_options = ["Tamil", "English"];
            $scope.selectize_m_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select mother tongue...'
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
            $scope.selectize_cat_options = ["Category 1", "Category 2","Category 3"];
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

             // autocomplete
            $('.autocomplete_template').on('click','#autocomplete_template_results .item', function(e) {
                e.preventDefault();
                var $this = $(this);
                $state.go($this.attr('href'));
                $('.autocomplete_template > input').val('');
            });


             $scope.countryNames = [
                "Albania",
                "Andorra",
                "Armenia",
                "Austria",
                "Azerbaijan",
                "Belarus",
                "Belgium",
                "Bosnia & Herzegovina",
                "Bulgaria",
                "Croatia",
                "Cyprus",
                "Czech Republic",
                "Denmark",
                "Estonia",
                "Finland",
                "France",
                "Georgia",
                "Germany",
                "Greece",
                "Hungary",
                "Iceland",
                "Ireland",
                "Italy",
                "Kosovo",
                "Latvia",
                "Liechtenstein",
                "Lithuania",
                "Luxembourg",
                "Macedonia",
                "Malta",
                "Moldova",
                "Monaco",
                "Montenegro",
                "Netherlands",
                "Norway",
                "Poland",
                "Portugal",
                "Romania",
                "Russia",
                "San Marino",
                "Serbia",
                "Slovakia",
                "Slovenia",
                "Spain",
                "Sweden",
                "Switzerland",
                "Turkey",
                "Ukraine",
                "United Kingdom",
                "Vatican City"
            ];

        }
    ]);