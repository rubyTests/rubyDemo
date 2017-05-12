angular
    .module('rubycampusApp')
    .controller('payslipReportCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$filter',
        'DTOptionsBuilder', 
        'DTColumnDefBuilder',
        '$compile',
        '$location',
        '$http',
        '$localStorage',
        function ($scope,$rootScope,$timeout,$resource,$filter,DTOptionsBuilder, DTColumnDefBuilder,$compile,$location,$http,$localStorage) {
            var path=$location.path().split( '/' );
            $scope.urlname=path[1];
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
                        null,
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
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        }
                    ]
                })
                .withButtons([
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
                        extend:    'pdfHtml5',
                        text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
                        titleAttr: 'PDF'
                    }
                ])
                 .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });


            $scope.deptData=[];
            $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
            .success(function(dept_data){
                $scope.deptData.push(dept_data.message);
            });

            $scope.department_options =$scope.deptData;
            $scope.department_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Department',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };

            $scope.tablePreview=false;
            $scope.viewEmployeePayslip=function(){
                $http({
                    method:'GET',
                    url: $localStorage.service+'PayrollPayslipAPI/payslipReport',
                    params:{
                        'dept_id':$scope.department,
                        'fromdate':$scope.from_date,
                        'uptodate':$scope.upto_date
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).success(function(return_data) {
                    console.log(return_data,'return_data');
                    $scope.tableView_data = return_data.message;
                    $scope.tablePreview=true;
                }).error(function(return_data){
                    console.log('error');
                    $scope.tableView_data = [];
                    $scope.tablePreview=true;
                });
            }
            $scope.passGenDate=function(gendate){
                if(gendate){
                    $localStorage.GenDate=gendate;
                }
            }
        }
    ]);