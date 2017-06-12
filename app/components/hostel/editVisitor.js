angular
    .module('rubycampusApp')
    .controller('editVisitorCtrl', [
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
              url : $localStorage.service+"HostelAPI/visitors",
              params :{id : $stateParams.id},
              headers:{'access_token':$localStorage.access_token}
            }).then(function mySucces(data) {
                console.log(data,'visitor');
                $scope.getVisitorId=data.data.message[0].ID;
                $timeout(function() {
                if (data) {
                    if(data.data.message[0].RESIDENT_TYPE=='Student'){
                        $scope.wizard={
                            // dept_id:data.data.message[0].deptId,
                            course_id:data.data.message[0].courseId,
                            batchId:data.data.message[0].batchId
                        };
                        $scope.visitor={
                            selectize_usertype:data.data.message[0].RESIDENT_TYPE,
                            selectize_student:data.data.message[0].PROFILE_ID,
                            visitorname:data.data.message[0].visitorName,
                            relation:data.data.message[0].RELATION,
                            visit_date:data.data.message[0].DATE,
                            visit_intime:data.data.message[0].INTIME
                        };
                    }else{
                        $scope.wizard={
                           dept_id:data.data.message[0].deptId,
                        };
                        $scope.visitor={
                            selectize_usertype:data.data.message[0].RESIDENT_TYPE,
                            selectize_employee:data.data.message[0].PROFILE_ID,
                            visitorname:data.data.message[0].visitorName,
                            relation:data.data.message[0].RELATION,
                            visit_date:data.data.message[0].DATE,
                            visit_intime:data.data.message[0].INTIME
                        }; 
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
            // $scope.visitor={
            //     visit_intime:"00:00"
            // }
            $timeout(function() {
                $scope.visitor={
                // visit_outtime:"12:00"
            }
            }, 200);
            
            // Dept course and batch details start
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
                        //console.log(return_data,'return_data11');
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
                        });
                    }
                };

            
            $scope.updateVisitorDetails=function(){
                if($scope.visitor.selectize_usertype=='Student'){
                        $scope.profileId=$scope.visitor.selectize_student
                    }else{
                        $scope.profileId=$scope.visitor.selectize_employee
                    }
                 $http({
                    method:'POST',
                    url: $localStorage.service+'HostelAPI/visitors',
                    data: {
                        'id' : $scope.getVisitorId,
                        'type' : $scope.visitor.selectize_usertype,
                        'profileId' : $scope.profileId,
                        'name' : $scope.visitor.visitorname,
                        'relation' : $scope.visitor.relation,
                        'date' : $scope.visitor.visit_date,
                        'inTime' : $scope.visitor.visit_intime,
                        'outTime' : $scope.visitor.visit_outtime
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data);
                        if(return_data.data.status==true){
                            // UIkit.modal("#modal_overflow").hide();
                            UIkit.notify({
                                message : return_data.data.message,
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });
                            $state.go('restricted.hostel.visitors');
                            // $scope.refreshTable();
                        }
                    }, function error(response) {
                        
                    });
            }
        }
    ]);