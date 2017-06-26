angular
    .module('rubycampusApp')
    .controller('buildingCtrl',
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
            // vm.dtColumnDefs = [
            //     DTColumnDefBuilder.newColumnDef(0).withTitle('Id'),
            //     DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
            //     DTColumnDefBuilder.newColumnDef(2).withTitle('Number'),
            //     DTColumnDefBuilder.newColumnDef(3).withTitle('Landmark')
            // ];

            var modal = UIkit.modal("#modal_header_footer",{bgclose: false, keyboard:false});

            $scope.addBuilding=function(){
                $scope.clearValidation();
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
                modal.show();
                // $('.uk-modal').find('input').trigger('blur');
            }
            $scope.editBuilding=function(res){
                $scope.clearValidation();
                $scope.titleCaption="Edit";
                $scope.btnStatus="Update";
                if(res){
                    $scope.building_id=res.ID;
                    $scope.building_name=res.NAME;
                    $scope.build_no=res.NUMBER;
                    $scope.landmark=res.LANDMARK;
                }
            }
            
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
                    // if($scope.building_id){
                    //     var data=$filter('filter')($scope.viewData,{ID:$scope.building_id},true);
                    //     data[0].NAME=$scope.building_name;
                    //     data[0].NUMBER=$scope.build_no;
                    //     data[0].LANDMARK=$scope.landmark;
                    //     // console.log(data);
                    // }else{
                    //     $scope.viewData.push({ID:return_data.data.BUILDING_ID,NAME:$scope.building_name,NUMBER:$scope.build_no,LANDMARK:$scope.landmark});
                    // }
                });
            }

            $scope.viewData=[];
            $scope.refreshTable=function(){
                $http.get($localStorage.service+'InstitutionAPI/building',{headers:{'access_token':$localStorage.access_token}})
                .success(function(response){
                    $scope.viewData=response.data;
                });
            }
            $scope.refreshTable();
                $scope.deleteBuildingData=function(id,$index){
                    $http({
                        method : "get",
                        url : $localStorage.service+"InstitutionAPI/checkBuildingDetails",
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
                                            url : $localStorage.service+"InstitutionAPI/building",
                                            params : {id : id},
                                            headers:{'access_token':$localStorage.access_token}
                                            }).then(function mySucces(response) {
                                                //console.log(response,'responseresponse');
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
            // $scope.deleteBuildingData=function(id, $index){
            //     if(id){
            //         UIkit.modal.confirm('Are you sure to delete ?', function(e) {
            //             if(id){
            //                 $http({
            //                 method : "DELETE",
            //                 url : $localStorage.service+'InstitutionAPI/building',
            //                 params : {id : id},
            //                 headers:{'access_token':$localStorage.access_token}
            //                 }).then(function mySucces(response) {
            //                     if(response.data.status==true){
            //                         UIkit.notify({
            //                             message : response.data.message.message,
            //                             status  : 'success',
            //                             timeout : 2000,
            //                             pos     : 'top-center'
            //                         });
            //                     }
            //                     $scope.viewData.splice($index, 1);
            //                     $scope.refreshTable();
            //                 },function myError(response) {
            //                     UIkit.modal.alert('Building details are assigned to hostel settings');
            //                 })
            //             }
            //         },function(){
            //             // console.log("false");
            //         }, {
            //             labels: {
            //                 'Ok': 'Ok'
            //             }
            //         });
            //     }
            // }
        }
    );