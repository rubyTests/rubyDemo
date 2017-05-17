angular
    .module('rubycampusApp')
    .controller('storeViewCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage) {
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
                DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Code'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Store Category')
            ];

            var modal = UIkit.modal("#modal_header_footer",{bgclose: false, keyboard:false});
            
            $scope.addStore=function(){
                $scope.clearValidation();
                $scope.titleCaption="Add";
                $scope.btnStatus="Save";
                $scope.store_id='';
                $scope.store_name='';
                $scope.store_code='';
                $scope.selectize_storeCategory='';
                $('.uk-modal').find('input').trigger('blur');
            }
            $scope.editStore=function(result){
                $scope.clearValidation();
                // console.log(result,'result');
                $scope.titleCaption="Edit";
                $scope.btnStatus="Update";
                if(result){
                    $scope.store_id=result.ID;
                    $scope.store_name=result.NAME;
                    $scope.store_code=result.CODE;
                    $scope.selectize_storeCategory=result.STORE_CATEGORY_ID;
                }
            }
            $scope.viewData=[];
            $scope.refreshTable=function(){
                $http.get($localStorage.service+'inventoryApi/store',{headers:{'access_token':$localStorage.access_token}})
                .success(function(response){
                    $scope.viewData=response.data;
                    console.log($scope.viewData,'$scope.viewData');
                });
            }
            
            $scope.refreshTable();
            // Get building data
            $scope.storeCategoryList=[];
            $http.get($localStorage.service+'inventoryApi/storeCategory',{headers:{'access_token':$localStorage.access_token}})
            .success(function(storeCategory_data){
                $scope.storeCategoryList.push(storeCategory_data.data);
            });
            $scope.selectize_storeCategory_options =$scope.storeCategoryList;
            $scope.selectize_storeCategory_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Category',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };

            // Save Data
            $scope.saveStoreData=function(){
                // console.log($scope.block_name,'block_name',$scope.block_no,'block_no',$scope.selectize_buildingId,'buildingId');
                $http({
                method:'POST',
                url: $localStorage.service+'inventoryApi/store',
                data: {
                    'store_id' : $scope.store_id,
                    'store_name' : $scope.store_name,
                    'store_code' : $scope.store_code,
                    'store_category_id' : $scope.selectize_storeCategory
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
                    // var data=$filter('filter')($scope.buildingList,{ID:$scope.selectize_buildingId},true);
                    // if($scope.block_id){
                    //     var data1=$filter('filter')($scope.viewData,{ID:$scope.block_id},true);
                    //     data1[0].NAME=$scope.block_name;
                    //     data1[0].NUMBER=$scope.block_no;
                    //     data1[0].BUILDING_ID=$scope.selectize_buildingId;
                    //     data1[0].BUILDING_NAME=data[0].NAME;
                    // }else{
                    //     $scope.viewData.push({ID:return_data.data.BLOCK_ID,NAME:$scope.block_name,NUMBER:$scope.block_no,BUILDING_NAME:data[0].NAME,BUILDING_ID:$scope.selectize_buildingId});
                    // }
                });
            }

            // delete block
            $scope.deleteStore=function(id, $index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"inventoryApi/store",
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