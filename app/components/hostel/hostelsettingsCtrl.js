angular
    .module('rubycampusApp')
    .controller('hostelsettingsCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter,$localStorage,$http) {
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
            $scope.viewData=[];
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

                var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
                $scope.openModel = function() {
                    $scope.clearValidation();
                    $scope.btnStatus="Save";
                    $scope.hidden_id=null;
                    $scope.hostel_name=null;
                    $scope.selectize_bname=null;
                    $('.uk-modal').find('input').trigger('blur');
                };
                $scope.edit_data=function(data){
                    $scope.btnStatus="Update";
                    $scope.clearValidation();
                    if (data) {
                        $scope.hidden_id=data.ID;
                        $scope.hostel_name=data.NAME;
                        $scope.selectize_bname=data.building;
                    }
                }

                $scope.viewData=[];
                    $scope.refreshTable=function(){
                        $http.get($localStorage.service+'HostelAPI/hostelView',{headers:{'access_token':$localStorage.access_token}})
                        .success(function(view_data){
                            //console.log(view_data,'testttttt');
                            $scope.viewData=view_data.message;
                        });
                    }
                $scope.refreshTable();
                $scope.buildingId =[];
                $http.get($localStorage.service+'InstitutionAPI/building',{headers:{'access_token':$localStorage.access_token}})
                .success(function(user_data){
                    //console.log(user_data,'building');
                    if(user_data.status==false){
                        $scope.buildingId.push({ID:0, NAME:"Add Building"});
                    }else{
                        $scope.buildingId.push(user_data.data);
                    }
                });

                $scope.selectize_buildingId_options =$scope.buildingId;
                $scope.selectize_buildingId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Building',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    render: {
                        option: function (item, escape) {
                            //console.log(item,"item");
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
                            if(value==0){
                                var modal = UIkit.modal("#addBuilding_modal",{bgclose: false, keyboard:false});
                                modal.show();
                                //$state.go('restricted.academics.course')
                            } 
                            
                        });
                    }
                };

                 $scope.saveHostelSettings=function(){  
                    $http({
                    method:'POST',
                    url: $localStorage.service+'HostelAPI/hostel',
                    data: {
                        'id' : $scope.hidden_id,
                        'name' : $scope.hostel_name,
                        'buildingId' : $scope.selectize_bname
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        //console.log(return_data,'return_data');
                        if($scope.btnStatus=='Save'){
                            UIkit.modal("#modal_overflow").hide();
                            UIkit.notify({
                                message : 'Hostel Allocated Successfully',
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });
                            $scope.refreshTable();
                        }else {
                            //UIkit.modal.alert('Course & Batch Name Already Exists');
                        }
                        if($scope.btnStatus=='Update'){
                            UIkit.modal("#modal_overflow").hide();
                            UIkit.notify({
                                message : return_data.data.message,
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });
                            $scope.refreshTable();
                        }else {
                            //UIkit.modal.alert('Course & Batch Name Already Exists');
                        }
                    }, function error(response) {
                        UIkit.modal.alert('Building Already Assigned');
                    });
                }
                $scope.deleteAssignTeacher=function(id,$index){
                    if(id){
                        UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                            if(id){
                                $http({
                                method : "DELETE",
                                url : $localStorage.service+"HostelAPI/hostel",
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
                                    UIkit.modal.alert('Hostel details are assigned to allocated students');
                                })
                            }
                        },function(){
                             //console.log("false");
                        }, {
                            labels: {
                                'Ok': 'Ok'
                            }
                        });
                    }
                }

                // // Save Building Data
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
                        UIkit.modal("#addBuilding_modal").hide();
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

        }
    );