angular
    .module('altairApp')
    .controller('payslipGenerationCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter,$location) {
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
                 .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });

            $resource('app/components/employeemanagement/employee_list.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;

                    // $scope.PayStructure.forEach(function(value,key){
                    //     $scope.CreateNewData.push({ ps_name : value.Name ,ps_item_count : $scope.GetPayItemCount(value.id) , ps_freq : value.Frequency ,pis_id : value.id ,Assemp_count : $scope.GetEmpCount(value.id) });
                    // });

                    
                });

                $scope.payStrucArray=[];
                $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/PayStructure.json')
                .query()
                .$promise
                .then(function(return_paydata) {
                    angular.forEach(vm.dt_data, function(value,key){
                        value.payitem_name=getGroupName(value.payitem_id);
                        value.payitem_freq=getFrequency(value.payitem_id);
                    });
                    function getGroupName(id){
                        var data=$filter('filter')(return_paydata,{ id : id},true);
                        if(data[0]) return data[0].Name;
                    }
                    function getFrequency(id){
                        var data=$filter('filter')(return_paydata,{ id : id},true);
                        if(data[0]) return data[0].Frequency;
                    }
                });
                
        }
    );