angular
    .module('altairApp')
    .controller('assignEmployeeCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$filter',
        'DTOptionsBuilder', 
        'DTColumnDefBuilder',
        '$compile',
        function ($scope,$rootScope,$timeout,$resource,$filter,DTOptionsBuilder, DTColumnDefBuilder,$compile) {
            $scope.deptArray=[];
            $scope.tableArray=[];
            $resource('app/components/employeemanagement/employee_list.json')
                .query()
                .$promise
                .then(function(return_data) {
                    $scope.tableArray=return_data;
                });
            $scope.selectize_dept_data =['Computer Science And Engineering','Electronic Communication Engineering','Materials Science engineering','Electrical and Electronics Engineering'];
            $scope.selectize_dept_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department...',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        if(value){
                            var deptReturn_Data=$filter('filter')($scope.tableArray, {Dept : value});
                            $scope.tableView_data = deptReturn_Data;
                            $('#page_content_inner').trigger('click');
                        }
                    });
                }
            };

            var vm = this;
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
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
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
        }
    ]);