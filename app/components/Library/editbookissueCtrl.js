angular
    .module('rubycampusApp')
    .controller('editbookissueCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$filter',
        '$compile',
        '$location',
        '$http',
        '$state',
        '$localStorage',
        '$stateParams',
        function ($scope, $rootScope, $timeout, $resource, $filter, $compile, $location, $http, $state, $localStorage, $stateParams) {

            $scope.selectize_usertype_options = ['Student','Employee'];
            $scope.selectize_usertype_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Student / Employee',
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
                    });
                }
            };
                
            $http.get($localStorage.service+'AcademicsAPI/courseDetail',{headers:{'access_token':$localStorage.access_token}})
            .success(function(course_data){
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
                    console.log(return_data,'Employee');
                    $scope.selectize_employee_option=return_data.data.data;
                });
            }
                
            $scope.selectize_employee_option =[];
            $scope.selectize_employee_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Employee',
                valueField: 'EMP_ID',
                labelField: 'EMP_ANME',
                searchField: 'EMP_ANME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        //$scope.getAllDetails(value);
                    });
                }
            };
                
            $scope.getStudentList=function(id){
                $http({
                method:'get',
                url: $localStorage.service+'LibraryAPI/libraryStudentDetail',
                params: {
                    'batchId' : id
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_datareturn_data');
                    // $scope.showName=return_data.data.result[0].NAME;
                    $scope.selectize_student_option=return_data.data.message;
                });
            }
                
            $scope.selectize_student_option =[];
            $scope.selectize_student_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Student',
                valueField: 'PROFILE_ID',
                labelField: 'profileName',
                searchField: 'profileName',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value,'value');
                    });
                }
            };

            $scope.book_data = [];
            $http({
                method:'GET',
                url: $localStorage.service+'LibraryAPI/lBookIssue',
                params: {
                    'id' : $stateParams.id,
                },
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                console.log(return_data,'return_datareturn_data');
                $scope.book_data = return_data.data.message[0];
                $scope.book_id = $scope.book_data.ID;
                $scope.book_code = $scope.book_data.BOOK_ID;
                $scope.selectize_usertype = $scope.book_data.TYPE;
                $scope.issue_date = $scope.book_data.ISSUED_DATETIME;
                $scope.due_date = $scope.book_data.DUE_DATETIME;
                if(return_data.data.message[0].TYPE == "Student"){
                    $timeout(function(){
                        $scope.selectize_batchId = $scope.book_data.batchId;
                        $scope.selectize_courseId = $scope.book_data.courseId;
                        $scope.selectize_student = $scope.book_data.PROFILE_ID;
                    },200);
                }else if(return_data.data.message[0].TYPE == "Employee"){
                    $timeout(function(){
                        $scope.selectize_deptId = $scope.book_data.deptId;
                        $scope.selectize_employee = $scope.book_data.PROFILE_ID;
                    },200);
                }
            });

            $scope.updateBookIssue = function(){
                
                if($scope.selectize_usertype=='Student'){
                    $scope.selectize_profileId=$scope.selectize_student;
                }else{
                    $scope.selectize_profileId=$scope.selectize_employee;
                }

                $http({
                    method:'POST',
                    url: $localStorage.service+'LibraryAPI/lBookIssue',
                    data: {
                        'bookId' : $scope.book_id,
                        'code' : $scope.book_code,
                        'type' : $scope.selectize_usertype,
                        'profileId' : $scope.selectize_profileId,
                        'issued_date' : $scope.issue_date,
                        'due_date' : $scope.due_date
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        if(return_data.data.status==true){
                            console.log(return_data,"Data");
                            UIkit.notify({
                                message : return_data.data.message,
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });
                           $state.go('restricted.library.bookissue_view');
                        }else {
                            UIkit.modal.alert('Already Issued');
                        }
                    });
            }

            $scope.backBtn=function(){
                window.history.back();
            }
        }
    ]);