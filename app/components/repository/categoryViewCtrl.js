angular
    .module('altairApp')
    .controller('categoryViewCtrl', [
        '$scope',
        '$rootScope',
        '$window',
        '$timeout',
        '$stateParams',
        '$resource',
        '$filter',
        '$compile',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        function ($scope,$rootScope,$window,$timeout,$stateParams,$resource,$filter,$compile,DTOptionsBuilder, DTColumnDefBuilder) {
            var vm = this;
            vm.category_data = [];
            vm.selected = {};
            vm.selectAll = false;
            vm.toggleAll = toggleAll;
            vm.toggleOne = toggleOne;
            var titleHtml = '<input ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)" type="checkbox">';
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
                DTColumnDefBuilder.newColumnDef(1).withTitle('Category Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Category Description')
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

            $resource('data/repository/category.json')
            .query()
            .$promise
            .then(function(category_data) {
                vm.category_data = category_data;
            });

            $scope.openModal = function(){
                $scope.addLabel = true;
                $scope.updateLabel = false;
                $scope.addButton = true;
                $scope.updateButton = false;

                $scope.Category_Name = null;
                $scope.Category_Desc = null;
                $('.uk-modal').find('input').trigger('blur');
            }

            $scope.addCategory = function(){
                var data = {
                    id : vm.category_data.length+1,
                    Category_Name : $scope.Category_Name,
                    Category_Desc : $scope.Category_Desc
                }
                vm.category_data.push(data);
            }

            $scope.updateModal = function(data){
                if (typeof data=="undefined") return false;
                $scope.addLabel = false;
                $scope.updateLabel = true;
                $scope.addButton = false;
                $scope.updateButton = true;

                $scope.Category_Name = data.Category_Name;
                $scope.Category_Desc = data.Category_Desc;
                $scope.id = vm.category_data.indexOf(data);
            }

            $scope.updateCategory = function(){
                vm.category_data[$scope.id].Category_Name = $scope.Category_Name;
                vm.category_data[$scope.id].Category_Desc = $scope.Category_Desc;
            }

            $scope.remove_Category = function(index){
                if (typeof index=="undefined") return false;
                vm.category_data.splice(index,1);
            }

        }
    ]);