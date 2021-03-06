angular
    .module('rubycampusApp')
    .controller('addbookissueCtrl', [
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
        function ($scope, $rootScope, $timeout, $resource, $filter, $compile, $location, $http, $state, $localStorage) {
            
            // $scope.bookDetails=[];
            // $scope.tableView_data=[];
            // $scope.employee_data=[];
            // $resource('app/components/Library/book_details.json')
            // .query()
            // .$promise
            // .then(function(book_data) {
            //     $scope.bookDetails.push(book_data);
            // });

            // $resource('app/components/employeemanagement/employee_list.json')
            // .query()
            // .$promise
            // .then(function(emp_data) {
            //     $scope.employee_data.push(emp_data);
            // });

            // $scope.selectize_dept_options = ["Computer Science and Engineering", "Information Technology","Electrical and Electronics Engineering","Civil Engineering","Mechanical Engineering"];
            // $scope.selectize_dept_config = {
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Select Department'
            // };
            // $scope.selectize_category_options = ["Student","Employee"];
            // $scope.selectize_category_config = {
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Student / Employee'
            // };
            // $scope.selectize_course_options = ["Computer Science and Engineering", "Information Technology","Electrical and Electronics Engineering","Civil Engineering","Mechanical Engineering"];
            // $scope.selectize_course_config = {
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Select Course'
            // };
            // $scope.selectize_batch_options = ["Batch 1", "Batch 2","Batch 3","Batch 4","Batch 5","Batch 6"];
            // $scope.selectize_batch_config = {
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Select Batch'
            // };

            // $scope.selectize_employee_option = $scope.bookDetails;
            // $scope.selectize_employee_config = {
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Select Employee',
            //     valueField: 'id',
            //     labelField: 'user_name',
            //     onInitialize: function(selectize){
            //         selectize.on('change', function(val) {
            //             var empReturndata=$filter('filter')($scope.employee_data[0], {id : parseInt(val)}, true);
            //             // console.log(empReturndata,'fsdfsd');
            //             if(empReturndata[0]){
            //              $scope.selectize_dept=[empReturndata[0].Dept];
            //              $scope.selectize_subject=[empReturndata[0].batch];
            //              $scope.book_taken=0;
            //             }
            //             $('#page_content_inner').trigger('click');
            //         });
            //     }
            // };
            // $scope.selectize_student_option = $scope.bookDetails;
            // $scope.selectize_student_config = {
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Select Student',
            //     valueField: 'id',
            //     labelField: 'user_name',
            //     onInitialize: function(selectize){
            //         selectize.on('change', function(val) {
                        
            //         });
            //     }
            // };

            // $scope.backBtn=function(){
            //     window.history.back();
            // }

            $scope.items=[];
            $http({
                method:'GET',
                url: $localStorage.service+'LibraryAPI/lBook',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                console.log(return_data,'return_data');
                $scope.items.push(return_data.data.message);

                angular.forEach($scope.items[0], function(values, keys){
                    values.value=values.CODE+" - "+values.NAME;
                });

                UIkit.on('domready.uk.dom', function(){
                    UIkit.autocomplete($('#autocomplete'), {
                      source: $scope.items[0],
                      minLength:1,
                      flipDropdown:true
                    }).on('selectitem.uk.autocomplete', function (e, data, ac) {
                        console.log(data);
                    });
                });
            });

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

            $scope.saveBookIssue = function(){
                var $code = $scope.book_code.split(" - ")[0];
                console.log($code);
                if($scope.selectize_usertype=='Student'){
                    $scope.selectize_profileId=$scope.selectize_student;
                }else{
                    $scope.selectize_profileId=$scope.selectize_employee;
                }

                $http({
                    method:'POST',
                    url: $localStorage.service+'LibraryAPI/lBookIssue',
                    data: {
                        'book_issue_id' : $scope.book_issue_id,
                        'code' : $code,
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
    ]).directive('ngFocusOut', function( $timeout ) {
        return function( $scope, elem, attrs ) {
            elem.bind('blur',function(){
                var data = $scope.items[0] || []; 
                var index = data.findIndex(x => x.NAME == $scope.book_code);
                if (index==-1) {
                    $scope.book_code="";
                }
            });
        };
    });