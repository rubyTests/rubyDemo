angular
    .module('altairApp')
    .controller('PayGroupEmployeeCtrl',['$scope','$compile','$stateParams', '$timeout', '$resource', '$filter', 'DTOptionsBuilder', 'DTColumnDefBuilder',function( $scope, $compile, $stateParams, $timeout, $resource, $filter, DTOptionsBuilder, DTColumnDefBuilder) {
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
                DTColumnDefBuilder.newColumnDef(1).withTitle('Employee Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Department'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Employee Category'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Recent Payslip')
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
            $scope.EmployeeDetail=[];
            console.log($scope.CreateNewData,'$scope.CreateNewData');
            // alert($stateParams.id);
            $scope.EmployeeProfileFn=function(){                       
                $scope.gropEmployeeProfile=$filter('filter')($scope.EmployeeProfile,{ PayStructure_id : parseInt($stateParams.id)},true);
                console.log($scope.gropEmployeeProfile,'$scope.gropEmployeeProfile  1');
                angular.forEach($scope.gropEmployeeProfile,function(value,key){
                    // console.log(value,'value');
                     $scope.EmployeeDetail.push({emp_id : value.id,empFirstName : value.firstname,empLastName : value.lastname,empdet:value.Dept,empcat:value.category});
                     // console.log($scope.EmployeeDetail,'$scope.EmployeeDetail');
                    });
            }
            $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/profile.json')
                .query()
                .$promise
                .then(function(data) {
                    $scope.EmployeeProfile = data;
                    $scope.EmployeeProfileFn();
                }); 
        }]);