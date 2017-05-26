angular
    .module('rubycampusApp')
    .controller('addTransferCtrl', [
        '$scope',
        '$window',
        '$timeout',
        '$filter',
        '$http',
        '$state',
        '$rootScope',
        '$localStorage',
        function ($scope, $window, $timeout,$filter, $http, $state, $rootScope, $localStorage) {
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
            $scope.btnStatus="Save";
            $scope.userChange=function(){
                $scope.selectize_emp_profileId='';
                $scope.selectize_stu_profileId='';
                // $scope.selectize_block='';
                // $scope.selectize_room='';
                // $scope.transferDate='';
                // $scope.selectize_student_options='';
                // $scope.selectize_courseId_options='';
                // $scope.selectize_batchId_options='';
            }
            $scope.selectize_usertype="Student";
            $scope.selectize_usertype_options = ['Student','Employee'];
            $scope.selectize_usertype_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Resident',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        // $scope.selectize_usertype=null;
                        // $scope.selectize_hname=null;
                        // $scope.selectize_emp_profileId='';
                        // $scope.selectize_stu_profileId='';
                        // $scope.selectize_block=null;
                        // $scope.selectize_room=null;
                        // $scope.transferDate=null;
                        // $scope.selectize_student_options=null;
                        // $scope.selectize_courseId_options=null;
                        // $scope.selectize_batchId_options=null;
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
                
                // $scope.courseData=function(id){
                //     $http.get($localStorage.service+'AcademicsAPI/fetchcourseDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
                //     .success(function(course_data){
                //         $scope.selectize_courseId_options=course_data.data;
                //     });
                // }

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
                
                // $scope.studentName =[];
                // $http.get($localStorage.service+'HostelAPI/allocateStudentDetail',{headers:{'access_token':$localStorage.access_token}})
                // .success(function(user_data){
                //     $scope.studentName.push(user_data.result);
                // });
                
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
                        console.log(return_data,'hstlll');
                        $scope.getHostelList(return_data.data.message[0].HOSTEL_ID);
                        $scope.getBlockList(return_data.data.message[0].HOSTEL_ID);
                        $scope.getRoomList(return_data.data.message[0].BLOCK_ID);

                        $scope.addNewBlocks(return_data.data.message[0].HOSTEL_ID);
                        $scope.addNewHostel(return_data.data.message[0].HOSTEL_ID);
                        $scope.addNewRoom(return_data.data.message[0].BLOCK_ID);
                    });
                }
                $scope.getHostelList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'HostelAPI/hostelView',
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        if(return_data.data.status==true){
                            $scope.preHostelName=return_data.data.message[0].NAME;
                        }else{
                            $scope.preHostelName="";
                        }
                        
                    });
                }
                $scope.getBlockList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'HostelAPI/hostelBlocks',
                    params :{id:id},
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        $scope.preBlockName=return_data.data.message[0].NAME;
                    });
                }
                $scope.getRoomList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'InstitutionAPI/roomDetails',
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        $scope.preRoomName=return_data.data.data[0].NAME;
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
                        console.log(return_data,'hostelnameee');
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
                    //console.log($scope.getId,'getId');
                });
                $scope.saveTransfer=function(){
                    if($scope.selectize_usertype=='Student'){
                        $scope.selectize_profileId=$scope.selectize_stu_profileId
                    }else{
                        $scope.selectize_profileId=$scope.selectize_emp_profileId
                    }
                    $http({
                    method:'POST',
                    url: $localStorage.service+'HostelAPI/allocation',
                    data: {
                        'id' : $scope.getId,
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
                            console.log(return_data,"Data");
                            UIkit.modal("#modal_overflow").hide();
                            UIkit.notify({
                                message : return_data.data.message,
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
                var date = new Date();
                $scope.currDate=$filter('date')(date,'dd.MM.yyyy');
                $timeout(function(){
                    // date range
                    var $dp_end = $('#uk_dp_end');

                    var end_date = UIkit.datepicker($dp_end, {
                        format:'DD.MM.YYYY'
                    });
                    $dp_end.on('change',function() {
                        start_date.options.minDate = $dp_end.val();
                    });
                },100);

                // var d=new Date();
                // var year=d.getFullYear();
                // var month=d.getMonth()+1;
                // var day=d.getDate();
                // if (month<10){
                // month="0" + month;
                // };
                // if (day<10){
                //     dayNew = "0" + day;
                // }else{
                //     dayNew = day;
                // };
                
                // $scope.date=dayNew + "." + month + "." + year;
                // $scope.currDate = $scope.date;
           
            

        }
    ]);