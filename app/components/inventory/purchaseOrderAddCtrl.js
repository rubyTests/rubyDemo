angular
    .module('rubycampusApp')
    .controller('purchaseOrderAddCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
            var vm = this;
            vm.dt_data = [];

            $resource('data/finance/fine.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                });

                $scope.selectize_indent_options = ["1", "2", "3"];
                $scope.selectize_indent_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Indents'
                };

                $scope.selectize_store_options = ["Store 1", "Store 2"];
                $scope.selectize_store_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Store'
                };
                 $scope.selectize_supplierType_options = ["Vendor", "Manufacturer"];
                $scope.selectize_supplierType_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Supplier Type'
                };
                 $scope.selectize_supplier_options = ["Supplier 1", "Supplier 2", "Supplier 3"];
                $scope.selectize_supplier_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Supplier'
                };

                $scope.selectize_storeItem_options = ["Pencil", "Pen", "Duster"];
                $scope.selectize_storeItem_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Store Item'
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
            $scope.mode = [
                            {
                                'label': 'Man',
                                'value': 'man'
                            },
                            {
                                'label': 'Woman',
                                'value': 'woman'
                            }
                    ];
                    console.log($scope.mode);
            $scope.form_dynamic = [];
            $scope.form_dynamic.push($scope.form_template);

            $scope.form_dynamic_model = [];

            // clone section
            $scope.cloneSection = function($event,$index) {
                $event.preventDefault();
                var ss = $scope.form_dynamic.push($scope.form_template);
                console.log($scope.form_template);
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

            $scope.backBtn = function(){
                window.history.back();
            }

            $scope.newRowObj = {
                    feesItem1 : '',
                    feesItem2 : '',
                    feesItem3 : '',
                };
            $scope.newRow=[];
            $scope.newRow.push($scope.newRowObj);
            $scope.addRow = function(){
                $scope.newRow.push($scope.newRowObj);
            }

            $scope.removeRow = function(index){
                $scope.newRow.splice(index,1);
            }
        }
    );