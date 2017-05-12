angular
    .module('rubycampusApp')
    .controller('assignEmployeeCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$filter',
        'DTOptionsBuilder', 
        'DTColumnDefBuilder',
        '$compile',
        '$http',
        '$localStorage',
        function ($scope,$rootScope,$timeout,$resource,$filter,DTOptionsBuilder, DTColumnDefBuilder,$compile,$http,$localStorage) {
            $scope.deptArray=[];
            $scope.tableArray=[];

            $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
            .success(function(dept_data){
                $scope.deptArray.push(dept_data.message);
            });
            
            $scope.selectize_dept_options =$scope.deptArray;
            $scope.selectize_dept_config = {
                // create: false,
                // maxItems: 1,
                // placeholder: 'Department',
                // onInitialize: function(selectize){
                //     selectize.on('change', function(value) {
                //         if(value){
                //             var deptReturn_Data=$filter('filter')($scope.tableArray, {Dept : value});
                //             $scope.tableView_data = deptReturn_Data;
                //             $('#page_content_inner').trigger('click');
                //         }
                //     });
                // }
                create: false,
                maxItems: 1,
                placeholder: 'Department',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                        if(value){
                            $scope.getEmployeeList(value);
                        }
                    });
                }
            };
            $scope.checkNumber=function(id){
                return angular.isNumber(id);
            }
            $scope.getEmployeeList=function(deptVal){
                $http({
                    method:'GET',
                    url: $localStorage.service+'PayrollPayslipAPI/fetchEmployeeList',
                    params:{id:deptVal},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.message,'employee');
                    $scope.tableView_data = return_data.data.message;
                });
            }

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
                 console.log($localStorage.structureName,'$localStorage');
                 $scope.strucName=$localStorage.structureName;
        }
    ]);