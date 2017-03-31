angular
    .module('altairApp')
    .controller('payItemCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
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
                        }
                    ]
                })
                 .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });

                $scope.addItem=function(){
                    $scope.tit_caption="Add";
                    $scope.status="Save";
                    $scope.item_name='';
                    $scope.selectize_item='';
                    $('.uk-modal').find('input').trigger('blur');
                }
                $scope.editPayItem=function(data){
                    $scope.tit_caption="Edit";
                    $scope.status="update";
                    if (data) {
                        $scope.item_id=data.id;
                        $scope.item_name=data.name;
                        $scope.selectize_item=data.type;
                    }
                }
                $resource('app/components/Hr/configuration/payitem.json')
                .query()
                .$promise
                .then(function(ret_data) {
                    vm.dt_data=ret_data;
                });
                $scope.selectize_item_options = ['Earnings','Deductions'];
                $scope.selectize_item_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Type',
                };
        }
    );