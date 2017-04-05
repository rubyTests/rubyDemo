angular
    .module('altairApp')
    .controller('positionCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
            var vm = this;
            vm.dt_data = [];
            $scope.category_data=[];
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
            $resource('app/components/Hr/configuration/position.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                });

                var modal = UIkit.modal("#open_category",{bgclose: false, keyboard:false});
                
                $scope.addPosition=function(){
                    $scope.tit_caption="Add";
                    $scope.status="Save";
                    $scope.position_name='';
                    $scope.selectize_category='';
                    $('.uk-modal').find('input').trigger('blur');
                }
                $scope.editPosition=function(data){
                    $scope.tit_caption="Edit";
                    $scope.status="update";
                    if (data) {
                        $scope.position_id=data.id;
                        $scope.position_name=data.name;
                        $scope.selectize_category=data.cat_name;
                    }
                }

                $resource('app/components/Hr/configuration/category.json')
                .query()
                .$promise
                .then(function(ret_data) {
                    $scope.category_data.push(ret_data);
                });
                $scope.selectize_category_options = $scope.category_data;
                $scope.selectize_category_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Category...',
                    valueField: 'id',
                    labelField: 'name',
                    onInitialize: function(selectize){
                        
                    }
                };
        }
    );