angular
    .module('altairApp')
    .controller('payslipgen_tableCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$stateParams',
        '$filter',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        '$compile',
        '$location',
        '$window',
        '$http',
        function ($scope,$rootScope,$timeout,$resource,$stateParams,$filter,DTOptionsBuilder, DTColumnDefBuilder,$compile,$location,$window,$http) {
            $resource('app/components/employeemanagement/employee_list.json')
                .query()
                .$promise
                .then(function(return_data) {
                    var paramsData=$filter('filter')(return_data, {id : $stateParams.pay_id});
                    $scope.tableArray=paramsData;
                });

                var path=$location.path().split( '/' );
                $scope.urlname=path[1];

                $scope.monthSelectorOptions = {
                    start: "year",
                    depth: "year"
                };
                $scope.getType = function(x) {
                    return typeof x;
                };
                $scope.isDate = function(x) {
                    return x instanceof Date;
                };
                $scope.tableData=[
                {
                    "id":1,
                    "period":"Jan 2017",
                    "salary":"5000.00",
                    "status":"Approved"
                },
                {
                    "id":2,
                    "period":"Feb 2017",
                    "salary":"10000.00",
                    "status":"Approved"
                },
                {
                    "id":3,
                    "period":"Mar 2017",
                    "salary":"10000.00",
                    "status":"Pending"
                },
                {
                    "id":4,
                    "period":"Apl 2017",
                    "salary":"10000.00",
                    "status":"Pending"
                }
                ];

                var vm = this;
            vm.dt_data = [];
            vm.dt_data=$scope.tableData;
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
                        }
                    ]
                })
                 .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });

                $scope.generatePDF = function(id) {
                  $http({
                    url : 'http://localhost/ruby/Rubyctrl/index',
                    method : 'POST',
                    data : { 'id':id},
                    responseType : 'arraybuffer',
                    headers: {
                     'Content-type' : 'application/pdf'
                    },
                    cache: true,
                   }).success(function(data) {
                    var blob = new Blob([data], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(blob);
                    var fileName = "1099.pdf";
                    var contentFile = blob;
                    $window.open(fileURL, "_blank");
                   }).error(function(data){
                    console.log('error');
                   });
                }
        }
    ]);