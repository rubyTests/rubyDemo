angular
    .module('altairApp')
    .controller('fineCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
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
                .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });

            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('Id'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Desc'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('No.Of Fine Slabs')
            ];
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

            $resource('data/finance/fine.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                });

                $scope.selectize_buildingId_options = ["1", "2", "3"];
                $scope.selectize_buildingId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Building Id...'
                };

                $scope.selectize_attdncType_options = ["Subject-Wise", "Daily"];
                $scope.selectize_attdncType_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Attendance Type...'
                };
                 $scope.selectize_deptId_options = ["1", "2", "3"];
                $scope.selectize_deptId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Department Id...'
                };
                 $scope.selectize_calenId_options = ["1", "2", "3"];
                $scope.selectize_calenId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Calendar Id...'
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
    );