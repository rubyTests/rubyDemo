angular
    .module('rubycampusApp')
    .controller('assignTeacherCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter,$http,$localStorage) {
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
            
                $scope.deptData=[];
                $scope.courseData=[];
                $scope.returnProfile=[];
                $scope.subjectList=[];
                $scope.openModel = function() {
                    $scope.btnStatus="Save";
                    $scope.hidden_id=null;
                    $scope.dept_id=null;
                    $scope.course_id=null;
                    $scope.subject_id=null;
                    $scope.employee_id=null;
                    $('.uk-modal').find('input').trigger('blur');
                };
                $scope.edit_data= function(res){
                    $scope.btnStatus="Update";
                    if(res){
                        $scope.getAllCourseList(res.COURSE_ID);
                        $timeout(function(){
                            $scope.hidden_id=res.ID;
                            $scope.course_id=res.COURSE_ID;                            
                            $scope.employee_id=res.EMP_ID;
                        },400);
                        $timeout(function(){
                            $scope.subject_id=res.SUBJECT_ID;
                        },600);
                    }
                }
                $scope.viewData=[];
                $scope.refreshTable=function(){
                    $http.get($localStorage.service+'AcademicsAPI/assignTeacherDetail',{headers:{'access_token':$localStorage.access_token}})
                    .success(function(view_data){
                        $scope.viewData=view_data.message;
                    });
                }
                $scope.refreshTable();

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
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            $scope.getEmployeeList(value);
                        });
                    }
                };

                $scope.selectize_courseName_options =[];
                $scope.selectize_courseName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Course',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            // console.log(value);
                            $scope.selectize_subject_options=[];
                            $scope.getSubjectList(value);
                        });
                    }
                };

                $scope.selectize_subject_options =[];
                $scope.selectize_subject_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Subject',
                    valueField: 'COU_ID',
                    labelField: 'COURSE_NAME',
                    searchField: 'COURSE_NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            
                        });
                    }
                };

                $scope.selectize_empName_options =[];
                $scope.selectize_empName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Teacher',
                    valueField: 'EMP_ID',
                    labelField: 'EMP_ANME',
                    searchField: 'EMP_ANME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            
                        });
                    }
                };

                $http({
                method:'get',
                url: $localStorage.service+'AcademicsAPI/courseDetail',
                headers:{'access_token':$localStorage.access_token}
                }).then(function(courselist){
                    // console.log(courselist,'courselist');
                    $scope.selectize_courseName_options=courselist.data.message;
                });
                $scope.getSubjectList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'AcademicsAPI/fetchSubjectDetailList',
                    params: {
                        'id' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        $scope.selectize_subject_options=return_data.data.data;
                    });
                }
                $scope.getEmployeeList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'AcademicsAPI/fetchTeacherDetailList',
                    params: {
                        'id' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data,'employeelis');
                        $scope.selectize_empName_options=return_data.data.data;
                    });
                }

                $scope.saveAssignteacher=function(){
                    $http({
                    method:'POST',
                    url: $localStorage.service+'AcademicsAPI/assignTeacherDetail',
                    data: {
                        'hidden_id' : $scope.hidden_id,
                        'course_id' : $scope.course_id,
                        'subject' : $scope.subject_id,
                        'employee_id' : $scope.employee_id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        if(return_data.data.message.status==true){
                            UIkit.modal("#modal_overflow").hide();
                            UIkit.notify({
                                message : return_data.data.message.message,
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
                $scope.getAllCourseList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'test/AcademicsAPI/courseDetail',
                    params: {
                        'course_ID' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        // $timeout(function(){
                            $scope.dept_id=return_data.data.message[0].DEPT_ID;
                            // $scope.employee_id=[];
                        // },200);
                    });
                }

                $scope.deleteAssignTeacher=function(id,$index){
                    if(id){
                        UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                            if(id){
                                $http({
                                method : "DELETE",
                                url : $localStorage.service+"AcademicsAPI/assignTeacherDetail",
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