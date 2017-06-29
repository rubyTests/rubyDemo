angular
    .module('rubycampusApp')
    .controller('buildingblockCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage) {
            $scope.clearValidation=function(){
                $('#form_validation').parsley().reset();
            }
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
            $scope.clearValidation1=function(){
                $('#form_validation1').parsley().reset();
                $scope.clear_buildData();
                $scope.selectize_buildingId=''
            }
            var $formValidate = $('#form_validation1');
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

                
            // vm.dtColumnDefs = [
            //     DTColumnDefBuilder.newColumnDef(0).withTitle('Id'),
            //     DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
            //     DTColumnDefBuilder.newColumnDef(2).withTitle('Number'),
            //     DTColumnDefBuilder.newColumnDef(3).withTitle('Building')
            // ];

            var modal = UIkit.modal("#block_modal",{bgclose: false, keyboard:false});
            $scope.clear_buildData=function(){
                $scope.titleCaption="Add";
                $scope.btnStatus="Save";
                $scope.building_id='';
                $scope.building_name='';
                $scope.build_no='';
                $scope.landmark='';
                 $('.inputName').trigger('blur'); 
                $timeout(function(){
                    $scope.shouldBeOpen = true;
                },500);
                //modal.show();
            }
            $scope.addBlock=function(){
                $scope.clearValidation();
                $scope.clearValidation1();
                $scope.clear_buildData();
                $scope.titleCaption="Add";
                $scope.btnStatus="Save";
                $scope.block_id='';
                $scope.block_name='';
                $scope.block_no='';
                $scope.selectize_buildingId='';
                $('.inputName').trigger('blur');
                $timeout(function(){
                    $scope.shouldBeOpen = true;
                },500);
                
            }
            $scope.editBlock=function(result){
                $scope.clearValidation();
                $scope.titleCaption="Edit";
                $scope.btnStatus="Update";
                if(result){
                    $scope.block_id=result.ID;
                    $scope.block_name=result.NAME;
                    $scope.block_no=result.NUMBER;
                    $scope.selectize_buildingId=result.BUILDING_ID;
                }
            }
            $scope.viewData=[];
            $scope.refreshTable=function(){
                $http.get($localStorage.service+'InstitutionAPI/block',{headers:{'access_token':$localStorage.access_token}})
                .success(function(response){
                    $scope.viewData=response.data;
                });
            }
            $scope.refreshTable();
            // Get building data
            $scope.buildingList=[];
            $http.get($localStorage.service+'InstitutionAPI/building',{headers:{'access_token':$localStorage.access_token}})
            .success(function(building_data){
                if(building_data.status==false){
                    $scope.buildingList.push([{ID:0, NAME:"Add Building"}]);
                }else{
                    $scope.buildingList.push(building_data.data);
                    $scope.buildingList.push([{ID:0, NAME:"Add Building"}]);
                }
            });
            $scope.selectize_buildingId_options =$scope.buildingList;
            $scope.selectize_buildingId_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Building*',
                valueField: 'ID',
                sortField: [{field: 'ID', direction: 'desc'}],
                labelField: 'NAME',
                render: {
                        option: function (item, escape) {
                            if(item.ID==0){
                                return '<div class="option">' +
                                            '<div class="text">' +
                                                '<i class="uk-icon-plus linkClr"></i>' + '<span class="linkClrtxt">' + escape(item.NAME) + '</span>' +
                                           '</div>' +
                                        '</div>';
                            }else{
                                 return '<div class="option">' +
                                            '<div class="text">' +
                                                '<span class="name">' + escape(item.NAME) + '</span>' +
                                           '</div>' +
                                        '</div>';
                            }
                           
                        }
                    },
                onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            if (value==0) {
                                $timeout(function(){
                                    $scope.shouldBeOpen = true;    
                                },500);
                                UIkit.modal("#building_modal",{bgclose: false, keyboard:false}).show(); 
                            };
                        });
                    }
            };

            // Save Data
            $scope.saveBlockData=function(){
                // console.log($scope.block_name,'block_name',$scope.block_no,'block_no',$scope.selectize_buildingId,'buildingId');
                $http({
                method:'POST',
                url: $localStorage.service+'InstitutionAPI/block',
                data: {
                    'block_id' : $scope.block_id,
                    'block_name' : $scope.block_name,
                    'block_no' : $scope.block_no,
                    'building_id' : $scope.selectize_buildingId
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.message);
                    if(return_data.data.status==true){
                        UIkit.modal("#block_modal").hide();
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
            $scope.deleteBlock=function(id,$index){
                $http({
                    method : "get",
                    url : $localStorage.service+"InstitutionAPI/checkBlockDetails",
                    params : {id : id},
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function mySucces(response) {
                        //console.log(response,'responseresponse');
                        if(response.data.status==true){
                            if(id){
                                UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                                    if(id){
                                        $http({
                                        method : "DELETE",
                                        url : $localStorage.service+"InstitutionAPI/block",
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
                                        })
                                    }
                                },function(){
                                     console.log("false");
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
            //Building js
            // Save Data
            $scope.saveBuildingData=function(){
                $http({
                method:'POST',
                // url: 'http://localhost/smartedu/test/InstitutionAPI/building',
                url: $localStorage.service+'InstitutionAPI/building',
                data: {
                    'build_id' : $scope.building_id,
                    'build_name' : $scope.building_name,
                    'bulid_no' : $scope.build_no,
                    'landmark' : $scope.landmark
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.message);
                    if(return_data.data.status==true){
                        UIkit.modal("#building_modal").hide();
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $scope.buildingList.push({ID:return_data.data.message.BUILDING_ID,NAME:return_data.data.message.BUILDING_NAME});
                        $timeout(function(){
                            UIkit.modal("#block_modal",{bgclose: false, keyboard:false}).show();
                            $('#form_validation').parsley().validate();    
                        },100);
                        $scope.selectize_buildingId=return_data.data.message.BUILDING_ID;
                        $scope.clear_buildData(); 

                    }else{
                        UIkit.modal.alert(return_data.data.message);
                    }
                });
            }
           
        }
    );