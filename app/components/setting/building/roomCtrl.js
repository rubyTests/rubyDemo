angular
    .module('rubycampusApp')
    .controller('roomCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage) {
            var $formValidate = $('#form_validation');
            $formValidate
                .parsley()
                .on('form:validated',function() {
                    // $scope.$apply();
                })
                .on('field:validated',function(parsleyField) {
                    if($(parsleyField.$element).hasClass('md-input')) {
                        // $scope.$apply();
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


            var modal = UIkit.modal("#modal_header_footer",{bgclose: false, keyboard:false});
            
            $scope.viewData=[];
            $scope.refreshTable=function(){
                $http.get($localStorage.service+'InstitutionAPI/room',{headers:{'access_token':$localStorage.access_token}})
                .success(function(response){
                    $scope.viewData=response.data;
                });
            }
            $scope.refreshTable();
            // Get building data
            $scope.buildingList=[];
            $scope.blockList=[];

            $http.get($localStorage.service+'InstitutionAPI/building',{headers:{'access_token':$localStorage.access_token}})
            .success(function(building_data){
                $scope.buildingList.push(building_data.data);
            });
           

            $scope.selectize_buildingId_options =$scope.buildingList;
            $scope.selectize_buildingId_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Building*',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                         $scope.getBlocks(value);
                        //$('#form_validation').parsley().validate();
                    });
                }
            };
            // $scope.getBlocks = function(){
            //     $http.get($localStorage.service+'InstitutionAPI/block',{ params : {id : id},headers:{'access_token':$localStorage.access_token}})
            //     .success(function(block_data){
            //             $scope.blockList.push(block_data.data);
            //     });
            // }
             $scope.getBlocks=function(id){
                // alert(id);
                    $http({
                    method:'get',
                    url: $localStorage.service+'InstitutionAPI/block',
                    params: {
                        'id' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(block_data){
                        //console.log(block_data.data.data,'return_datareturn_data');
                        $scope.selectize_block_options=block_data.data.data;
                        //console.log($scope.selectize_block_options);
                    });
                }

            $scope.selectize_block_options =[];
            $scope.selectize_blockId_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Block*',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                        //$('#form_validation').parsley().validate();
                    });
                }
            };
            $scope.addRoom=function(){
                $scope.clearValidation();
                $scope.btnStatus="Save";
                $scope.titleCaption="Add";
                $scope.room_id='';
                $scope.room_name='';
                // $scope.room_no='';
                $scope.floor='';
                $scope.selectize_buildingId='';
                $scope.selectize_blockId='';
                $timeout(function(){
                    $scope.shouldBeOpen = true;    
                },500);
                // modal.show();
                $('.uk-modal').find('input').trigger('blur');
            }
            $scope.editRoom=function(result){
                $scope.clearValidation();
                $scope.btnStatus="Update";
                $scope.titleCaption="Edit";
                if(result){
                    $scope.room_id=result.ID;
                    $scope.room_name=result.NAME;
                    // $scope.room_no=result.NUMBER;
                    $scope.floor=result.FLOOR;
                    $scope.selectize_buildingId=result.BUILDING_ID;
                    $scope.selectize_blockId=result.BLOCK_ID;
                }
            }

            // Save Data
            $scope.saveRoomData=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'InstitutionAPI/room',
                data: {
                    'room_id' : $scope.room_id,
                    'room_name' : $scope.room_name,
                    // 'room_no' : $scope.room_no,
                    'floor' : $scope.floor,
                    'building_id' : $scope.selectize_buildingId,
                    'block_id' : $scope.selectize_blockId
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_data');
                    if(return_data.data.status==true){
                        UIkit.modal("#modal_header_footer").hide();
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                    }else{
                        UIkit.modal.alert(return_data.data.message); 
                    }
                    $scope.refreshTable();
                    $scope.clearValidation();
                    // console.log(return_data.data.message);
                    // var build=$filter('filter')($scope.buildingList,{ID:$scope.selectize_buildingId},true);
                    // var block=$filter('filter')($scope.blockList,{ID:$scope.selectize_blockId},true);
                    // if($scope.room_id){
                    //     var data1=$filter('filter')($scope.viewData,{ID:$scope.room_id},true);
                    //     data1[0].NAME=$scope.room_name;
                    //     data1[0].NUMBER=$scope.room_no;
                    //     data1[0].FLOOR=$scope.floor;
                    //     data1[0].BUILDING_ID=$scope.selectize_buildingId;
                    //     data1[0].BUILDING_NAME=build[0].NAME;
                    //     data1[0].BLOCK_ID=$scope.selectize_blockId;
                    //     data1[0].BLOCK_NAME=block[0].NAME;
                    // }else{
                    //     $scope.viewData.push({ID:return_data.data.ROOM_ID,NAME:$scope.room_name,NUMBER:$scope.room_no,FLOOR:$scope.floor,BUILDING_NAME:build[0].NAME,BUILDING_ID:$scope.selectize_buildingId,BLOCK_NAME:block[0].NAME,BLOCK_ID:$scope.selectize_blockId});
                    // }
                });
            }

            $scope.deleteRoom=function(id,$index){
                $http({
                    method : "get",
                    url : $localStorage.service+"InstitutionAPI/checkRoom",
                    params : {id : id},
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function mySucces(response) {
                        if(response.data.status==true){
                            if(id){
                                UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                                    if(id){
                                        $http({
                                        method : "DELETE",
                                        url : $localStorage.service+"InstitutionAPI/room",
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
                                                $scope.viewData.splice($index, 1);
                                                $scope.refreshTable();
                                            }
                                            
                                        },function myError(response) {
                                        })
                                    }
                                },function(){
                                     console.log("false");
                                    $scope.refreshTable();
                                }, {
                                    labels: {
                                        'Ok': 'Ok'
                                    }
                                });
                            }
                        }else{
                            UIkit.modal.alert(response.data.message);
                        }
                    },function myError(response) {
                    })
               
            }
            // delete block
            //  $scope.deleteRoom=function(id, $index){
            //     if(id){
            //         $http({
            //             method : "DELETE",
            //             url : $localStorage.service+"InstitutionAPI/room",
            //             params : {id : id},
            //             headers:{'access_token':$localStorage.access_token}
            //         }).then(function mySucces(response) {
            //             UIkit.modal.confirm('Are you sure to delete ?', function(e) {
            //             if(id){
            //                 if(response.data.status==true){
            //                     UIkit.notify({
            //                         message : response.data.message,
            //                         status  : 'success',
            //                         timeout : 2000,
            //                         pos     : 'top-center'
            //                     });
            //                 }
            //                 $scope.viewData.splice($index, 1);
            //                 $scope.refreshTable();
            //                 }
            //             },function(){
            //                 // console.log("false");
            //             }, {
            //                 labels: {
            //                     'Ok': 'Ok'
            //                 }
            //             })
            //         },function myError(response) {
            //             UIkit.modal.alert(response.data.message);

            //         })
            //     }
            // }
        }
    );