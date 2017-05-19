angular
    .module('rubycampusApp')
    .controller('financeCtrl', [
        '$scope',
        '$window',
        '$timeout',
        '$localStorage',
        '$http',
        function ($scope,$window,$timeout,$localStorage,$http) {

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



            // $http({
            //     url: $localStorage.service+'FinanceAPI/fetchStudent',
            //     method : 'GET',
            //     headers: { 'access_token':$localStorage.access_token},
            // }).success(function(response) {
            //     console.log(response.message,'student');
            //     $scope.studentList.push(response.message);
            // }).error(function(data){
            //     console.log('error');
            // });

            // $scope.selectize_student_config = $scope.studentList;
            // $scope.selectize_student_options = {
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Student',
            //     valueField: 'PROF_ID',
            //     labelField: 'STUDENT_NAME',
            //     searchField: 'STUDENT_NAME',
            //     onInitialize: function(selectize){
            //         selectize.on('change', function(value) {
            //             console.log(value);
            //         });
            //     }
            // };


            $scope.selectize_feeItem_options = ["Tution Fee", "Book Fee", "Mess Fee", "Transport Fee", "Uniform Fee"];
            $scope.selectize_feeItem_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Fee Item'
            };

            $scope.selectize_freq_options = ["Annualy", "Monthly", "Weekly"];
            $scope.selectize_freq_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Frequency'
            };

            $scope.selectize_fine_options = ["Tution Fee Fine", "Book Fee Fine", "Hostel Fine"];
            $scope.selectize_fine_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Fine'
            };


            // Advanced selects

            var course_data = $scope.selectize_course_options = [
                {id: 1, title: 'Computer Science and Engineering'},
                {id: 2, title: 'Mechanical Engineering'},
                {id: 3, title: 'Electrical Communication Engineering'},
                {id: 4, title: 'Electrical and Electronics Engineering'},
                {id: 5, title: 'Aeronautical Engineering'},
                {id: 6, title: 'Information Technology Engineering'},
                {id: 7, title: 'Civil Engineering'},
                {id: 8, title: 'Marine Engineering'}
            ];

            $scope.selectize_course_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                maxItems: null,
                valueField: 'id',
                labelField: 'title',
                searchField: 'title',
                create: false,
                placeholder: 'Course Name',
                render: {
                    option: function(course_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(course_data.title) + '</span><br>' +
                            '</div>';
                    }
                    // item: function(planets_data, escape) {
                    //     return '<div class="item"><a href="' + escape(planets_data.url) + '" target="_blank">' + escape(planets_data.title) + '</a></div>';
                    // }
                }
            };

            // Advanced selects

            var planets_data = $scope.selectize_planets_options = [
                {id: 1, title: 'Rafeeq', url: '444'},
                {id: 2, title: 'Saravanan', url: '222'},
                {id: 3, title: 'Gopi', url: '222'},
                {id: 4, title: 'Senthil', url: '222'},
                {id: 5, title: 'Mani', url: '222'},
                {id: 6, title: 'Vijay', url: '222'},
                {id: 7, title: 'Karthil', url: '222'},
                {id: 8, title: 'Selva', url: '222'}
            ];

            $scope.selectize_planets_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                maxItems: 1,
                valueField: 'id',
                labelField: 'title',
                searchField: ['title','url'],
                // searchField: 'url',
                create: false,
                placeholder: 'Student Name / Admission No',
                render: {
                    option: function(planets_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(planets_data.title) + '</span><br>' +
                            '<span class="title Addition uk-text-muted uk-text-small">' + escape(planets_data.url) + '</span>' +
                            '</div>';
                    }
                    // item: function(planets_data, escape) {
                    //     return '<div class="item"><a href="' + escape(planets_data.url) + '" target="_blank">' + escape(planets_data.title) + '</a></div>';
                    // }
                }
            };

            $scope.initradioVal = function(){
                return $scope.radio_BatchStu == 'Batch';
            }

        }
    ]);