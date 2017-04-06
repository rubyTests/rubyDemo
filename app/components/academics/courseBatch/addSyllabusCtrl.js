angular
    .module('rubycampusApp')
    .controller('addSyllabusCtrl',
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
                // .withButtons([
                //     {
                //         extend:    'copyHtml5',
                //         text:      '<i class="uk-icon-files-o"></i> Copy',
                //         titleAttr: 'Copy'
                //     },
                //     {
                //         extend:    'print',
                //         text:      '<i class="uk-icon-print"></i> Print',
                //         titleAttr: 'Print'
                //     },
                //     {
                //         extend:    'excelHtml5',
                //         text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
                //         titleAttr: ''
                //     },
                //     {
                //         extend:    'csvHtml5',
                //         text:      '<i class="uk-icon-file-text-o"></i> CSV',
                //         titleAttr: 'CSV'
                //     },
                //     {
                //         extend:    'pdfHtml5',
                //         text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
                //         titleAttr: 'PDF'
                //     }
                // ]);
            vm.dtColumnDefs = [
                // DTColumnDefBuilder.newColumnDef(0).withTitle('Name'),
                // DTColumnDefBuilder.newColumnDef(1).withTitle('Description'),
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
            //     .newOptions()
            //     // .withDisplayLength(10)
            //     // .withColumnFilter({
            //     //     aoColumns: [
            //     //         {
            //     //             type: 'text',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'text',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'text',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'number',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'number',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'number',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         }
            //     //     ]
            //     // })
            //     .withButtons([
            //         {
            //             extend:    'copyHtml5',
            //             text:      '<i class="uk-icon-files-o"></i> Copy',
            //             titleAttr: 'Copy'
            //         },
            //         {
            //             extend:    'print',
            //             text:      '<i class="uk-icon-print"></i> Print',
            //             titleAttr: 'Print'
            //         },
            //         {
            //             extend:    'excelHtml5',
            //             text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
            //             titleAttr: ''
            //         },
            //         {
            //             extend:    'csvHtml5',
            //             text:      '<i class="uk-icon-file-text-o"></i> CSV',
            //             titleAttr: 'CSV'
            //         },
            //         {
            //             extend:    'pdfHtml5',
            //             text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
            //             titleAttr: 'PDF'
            //         }
            //     ])
            //     .withOption('initComplete', function() {
            //         $timeout(function() {
            //             $compile($('.dt-uikit .md-input'))($scope);
            //         })
            //     });
            // vm.dtColumnDefs = [
            //     DTColumnDefBuilder.newColumnDef(0),
            //     DTColumnDefBuilder.newColumnDef(1),
            //     DTColumnDefBuilder.newColumnDef(2),
            //     DTColumnDefBuilder.newColumnDef(3),
            //     DTColumnDefBuilder.newColumnDef(4),
            //     DTColumnDefBuilder.newColumnDef(5)
            // ];
            $resource('data/department.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                });

               
                $scope.form_dynamic = [];
                $scope.form_dynamic.push($scope.form_template);

                $scope.form_dynamic_model = [];
                // clone section
                $scope.cloneSection = function($event,$index) {
                    $event.preventDefault();
                    $scope.form_dynamic.push($scope.form_template);
                };

                // delete section
                $scope.deleteSection = function($event,$index) {
                    $event.preventDefault();
                    $scope.form_dynamic_model.splice($index,1);
                    $scope.form_dynamic.splice($index,1);
                };

                // $scope.ckeditor_content =
                // '<img alt="" src="assets/img/gallery/Image01.jpg" style="float:left; height:173px; margin-right:16px; margin-bottom: 16px; width:260px" />'+
                // '<h1>Header</h1>'+
                // 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consequuntur deleniti ducimus, eos fugit, mollitia neque praesentium quia quisquam quos sapiente voluptatem voluptatibus voluptatum. Assumenda consectetur deleniti doloremque fuga harum illum molestiae nisi possimus quidem vero. A accusantium alias aliquam animi cum doloremque eos est facilis illo, illum inventore ipsam itaque laboriosam maiores modi mollitia necessitatibus nemo non omnis perferendis quam quia, repellendus rerum vel veritatis voluptas voluptate? Aliquid asperiores at atque autem beatae consequatur culpa delectus eaque earum error et fugiat incidunt laborum libero molestias natus nobis odit optio, perspiciatis possimus quas saepe sapiente sed sint sit temporibus vel voluptatem. Adipisci alias assumenda dolorum eligendi enim, facilis ipsum iusto perferendis quod ratione repellat reprehenderit suscipit voluptatem. Cumque debitis eum facere facilis fugiat quo repellat sed veniam voluptas voluptate? Adipisci aliquid asperiores culpa laboriosam sint unde velit veritatis vero, voluptatibus? Accusantium aperiam aspernatur assumenda at consectetur consequuntur cupiditate dicta ducimus earum ex exercitationem explicabo fugit id illo inventore iste magnam minima molestiae mollitia nam nihil nobis officiis omnis perspiciatis porro praesentium provident quibusdam quidem quo ratione reiciendis sed sunt tempora tempore ullam, ut veritatis! Ab, aliquid asperiores cum et impedit, labore obcaecati perferendis quae, quas recusandae sint suscipit vitae voluptatem.';

                // $scope.ckeditor_options = {
                //     customConfig: '../../assets/js/custom/ckeditor_config.js'
                // }
       



        }
    );