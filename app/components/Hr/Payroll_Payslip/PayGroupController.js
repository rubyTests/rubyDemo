angular
    .module('rubycampusApp')
    .controller('dt_default',
        function($compile, $scope, $timeout, $resource, $filter, DTOptionsBuilder, DTColumnDefBuilder,$http,$localStorage) {
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
                DTColumnDefBuilder.newColumnDef(0).withTitle('S.No'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Pay Stucture Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Assigned Employee'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Pay Items'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Frequence')
            ];
            
            $scope.ViewData=[];
            $http({
                method:'GET',
                url: $localStorage.service+'PayrollPayslipAPI/payStructureDetail',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.ViewData=return_data.data.message;
            });
        }
    );