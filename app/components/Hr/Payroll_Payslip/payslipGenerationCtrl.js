angular
    .module('rubycampusApp')
    .controller('payslipGenerationCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter,$location,$http,$localStorage,$state) {
            var path=$location.path().split( '/' );
            $scope.urlname=path[1];
            var vm = this;
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
                    }
                ]
            })
             .withOption('initComplete', function() {
                $timeout(function() {
                    $compile($('.dt-uikit .md-input'))($scope);
                })
            });
            $scope.tableData=[];
            $http({
                method:'GET',
                url: $localStorage.service+'PayrollPayslipAPI/getEmployeeforpayslip',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                console.log(return_data.data.message,'return_data');
                $scope.tableData=return_data.data.message;
            });

            $scope.generatePDF = function(id) {
                if(id){
                    $http({
                        // url : 'http://localhost/ruby/Rubyctrl/index',
                        // url: 'http://localhost/rubyServices/PayrollPayslipAPI/index',
                        url: $localStorage.service+'PayrollPayslipAPI/index',
                        method : 'POST',
                        data : { 'id':id},
                        responseType : 'arraybuffer',
                        headers: {
                         'Content-type' : 'application/pdf'
                        },
                        // headers:{'access_token':$localStorage.access_token}
                        cache: true,
                    }).success(function(data) {
                        console.log('data',data);
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
        }
    );