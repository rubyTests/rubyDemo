angular
    .module('rubycampusApp')
    .controller('allocationviewCtrl',
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
                $scope.aloc={};
                $scope.selectize_usertype_options = ['Student','Employee'];
                $scope.selectize_usertype_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Resident',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            
                        });
                    }
                };
                           
                $scope.openModel = function() {
                    $scope.btnStatus="Save";
                    $scope.hidden_id=null;
                    $scope.selectize_usertype=null;
                    $scope.selectize_hname=null;
                    $scope.selectize_profileId=null;
                    $scope.selectize_block=null;
                    $scope.selectize_room=null;
                    $scope.reg_date=null;
                    $('.uk-modal').find('input').trigger('blur');
                };
                // $scope.edit_data=function(data){
                //     $scope.btnStatus="Update";
                //     if (data) {
                //          $timeout(function(){
                //             $scope.hidden_id=data.ID;
                //             $scope.selectize_usertype=data.RESIDENT_TYPE;
                //             $scope.selectize_profileId=data.PROFILE_ID;
                //             $scope.selectize_hname=data.HostelName;
                //             $scope.selectize_block=data.BLOCK_ID;
                //             $scope.reg_date=data.DATE;
                //         },600);
                //         $timeout(function(){
                //               $scope.selectize_room=data.RoomName;
                //         },400);
                       
                //     }
                // }

                $scope.viewData=[];
                $scope.refreshTable=function(){
                    $http.get($localStorage.service+'HostelAPI/allocationView',{headers:{'access_token':$localStorage.access_token}})
                    .success(function(view_data){
                        $scope.viewData=view_data.message;
                    });
                }
                $scope.refreshTable();
                
                $scope.empName =[];
                $http.get($localStorage.service+'EmployeemgmntAPI/employeeProfileView',{headers:{'access_token':$localStorage.access_token}})
                .success(function(user_data){
                    $scope.empName.push(user_data.data);
                });
                $scope.selectize_employee_options =$scope.empName;
                $scope.selectize_employee_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Employee',
                    valueField: 'PROFILE_ID',
                    labelField: 'EMPLOYEE_NAME',
                    searchField: 'EMPLOYEE_NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            
                        });
                    }
                };
                $scope.studentName =[];
                $http.get($localStorage.service+'ProfileAPI/studentProfileDetails',{headers:{'access_token':$localStorage.access_token}})
                .success(function(user_data){
                    $scope.studentName.push(user_data.result);
                });
                $scope.selectize_student_options =$scope.studentName;
                $scope.selectize_student_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Student',
                    valueField: 'profileId',
                    labelField: 'fname',
                    searchField: 'fname',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            
                        });
                    }
                };
                $scope.hostelName =[];
                $http.get($localStorage.service+'HostelAPI/hostelView',{headers:{'access_token':$localStorage.access_token}})
                .success(function(user_data){
                    console.log(user_data,'chk');
                    $scope.hostelName.push(user_data.message);
                });
                $scope.selectize_hname_options =$scope.hostelName;
                $scope.selectize_hname_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Hostel',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            $scope.getNameList(value);
                        });
                    }
                };
                $scope.selectize_block_options =[];
                $scope.selectize_block_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Blocks',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            $scope.getRoomList(value);
                        });
                    }
                };
                $scope.selectize_room_options =[];
                $scope.selectize_room_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Rooms',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            
                        });
                    }
                };
                $scope.getNameList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'HostelAPI/hostelBlocks',
                    params: {
                        'id' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        $scope.selectize_block_options=return_data.data.message;
                    });
                }
                 $scope.getRoomList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'institutionApi/roomDetails',
                    params: {
                        'id' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        $scope.selectize_room_options=return_data.data.data;
                    });
                }
                $scope.saveAllocation=function(){
                    if($scope.selectize_usertype=='Student'){
                        $scope.selectize_profileId=$scope.selectize_stu_profileId
                    }else{
                        $scope.selectize_profileId=$scope.selectize_emp_profileId
                    }
                    $http({
                    method:'POST',
                    url: $localStorage.service+'HostelAPI/allocation',
                    data: {
                        'id' : $scope.hidden_id,
                        'type' : $scope.selectize_usertype,
                        'profileId' : $scope.selectize_profileId,
                        'buildingId' : $scope.selectize_hname,
                        'blockId' : $scope.selectize_block,
                        'roomId' : $scope.selectize_room,
                        'date' : $scope.reg_date
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        if(return_data.data.status==true){

                            UIkit.modal("#modal_overflow").hide();
                            UIkit.notify({
                                message : return_data.data.message,
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });
                            $scope.refreshTable();
                        }else {
                            // UIkit.modal.alert('Course & Batch Name Already Exists');
                        }
                    });
                }
                  $scope.deleteAssignTeacher=function(id,$index){
                    if(id){
                        UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                            if(id){
                                $http({
                                method : "DELETE",
                                url : $localStorage.service+"HostelAPI/allocation",
                                params : {id : id},
                                headers:{'access_token':$localStorage.access_token}
                                }).then(function mySucces(response) {
                                    UIkit.notify({
                                        message : response.data.message,
                                        status  : 'success',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                    $scope.viewData.splice($index, 1);
                                    $scope.refreshTable();
                                },function myError(response) {
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