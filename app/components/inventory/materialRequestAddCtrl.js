angular
    .module('rubycampusApp')
    .controller('materialRequestAddCtrl', [
        '$scope',
        '$window',
        '$timeout',
        '$filter',
        function ($scope,$window,$timeout,$filter) {
            $scope.feesItem=[];
            $scope.totalAmount = 0;
            $scope.newData = [
                        // {FeeStructure_Name:'',FeeItemCount:[{Fee_Item_Name:''},{Fee_Item_Name:''}]}
                        // {FeeStructure_Name:'Fee Structure 2',FeeItemCount:[{Fee_Item_Name:'Tution Fee'},{Fee_Item_Name:'Tution Fee1'}]},
                        // {FeeStructure_Name:'Fee Structure 3',FeeItemCount:[{Fee_Item_Name:'Tution Fee'},{Fee_Item_Name:'Tution Fee1'}]}
                        ];
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

            $scope.selectize_store_options = ["Store 1", "Store 2", "Store 3","Store 4"];
            $scope.selectize_store_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Store'
            };

            $scope.selectize_issuedTo_options = ["Student", "Employee"];
            $scope.selectize_issuedTo_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Issued To'
            };

            $scope.selectize_course_options = ["Course 1", "Course 2", "Course 3"];
            $scope.selectize_course_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Course'
            };

            $scope.selectize_batch_options = ["Batch 1", "Batch 2", "Batch 3"];
            $scope.selectize_batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Batch'
            };

            $scope.selectize_department_options = ["Department 1", "Department 2", "Department 3"];
            $scope.selectize_department_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Department'
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
                searchField: 'title',
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

            $scope.checkbox_demo_1 = true;

            $scope.forms_advanced = {
                "input_error": "Something wrong",
                "input_ok": "All ok",
                "ionslider_1": 23,
                "ionslider_2": {
                    "from": 160,
                    "to": 592
                },
                "ionslider_3": 40,
                "ionslider_4": {
                    "from": 20,
                    "to": 80
                },
                selectize_planets: ["2", "3"]
            };


            
            var d=new Date();
            var year=d.getFullYear();
            var month=d.getMonth()+1;
            var day=d.getDate();
            if (month<10){
            month="0" + month;
            };
            if (day<10){
            dayNew="0" + day;
            };
            
            $scope.date=dayNew + "." + month + "." + year;
            $scope.forms_advanced.datepicker = $scope.date;
           

            var $maskedInput = $('.masked_input');
            if($maskedInput.length) {
                $maskedInput.inputmask();
            }

            $scope.changePaid = function () {
                var Paidtotal = 0;
                var Fixedtotal = 0;
                angular.forEach($scope.feesItem, function(value,keys){
                    angular.forEach(value, function(value1,keys1){
                        Paidtotal+=parseInt(value1.fees);
                        Fixedtotal+=parseInt(value1.fixedFee);
                    });
                });
                $scope.totalPaid=Paidtotal;
                $scope.totalAmount = Fixedtotal;
            };

            $scope.newRowObj = {
                    feesItem1 : '',
                    feesItem2 : '',
                    feesItem3 : '',
                    feesItem4 : '',
                    feesItem5 : ''
                };
            $scope.newRow=[];
            $scope.newRow.push($scope.newRowObj);
            $scope.addRow = function(){
                $scope.newRow.push($scope.newRowObj);
            }

            $scope.removeRow = function(index){
                $scope.newRow.splice(index,1);
            }

            $scope.backBtn = function(){
                window.history.back();
            }

        }
    ]);