angular
    .module('rubycampusApp')
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
        '$http',
        '$localStorage',
        function ($scope,$rootScope,$window,$timeout,$stateParams,$resource,$filter,$compile,DTOptionsBuilder, DTColumnDefBuilder,$http,$localStorage) {
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

            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('S.No'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Description')
            ];

            var modal = UIkit.modal("#modal_header_footer",{bgclose: false, keyboard:false});
            
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
                $scope.titlecaption="Add";
                $scope.btnStatus="Save";

                $scope.rep_cat_name = null;
                $scope.rep_cat_desc = null;
                $('.uk-modal').find('input').trigger('blur');
            }

            // Save Data
            $scope.saveRepositoryCategory=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'RepositoryAPI/Rep_Category',
                data: {
                    'rep_cat_id' : $scope.rep_cat_id,
                    'rep_cat_name' : $scope.rep_cat_name,
                    'rep_cat_desc' : $scope.rep_cat_desc
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    if(return_data.data.status==true){
                        UIkit.modal("#modal_header_footer").hide();
                        UIkit.notify({
                            message : return_data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                    }
                    $scope.refreshTable();
                });
            }

            $scope.viewData=[];
            $scope.refreshTable=function(){
                $http.get($localStorage.service+'RepositoryAPI/Rep_Category',{headers:{'access_token':$localStorage.access_token}})
                .success(function(response){
                    $scope.viewData=response.message;
                });
            }
            $scope.refreshTable();

            $scope.editRepositoryCategory=function(data){
                $scope.titlecaption="Edit";
                $scope.btnStatus="Update";
                if (data) {
                    $scope.rep_cat_id=data.ID;
                    $scope.rep_cat_name=data.NAME;
                    $scope.rep_cat_desc=data.DESC;
                }
            }


            $scope.deleteBookCategoryData=function(id, $index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+'RepositoryAPI/Rep_Category',
                            params : {id : id},
                            headers:{'access_token':$localStorage.access_token}
                            }).then(function mySucces(response) {
                                if(response.data.status==true){
                                    UIkit.notify({
                                        message : response.data.message,
                                        status  : 'success',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                }
                                $scope.viewData.splice($index, 1);
                                $scope.refreshTable();
                            },function myError(response) {
                              // console.log(response,'response');
                            })
                        }
                    },function(){
                        // console.log("false");
                    }, {
                        labels: {
                            'Ok': 'Ok'
                        }
                    });
                }
            }
        }
    ]);