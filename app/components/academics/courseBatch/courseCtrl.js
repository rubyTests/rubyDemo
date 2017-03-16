angular
    .module('altairApp')
    .controller('courseCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter) {
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
                // .withButtons([
                //     {
                //         extend:    'copyHtml5',
                //         text:      '<i class="uk-icon-files-o"></i> Copy',
                //         titleAttr: 'Copy'
                //     },
                //     {
                //         extend:    'print',
                //         text:      '<i class="uk-icon-print"></i> Print',
                //         titleAttr: 'Print'
                //     },
                //     {
                //         extend:    'excelHtml5',
                //         text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
                //         titleAttr: ''
                //     },
                //     {
                //         extend:    'csvHtml5',
                //         text:      '<i class="uk-icon-file-text-o"></i> CSV',
                //         titleAttr: 'CSV'
                //     },
                //     {
                //         extend:    'pdfHtml5',
                //         text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
                //         titleAttr: 'PDF'
                //     }
                // ]);
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('Course'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Department'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Attendance Type'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Min Attendance %'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('GradingType'),
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
            //     .newOptions()
            //     // .withDisplayLength(10)
            //     // .withColumnFilter({
            //     //     aoColumns: [
            //     //         {
            //     //             type: 'text',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'text',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'text',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'number',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'number',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'number',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         }
            //     //     ]
            //     // })
            //     .withButtons([
            //         {
            //             extend:    'copyHtml5',
            //             text:      '<i class="uk-icon-files-o"></i> Copy',
            //             titleAttr: 'Copy'
            //         },
            //         {
            //             extend:    'print',
            //             text:      '<i class="uk-icon-print"></i> Print',
            //             titleAttr: 'Print'
            //         },
            //         {
            //             extend:    'excelHtml5',
            //             text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
            //             titleAttr: ''
            //         },
            //         {
            //             extend:    'csvHtml5',
            //             text:      '<i class="uk-icon-file-text-o"></i> CSV',
            //             titleAttr: 'CSV'
            //         },
            //         {
            //             extend:    'pdfHtml5',
            //             text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
            //             titleAttr: 'PDF'
            //         }
            //     ])
            //     .withOption('initComplete', function() {
            //         $timeout(function() {
            //             $compile($('.dt-uikit .md-input'))($scope);
            //         })
            //     });
            // vm.dtColumnDefs = [
            //     DTColumnDefBuilder.newColumnDef(0),
            //     DTColumnDefBuilder.newColumnDef(1),
            //     DTColumnDefBuilder.newColumnDef(2),
            //     DTColumnDefBuilder.newColumnDef(3),
            //     DTColumnDefBuilder.newColumnDef(4),
            //     DTColumnDefBuilder.newColumnDef(5)
            // ];
             $scope.get_name = [];
             $resource('app/components/academics/courseBatch/department.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.get_data = [];
                    $scope.get_data =  dt_data;
                     angular.forEach($scope.get_data, function(value, key){
                        $scope.name=  value.dept_name;
                        $scope.get_name.push($scope.name);
                    });
                });
                $scope.grading = [];
                $resource('app/components/academics/courseBatch/course.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                    angular.forEach(vm.dt_data, function(value, key){
                        $scope.gradingType=  value.grading_type;
                        console.log($scope.gradingType);
                        $scope.grading.push($scope.gradingType);
                    });
                    angular.forEach(vm.dt_data, function(value, key){
                        value.departmentName=$scope.departmentName(value.id);
                    });
                });
                $scope.departmentName = function(id){
                    var getName=$filter('filter')($scope.get_data,{id : id },true);
                    if (getName[0]) return getName[0].dept_name;
                }

                $scope.selectize_deptId_options = $scope.get_name;
                $scope.selectize_deptId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Department Name'
                };
                $scope.selectize_attdnceType_options = ["Subject-Wise", "Daily"];
                $scope.selectize_attdnceType_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Attendance Type'
                };
                $scope.selectize_gradingType_options = $scope.grading;
                $scope.selectize_gradingType_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Grading Type'
                };



        }
    );