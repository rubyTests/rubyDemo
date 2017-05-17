angular
    .module('rubycampusApp')
    .controller('itemCategoryViewCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage) {
            var $formValidate = $('#form_validation');
            $formValidate
                .parsley()
                .on('form:validated',function() {
                    $scope.$apply();
                })
                .on('field:validated',function(parsleyField) {
                    if($(parsleyField.$element).hasClass('md-input')) {
                        $scope.$apply();
                    }
                });

                $scope.clearValidation=function(){
                    $('#form_validation').parsley().reset();
                }

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
                
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('S.No'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Code')
            ];

            var modal = UIkit.modal("#modal_header_footer",{bgclose: false, keyboard:false});

            $scope.addItemCategory=function(){
                $scope.clearValidation();
                $scope.titleCaption="Add";
                $scope.btnStatus="Save";
                $scope.item_cat_id='';
                $scope.item_cat_name='';
                $scope.item_cat_code='';
                $('.uk-modal').find('input').trigger('blur');
            }
            $scope.editItemCategory=function(res){
                $scope.clearValidation();
                $scope.titleCaption="Edit";
                $scope.btnStatus="Update";
                if(res){
                    $scope.item_cat_id=res.ID;
                    $scope.item_cat_name=res.NAME;
                    $scope.item_cat_code=res.CODE;
                }
            }
            
            // Save Data
            $scope.saveItemCategoryData=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'inventoryApi/itemCategory',
                data: {
                    'item_cat_id' : $scope.item_cat_id,
                    'item_cat_name' : $scope.item_cat_name,
                    'item_cat_code' : $scope.item_cat_code
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.message);
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
                $http.get($localStorage.service+'inventoryApi/itemCategory',{headers:{'access_token':$localStorage.access_token}})
                .success(function(response){
                    $scope.viewData=response.data;
                });
            }
            $scope.refreshTable();

            $scope.deleteItemCategoryData=function(id, $index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+'inventoryApi/itemCategory',
                            params : {id : id},
                            headers:{'access_token':$localStorage.access_token}
                            }).then(function mySucces(response) {
                                if(response.data.status==true){
                                    UIkit.notify({
                                        message : response.data.message.message,
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
    );