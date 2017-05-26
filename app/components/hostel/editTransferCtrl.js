angular
    .module('rubycampusApp')
    .controller('editTransferCtrl', [
        '$scope',
        '$rootScope',
        '$timeout','$filter','$compile','$stateParams','$state','$localStorage','$http',
        function ($scope,$rootScope,$timeout, $filter,$compile,$stateParams,$state,$localStorage,$http) {
            $scope.btnStatus="Update";
            
                
            
            var $maskedInput = $('.masked_input');
                if($maskedInput.length) {
                    $maskedInput.inputmask();
                }
            var $formValidate = $('#form_validation');
            $formValidate
                .parsley()
                .on('form:validated',function() {
                    //$scope.$apply();
                })
                .on('field:validated',function(parsleyField) {
                    if($(parsleyField.$element).hasClass('md-input')) {
                       // $scope.$apply();
                    }
                });

            
            $http({
              method : "GET",
              url : $localStorage.service+"HostelAPI/Tranfer",
              params :{profileId : $stateParams.id},
              headers:{'access_token':$localStorage.access_token}
            }).then(function mySucces(data) {
                console.log(data,'checkkkk');
                $scope.getTransferId=data.data.message[0].PROFILE_ID;
                $timeout(function() {
                if (data) {
                    if(data.data.message[0].RESIDENT_TYPE=='Student'){
                        
                            // $scope.id=data.ID;
                            $scope.selectize_usertype=data.data.message[0].RESIDENT_TYPE;
                            $scope.selectize_stu_profileId=data.data.message[0].PROFILE_ID;
                            $scope.selectize_hname=data.data.message[0].HOSTEL_ID;
                            $scope.selectize_block=data.data.message[0].BLOCK_ID;
                            $scope.selectize_room=data.data.message[0].ROOM_ID;
                            $scope.currDate=data.data.message[0].DATE;
                            $scope.course_id=data.data.message[0].courseId;
                            $scope.batchId=data.data.message[0].batchId;
                        
                    }else{
                       
                        // $scope.id=data.ID;
                        $scope.selectize_usertype=data.RESIDENT_TYPE;
                        $scope.selectize_emp_profileId=data.PROFILE_ID;
                        $scope.selectize_hname=data.HOSTEL_ID;
                        $scope.selectize_block=data.BLOCK_ID;
                        $scope.selectize_room=data.roomName;
                        $scope.currDate=data.DATE;
                        $scope.dept_id=data.data.message[0].deptId;
                        
                    }  
                }
                }, 300);   
            },function myError(response){
                console.log(response);
            });

            $scope.selectize_usertype_options = ['Student','Employee'];
            $scope.selectize_usertype_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Resident',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                    
                    });
                }
            };
                $scope.deptData=[];
                $scope.course_data=[];
                $scope.batch_data=[];
            
                $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
                .success(function(dept_data){
                    $scope.deptData.push(dept_data.message);
                });
                
                $scope.selectize_deptId_options =$scope.deptData;
                $scope.selectize_deptId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Department',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            $scope.getEmployeeList(value);
                            // if($scope.vacate.selectize_usertype=='Student'){
                            //     $scope.courseData(value);
                            // }else{
                            //     $scope.getEmployeeList(value);
                            // }
                        });
                    }
                };
                $http.get($localStorage.service+'AcademicsAPI/courseDetail',{headers:{'access_token':$localStorage.access_token}})
                .success(function(course_data){
                    console.log(course_data,'course_data');
                    $scope.selectize_courseId_options=course_data.message;
                });
                
                
                $scope.selectize_courseId_options =[];
                $scope.selectize_courseId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Course',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            $scope.batchData(value);
                        });
                    }
                };
                
                $scope.batchData=function(id){
                    $http.get($localStorage.service+'AcademicsAPI/fetchbatchDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
                    .success(function(batch_data){
                        $scope.selectize_batchId_options=batch_data.data;
                    });
                }
                
                $scope.selectize_batchId_options =[];
                $scope.selectize_batchId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Batch',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            //console.log(value);
                            $scope.getStudentList(value);
                        });
                    }
                };
                
                $scope.getEmployeeList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'AcademicsAPI/fetchTeacherDetailList',
                    params: {
                        'id' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        $scope.selectize_employee_options=return_data.data.data;
                    });
                }
                
                $scope.selectize_employee_options =[];
                $scope.selectize_employee_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Employee',
                    valueField: 'EMP_ID',
                    labelField: 'EMP_ANME',
                    searchField: 'EMP_ANME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            $scope.getAllDetails(value);
                        });
                    }
                };
                
                $scope.getStudentList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'HostelAPI/allocateStudentDetail',
                    params: {
                        'batchId' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data,'return_datareturn_data');
                        $scope.showName=return_data.data.result[0].NAME;
                        $scope.selectize_student_options=return_data.data.result;
                    });
                }
                
                $scope.selectize_student_options =[];
                $scope.selectize_student_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Student',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            $scope.getAllDetails(value);
                        });
                    }
                };

                  $scope.getAllDetails = function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'HostelAPI/TranferData',
                    params: {
                        'profileId' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                         $scope.addNewHostel(return_data.data.message[0].HOSTEL_ID);
                        // $scope.addNewBlocks(return_data.data.message[0].HOSTEL_ID);
                        // $scope.addNewRoom(return_data.data.message[0].BLOCK_ID);
                    });
                }
            
                ///
                $scope.addNewHostel=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'HostelAPI/hostelView',
                    params :{id:id},
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        //console.log(return_data,'hostelnameee');
                        $scope.selectize_hname_options=return_data.data.message;
                        // $scope.addNewBlocks(return_data.data.message[0].ID);
                    });
                }
                $scope.selectize_hname_options =[];
                $scope.selectize_hname_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Hostel',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            $scope.addNewBlocks(value);
                        });
                    }
                };
                $scope.addNewBlocks=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'HostelAPI/hostelBlocks',
                    params :{id:id},
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data,'blocksss');
                        $scope.selectize_block_options=return_data.data.message;
                    });
                }
                $scope.selectize_block_options =[];
                $scope.selectize_block_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Blocks',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            $scope.addNewRoom(value);
                        });
                    }
                };
                
                $scope.addNewRoom=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'InstitutionAPI/roomDetails',
                    params :{id:id},
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        if(return_data.data.status==true){
                            $scope.selectize_room_options=return_data.data.data;
                        }else{
                            $scope.selectize_room_options='';
                        }

                        
                    });
                }
                $scope.selectize_room_options =[];
                $scope.selectize_room_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Rooms',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            
                        });
                    }
                };

                $http.get($localStorage.service+'HostelAPI/allocationView',{headers:{'access_token':$localStorage.access_token}})
                .success(function(getId){
                    $scope.getId=getId.message[0].ID;
                });
                $scope.updateTransfer=function(){
                    if($scope.selectize_usertype=='Student'){
                        $scope.selectize_profileId=$scope.selectize_stu_profileId
                    }else{
                        $scope.selectize_profileId=$scope.selectize_emp_profileId
                    }
                    $http({
                    method:'POST',
                    url: $localStorage.service+'HostelAPI/allocation',
                    data: {
                        'id' : $scope.getTransferId,
                        'type' : $scope.selectize_usertype,
                        'profileId' : $scope.selectize_profileId,
                        'buildingId' : $scope.selectize_hname,
                        'blockId' : $scope.selectize_block,
                        'roomId' : $scope.selectize_room,
                        'date' : $scope.currDate
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        if(return_data.data.status==true){
                           // console.log(return_data,"Data");
                           // UIkit.modal("#modal_overflow").hide();
                            UIkit.notify({
                                message : 'Data Updated successfully',
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });
                            $state.go('restricted.hostel.transfer');
                        }else {
                            UIkit.modal.alert('Same Room');
                        }
                    });
                }
        }
    ]);