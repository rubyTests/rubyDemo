angular
    .module('altairApp')
    .controller('studentviewCtrl',
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
                .withButtons([
                    {
                        extend:    'copyHtml5',
                        text:      '<i class="uk-icon-files-o"></i> Copy',
                        titleAttr: 'Copy'
                    },
                    {
                        extend:    'print',
                        text:      '<i class="uk-icon-print"></i> Print',
                        titleAttr: 'Print'
                    },
                    {
                        extend:    'excelHtml5',
                        text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
                        titleAttr: ''
                    },
                    {
                        extend:    'csvHtml5',
                        text:      '<i class="uk-icon-file-text-o"></i> CSV',
                        titleAttr: 'CSV'
                    },
                    {
                        extend:    'pdfHtml5',
                        text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
                        titleAttr: 'PDF'
                    }
                ]);
            vm.dtColumnDefs = [
                // DTColumnDefBuilder.newColumnDef(0).withTitle('S.No'),
                // DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
                // DTColumnDefBuilder.newColumnDef(2).withTitle('Department'),
                // DTColumnDefBuilder.newColumnDef(3).withTitle('Course.'),
                // DTColumnDefBuilder.newColumnDef(4).withTitle('Batch')
                // DTColumnDefBuilder.newColumnDef(5).withTitle('Salary')
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
            $resource('app/components/student/profile.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                });
        }
    )
    .controller('dt_scroll_vertical',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
            var vm = this;
            vm.dt_data = [];
            vm.dtOptions = DTOptionsBuilder
                .fromSource('data/dt_data.json')
                .withDisplayLength(10)
                .withOption('scrollY','200px')
                .withOption('scrollCollapse',false)
                .withOption('paging',false)
                .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Position'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Office'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Extn.'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Start date'),
                DTColumnDefBuilder.newColumnDef(5).withTitle('Salary')
            ];

        }
    )
    .controller('dt_individual_search',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
            var vm = this;
            vm.dtOptions = DTOptionsBuilder
                .fromSource('data/dt_data.json')
                .withPaginationType('full_numbers')
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
                DTColumnDefBuilder.newColumnDef(0).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Position'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Office'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Extn.'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Start date'),
                DTColumnDefBuilder.newColumnDef(5).withTitle('Salary')
            ];
        }
    )
    .controller('dt_col_vis',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
            var vm = this;
            vm.dtOptions = DTOptionsBuilder
                .fromSource('data/dt_data.json')
                .withDOM("<'dt-uikit-header'<'uk-grid'<'uk-width-medium-2-3'l><'uk-width-medium-1-3'f>>>" +
                "<'uk-overflow-container'tr>" +
                "<'dt-uikit-footer'<'uk-grid'<'uk-width-medium-3-10'i><'uk-width-medium-7-10'p>>>")
                .withPaginationType('full_numbers')
                // Active Buttons extension
                .withButtons([
                    'colvis'
                ]);
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Position'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Office'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Extn.'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Start date'),
                DTColumnDefBuilder.newColumnDef(5).withTitle('Salary')
            ];
        }
    )
    .controller('dt_table_tools',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
            var vm = this;
            vm.dtOptions = DTOptionsBuilder
                .fromSource('data/dt_data.json')
                .withDOM("<'dt-uikit-header'<'uk-grid'<'uk-width-medium-2-3'l><'uk-width-medium-1-3'f>>>" +
                    "<'uk-overflow-container'tr>" +
                    "<'dt-uikit-footer'<'uk-grid'<'uk-width-medium-3-10'i><'uk-width-medium-7-10'p>>>")
                .withPaginationType('full_numbers')
                // Active Buttons extension
                .withButtons([
                    {
                        extend:    'copyHtml5',
                        text:      '<i class="uk-icon-files-o"></i> Copy',
                        titleAttr: 'Copy'
                    },
                    {
                        extend:    'print',
                        text:      '<i class="uk-icon-print"></i> Print',
                        titleAttr: 'Print'
                    },
                    {
                        extend:    'excelHtml5',
                        text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
                        titleAttr: ''
                    },
                    {
                        extend:    'csvHtml5',
                        text:      '<i class="uk-icon-file-text-o"></i> CSV',
                        titleAttr: 'CSV'
                    },
                    {
                        extend:    'pdfHtml5',
                        text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
                        titleAttr: 'PDF'
                    }
                ]);
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Position'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Office'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Extn.'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Start date'),
                DTColumnDefBuilder.newColumnDef(5).withTitle('Salary')
            ];
        }
    );