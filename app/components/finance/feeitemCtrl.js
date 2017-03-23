angular
    .module('altairApp')
    .controller('feeitemCtrl',
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
                .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });

            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('Id'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Description')
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
            
            $scope.openModal = function(){
                $scope.addLabel = true;
                $scope.updateLabel = false;
                $scope.addButton = true;
                $scope.updateButton = false;

                $scope.Fee_Item_Name = null;
                $scope.Fee_Item_Desc = null;
            }

            $scope.addFeeItem = function(){

                var data = {
                    id : vm.dt_data.length+1,
                    Fee_Item_Name : $scope.Fee_Item_Name,
                    Fee_Item_Desc : $scope.Fee_Item_Desc
                };
                vm.dt_data.push(data);
            }

            $scope.updateModal = function(data){
                if (typeof data=="undefined") return false;
                $scope.addLabel = false;
                $scope.updateLabel = true;
                $scope.addButton = false;
                $scope.updateButton = true;

                $scope.Fee_Item_Name = data.Fee_Item_Name;
                $scope.Fee_Item_Desc = data.Fee_Item_Desc;
                $scope.id = vm.dt_data.indexOf(data);
            }

            $scope.updateFeeItem = function() {
                vm.dt_data[$scope.id].Fee_Item_Name = $scope.Fee_Item_Name;
                vm.dt_data[$scope.id].Fee_Item_Desc = $scope.Fee_Item_Desc;
            }

            $resource('data/finance/feeitem.json')
            .query()
            .$promise
            .then(function(dt_data) {
                vm.dt_data = dt_data;
            });

            $scope.remove_item = function(data) {
                // var index = vm.dt_data.indexOf(data);
                if (typeof data=="undefined") return false;
                console.log(data);
                vm.dt_data.splice(data,1);
            }
        }
    );