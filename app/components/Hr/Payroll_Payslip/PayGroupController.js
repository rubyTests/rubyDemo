angular
    .module('altairApp')
    .controller('dt_default',
        function($compile, $scope, $timeout, $resource, $filter, DTOptionsBuilder, DTColumnDefBuilder) {
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
                DTColumnDefBuilder.newColumnDef(1).withTitle('Group Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Assigned Employee'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Pay Items'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Frequence')
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
            $scope.CreateNewData=[];
            console.log($scope.CreateNewData,'$scope.CreateNewData');
            $scope.PayItemStructureFn=function(){
                $scope.PayStructure.forEach(function(value,key){
                    // console.log(value,'value of Pay_Structure');
                    $scope.CreateNewData.push({ ps_name : value.Name ,ps_item_count : $scope.GetPayItemCount(value.id) , ps_freq : value.Frequency ,pis_id : value.id ,Assemp_count : $scope.GetEmpCount(value.id) });
                    });
                // console.log($scope.CreateNewData,'$scope.CreateNewData');
            }
            $scope.GetPayItemCount=function(str_id){
                var getPaySN=$filter('filter')($scope.PayItemStructure,{ PayStructure_id : str_id}, true);
                // console.log(getPaySN,'getPaySN');
                return getPaySN.length;

            }
            // $scope.GetPayItemStrID=function(psi_id){
            //     var getPaystrid=$filter('filter')($scope.PayItemStructure,{PayStructure_id : psi_id}, true);
            //     console.log(getPaystrid,'getPaystrid');
            //     console.log(getPaystrid[0].id,'getPaystrid');
            //     return getPaystrid[0].id;
            // }
            $scope.GetEmpCount=function(id){
                // console.log($scope.EmployeeProfile,'$scope.EmployeeProfile');
                // console.log(typeof(id),'assssa');
                var getEmployeeCount=$filter('filter')($scope.EmployeeProfile,{PayStructure_id : id}, true);
                console.log(getEmployeeCount,'getEmployeeCount');
                return getEmployeeCount.length;
            }
            $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/PayItem.json')
                .query()
                .$promise
                .then(function(data) {
                    $scope.PayItem = data;
                });
            $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/PayStructure.json')
                .query()
                .$promise
                .then(function(data) {
                    $scope.PayStructure = data;
                });
            $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/profile.json')
                .query()
                .$promise
                .then(function(data) {
                    $scope.EmployeeProfile = data;
                    // console.log($scope.EmployeeProfile,'$scope.EmployeeProfile');
                });
            $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/PayItemStructure.json')
                .query()
                .$promise
                .then(function(data) {
                    $scope.PayItemStructure = data;
                    $scope.PayItemStructureFn();
                }); 
        }
    );