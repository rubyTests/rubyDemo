angular
    .module('altairApp')
    .controller('dt_default',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$window) {
            var vm = this;
            vm.selected = {};
            vm.selectAll = false;
            vm.toggleAll = toggleAll;
            vm.toggleOne = toggleOne;
            var titleHtml = '<input ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)" type="checkbox">';
            vm.dt_data = [];
            vm.dtOptions = DTOptionsBuilder
                .newOptions()
                .withDOM("<'dt-uikit-header'<'uk-grid'<'uk-width-medium-2-3'l><'uk-width-medium-1-3'f>>>" +
                    "<'uk-overflow-container'tr>" +
                    "<'dt-uikit-footer'<'uk-grid'<'uk-width-medium-3-10'i><'uk-width-medium-7-10'p>>>")
                .withOption('createdRow', function(row, data, dataIndex) {
                    // Recompiling so we can bind Angular directive to the DT
                    $compile(angular.element(row).contents())($scope);
                })
                .withOption('headerCallback', function(header) {
                    if (!vm.headerCompiled) {
                        // Use this headerCompiled field to only compile header once
                        vm.headerCompiled = true;
                        $compile(angular.element(header).contents())($scope);
                    }
                })
                .withPaginationType('full_numbers')
                // Active Buttons extension
                .withColumnFilter({
                    aoColumns: [
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'number',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'number',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'number',
                            bRegex: true,
                            bSmart: true
                        }
                    ]
                })
                .withButtons([
                    // {
                    //     extend:    'copyHtml5',
                    //     text:      '<i class="uk-icon-files-o"></i> Copy',
                    //     titleAttr: 'Copy'
                    // },
                    // {
                    //     extend:    'print',
                    //     text:      '<i class="uk-icon-print"></i> Print',
                    //     titleAttr: 'Print'
                    // },
                    // {
                    //     extend:    'excelHtml5',
                    //     text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
                    //     titleAttr: ''
                    // },
                    // {
                    //     extend:    'csvHtml5',
                    //     text:      '<i class="uk-icon-file-text-o"></i> CSV',
                    //     titleAttr: 'CSV'
                    // },
                    // {
                    //     extend:    'pdfHtml5',
                    //     text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
                    //     titleAttr: 'PDF'
                    // }
                ]);
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Position'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Office'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Extn.'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Start date'),
                DTColumnDefBuilder.newColumnDef(5).withTitle('Salary')
            ];
            console.log();
            function toggleAll (selectAll, selectedItems) {
                for (var id in selectedItems) {
                    if (selectedItems.hasOwnProperty(id)) {
                        selectedItems[id] = selectAll;
                    }
                }
            }
            function toggleOne (selectedItems) {
                for (var id in selectedItems) {
                    if (selectedItems.hasOwnProperty(id)) {
                        if(!selectedItems[id]) {
                            vm.selectAll = false;
                            return;
                        }
                    }
                }
                vm.selectAll = true;
            }
            $resource('data/dt_data.json')
            // $resource('data/temp/PayItemStructure.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                    console.log(vm.dt_data,"vm.dt_data");
                });
        // }

        ////Dynamic data functions

            // $scope.selectize_c_options = ["Item A", "Item B", "Item C"];

            // $scope.selectize_c_config = {
            //     plugins: {
            //         'tooltip': ''
            //     },
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Select...'
            // };

            $scope.itemType_options = ["HR", "DA", "TA"];
            $scope.PayStrcuture_options = ["Principal", "HOD", "Professor"];
            $scope.PayFrequency_options = ["Monthly", "Weekly", "Daily"];
            $scope.itemType_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Item'
            };
            $scope.PayStrcuture_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select PayStrcuture'
            };
            $scope.PayFrequency_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select PayFrequency'
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
            })

        }
    );
