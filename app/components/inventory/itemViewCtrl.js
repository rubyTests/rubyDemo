angular
    .module('rubycampusApp')
    .controller('itemViewCtrl', [
        '$scope',
        '$rootScope',
        'products_data',
        '$http',
        '$timeout',
        '$localStorage',
        function ($scope, $rootScope, products_data, $http, $timeout,$localStorage) {

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

            $('.dropify').dropify();

            $('.dropify-fr').dropify({
                messages: {
                    default: 'Glissez-déposez un fichier ici ou cliquez',
                    replace: 'Glissez-déposez un fichier ou cliquez pour remplacer',
                    remove:  'Supprimer',
                    error:   'Désolé, le fichier trop volumineux'
                }
            });

            var modal = UIkit.modal("#open_leavecategory",{bgclose: false, keyboard:false});

            $scope.addItem=function(){
                $scope.tit_caption="Add";
                $scope.status="Save";
                
                $scope.item_id='';
                $scope.item_name='';
                $scope.item_code='';
                $scope.item_unit='';
                $scope.item_part_no='';
                $scope.item_image='';
                $scope.selectize_itemCategory='';
                $('.uk-modal').find('input').trigger('blur');
            }
            $scope.editItem=function(data){
                $scope.tit_caption="Edit";
                $scope.status="update";
                if (data) {
                    $scope.item_id=data.ID;
                    $scope.item_name=data.NAME;
                    $scope.item_code=data.CODE;
                    $scope.item_unit=data.UNIT;
                    $scope.item_part_no=data.PART_NO;
                    $scope.item_image=data.IMAGE;
                    $scope.selectize_itemCategory=data.ITEM_CATEGORY_ID;
                }
            }

            $scope.viewData=[];
            $scope.refreshTable=function(){
                $http.get($localStorage.service+'inventoryApi/item',{headers:{'access_token':$localStorage.access_token}})
                .success(function(response){
                    $scope.viewData=response.data;

                    console.log($scope.viewData, '$scope.viewData');
                });
            }
            
            $scope.refreshTable();

            // Save Data
            $scope.saveItemData=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'inventoryApi/item',
                data: {
                    'item_id' : $scope.item_id,
                    'item_name' : $scope.item_name,
                    'item_code' : $scope.item_code,
                    'item_unit' : $scope.item_unit,
                    'item_part_no' : $scope.item_part_no,
                    'item_image' : $scope.item_image,
                    'item_category_id' : $scope.selectize_itemCategory
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

            // products data
            $scope.products_data = products_data;

            $scope.pageSize = 5;

            $scope.itemCategoryList=[];
            $http.get($localStorage.service+'inventoryApi/itemCategory',{headers:{'access_token':$localStorage.access_token}})
            .success(function(itemCategory_data){
                $scope.itemCategoryList.push(itemCategory_data.data);
                console.log($scope.itemCategoryList,'$scope.itemCategoryList');
            });

            $scope.filter_itemcategory_options = $scope.itemCategoryList;

            $scope.filter_itemcategory_config = {
                create: false,
                placeholder: 'Item Category',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };
            $scope.filter_itemcategory_config_one = {
                create: false,
                maxItems:1,
                placeholder: 'Item Category',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };

            $scope.filterData = {
                category: ["Category 1","Category 2","Category 3"]
            };

            $scope.filter_pageSize = ['5', '10', '15'];

            // delete block
            $scope.deleteItem=function(id, $index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"inventoryApi/item",
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
    ]);
    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    };