angular
    .module('rubycampusApp')
    .controller('storeItemViewCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, $http, $rootScope, $filter, $localStorage) {

            $scope.clearValidation=function(){
                $('#form_validation').parsley().reset();
            }
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
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('S.No'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Item Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Item Category'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Store Name'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Quantity'),
                DTColumnDefBuilder.newColumnDef(5).withTitle('Unit Price'),
            ];

            var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
            
            $scope.store_name = [];
            $http.get($localStorage.service+'inventoryApi/store',{headers:{'access_token':$localStorage.access_token}})
            .success(function(store_data){
                $scope.store_name.push(store_data.data);
            });
               
			$scope.selectize_store_options = $scope.store_name;
            $scope.selectize_store_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Store',
				valueField: 'ID',
                labelField: 'NAME',
				onInitialize: function(val){
                    console.log(val);
                }
            };
			
			$scope.itemCategory=[];
			$http.get($localStorage.service+'inventoryApi/itemCategory',{headers:{'access_token':$localStorage.access_token}})
            .success(function(itemCategory_data){
                $scope.itemCategory.push(itemCategory_data.data);
            });
				
			$scope.selectize_itemCategory_options = $scope.itemCategory;
			$scope.selectize_itemCategory_config = {
				create: false,
                maxItems: 1,
                placeholder: 'Item Category',
				valueField: 'ID',
                labelField: 'NAME',
				onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $scope.selectize_item_options = [];
                        $scope.getItems(value);
                    });
                }
			};

            $scope.getItems = function(id){
                $http({
                    method : 'GET',
                    url : $localStorage.service+'inventoryApi/item',
                    params : {'id' : id},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    $scope.selectize_item_options = return_data.data.data;
                });
            }

            $scope.selectize_item_options = [];
            $scope.selectize_item_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Item',
                valueField: 'NAME',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(val){

                    })
                }
            };
				
            $scope.openModel = function() {
                //$scope.buttonStatus='Save';
                $scope.titleCaption="Add";
                $scope.btnStatus="Save";
                $scope.Updatebutton=false;
                $scope.store_item_id='';
                $scope.selectize_item=null;
                $scope.selectize_itemCategory=null;
                $scope.selectize_store=null;
                $scope.store_itemquantity=null;
                $scope.store_itemprice=null;
                $('.uk-modal').find('input').trigger('blur');
            };
            $scope.edit_storeItem= function(res){
                $scope.titleCaption="Edit";
                $scope.btnStatus="Update";
                if(res){
                    $scope.store_item_id=res.ID;
                    $scope.selectize_item=res.NAME;
                    $scope.selectize_itemCategory=res.ITEM_CATEGORY_ID;
                    $scope.selectize_store=res.STORE_ID;
                    $scope.store_item_quantity=res.QUANTITY;
                    $scope.store_item_price=res.UNIT_PRICE;
                }
            }

            $scope.viewData=[];
            $scope.refreshTable=function(){
                $http.get($localStorage.service+'inventoryApi/storeItem',{headers:{'access_token':$localStorage.access_token}})
                .success(function(response){
                    $scope.viewData=response.data;
                    console.log($scope.viewData,'$scope.viewData');
                });
            }
            
            $scope.refreshTable();

            // Save Data
            $scope.saveStoreItemData=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'inventoryApi/storeItem',
                data: {
                    'store_item_id' : $scope.store_item_id,
                    'store_item_name' : $scope.selectize_item,
                    'store_item_quantity' : $scope.store_item_quantity,
                    'store_item_price' : $scope.store_item_price,
                    'store_id' : $scope.selectize_store,
                    'item_category_id' : $scope.selectize_itemCategory
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.message);
                    if(return_data.data.status==true){
                        UIkit.modal("#modal_overflow").hide();
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

                        // delete block
            $scope.deleteStoreItem=function(id, $index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"inventoryApi/storeItem",
                            params : {id : id},
                            headers:{'access_token':$localStorage.access_token}
                            }).then(function mySucces(return_data) {
                                if(return_data.data.status==true){
                                    UIkit.notify({
                                        message : return_data.data.message.message,
                                        status  : 'success',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                }
                                $scope.viewData.splice($index, 1);
                                $scope.refreshTable();
                            },function myError(return_data) {
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