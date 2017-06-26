angular
    .module('rubycampusApp')
    .controller('subjectCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, $filter,$http,$rootScope,$localStorage) {
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
            //Course
            var $formValidate = $('#form_validation1');
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
            $scope.clearValidation1=function(){
                $('#form_validation1').parsley().reset();
            }
            //Department
            var $formValidate = $('#form_validation2');
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
            $scope.clearValidation2=function(){
                $('#form_validation2').parsley().reset();
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
                    }
                ]
            })
            .withOption('initComplete', function() {
                $timeout(function() {
                    $compile($('.dt-uikit .md-input'))($scope);
                })
            });

            var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});

            $scope.courseData=[];
            $scope.viewData=[];
            $scope.refreshTable=function(){
                $http.get($localStorage.service+'AcademicsAPI/subjectDetail',{headers:{'access_token':$localStorage.access_token}})
                .success(function(course_data){
                    $scope.viewData=course_data.message;
                });
            }
            // var academicsAPI_courseData = function(){
                $http.get($localStorage.service+'AcademicsAPI/fetchCourseData',{headers:{'access_token':$localStorage.access_token}})
                .success(function(cor_data){
                    if(cor_data.status==false){
                        $scope.courseData.push([{ID:0, NAME:"Add Course"}]);
                    }else{
                        $scope.courseData.push(cor_data.data);
                        $scope.courseData.push([{ID:0, NAME:"Add Course"}]);
                    }
                });
            // }
            // academicsAPI_courseData();
            $scope.refreshTable();
            
            $scope.selectize_courseName_options =$scope.courseData;
            $scope.selectize_courseName_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Course',
                valueField: 'ID',
                sortField: [{field: 'ID', direction: 'desc'}],
                labelField: 'NAME',
                searchField: 'NAME',
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
                        if (value==0 && value!='') {
                            $timeout(function(){
                                $scope.shouldBeOpen = true;    
                            },500);
                            UIkit.modal("#course_modal",{bgclose: false, keyboard:false}).show();
                            //UIkit.modal("#course_modal").show();
                        };
                    });
                }
            };

            $scope.selectize_subType_options =['Daily','Regular'];
            $scope.selectize_subType_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Type',
            };

            $scope.addSubject = function() {
                // academicsAPI_departmentList();
                // academicsAPI_courseData();
                $scope.department_clearData();
                $scope.course_cleardata();
                $scope.clearValidation();
                $scope.titCaption="Add";
                $scope.btnStatus='Save';
                $scope.cou_sub_id='';
                $scope.sub_id='';
                $scope.subject_name='';
                $scope.sub_code='';
                $scope.course_id='';
                $scope.total_hours='';
                $('.inputName').trigger('blur'); 
                $timeout(function(){
                    $scope.shouldBeOpen = true;
                    //$('.uk-modal').find('input').trigger('blur');    
                },500);
                
            };
            $scope.editSubject= function(res){
                $scope.clearValidation();
                $scope.titCaption="Edit";
                $scope.btnStatus='Update';
                if(res){
                    $scope.cou_sub_id=res.ID;
                    $scope.sub_id=res.SUB_ID;
                    $scope.subject_name=res.NAME;
                    $scope.sub_code=res.CODE;
                    // $scope.sub_type=res.TYPE;
                    $scope.course_id=res.COURSE_ID;
                    $scope.total_hours=res.TOTAL_HOURS;
                    // $scope.credit_hours=res.CREDIT_HOURS;
                }
            }

            $scope.saveSubjectData=function(){
                $http({
                    method:'POST',
                    url: $localStorage.service+'AcademicsAPI/subjectDetail',
                    data: {
                        'cou_sub_id' : $scope.cou_sub_id,
                        'sub_id' : $scope.sub_id,
                        'subject_name' : $scope.subject_name,
                        'sub_code' : $scope.sub_code,
                        // 'sub_type' : $scope.sub_type,
                        'course_id' : $scope.course_id,
                        'total_hours' : $scope.total_hours,
                        // 'credit_hours' : $scope.credit_hours
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.message.message);
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
                        UIkit.modal.alert('Course & Subject Name Already Exists');
                    }
                });
            }

            $scope.deleteSubject=function(id,subID,$index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"AcademicsAPI/subjectDetail",
                            params : {'CS_ID' : id,'subID':subID},
                            headers:{'access_token':$localStorage.access_token}
                            }).then(function mySucces(response) {
                                // console.log(response,'ss');
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
            // Course js
            $scope.deptData=[];
            // var academicsAPI_departmentList = function(){
                $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
                .success(function(dept_data){
                    if(dept_data.status==false){
                        $scope.deptData.push([{ID:-1,NAME:"Add Department"}]);
                    }else{
                        $scope.deptData.push(dept_data.message);
                        $scope.deptData.push([{ID:-1,NAME:"Add Department"}]);
                    }
                });
            // }
            // academicsAPI_departmentList();
           
            $scope.selectize_gradingType_options = ['Weighted','UnWeighted'];
            $scope.selectize_gradingType_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Grade'
            };
            $scope.selectize_attdnceType_options = ["Subject-Wise", "Daily"];
            $scope.selectize_attdnceType_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Attendance Type'
            };
            $scope.selectize_deptId_options =$scope.deptData;
            $scope.selectize_deptId_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Department',
                valueField: 'ID',
                sortField: [{field: 'ID', direction: 'desc'}],
                labelField: 'NAME',
                searchField: 'NAME',
                render: {
                    option: function (item, escape) {
                        if(item.ID==-1){
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
                        console.log(value,'valuevalue');
                        if(value==-1){
                            $timeout(function(){
                                $scope.shouldBeOpen = true;    
                            },500);
                            UIkit.modal("#department_Modal",{bgclose: false, keyboard:false}).show();
                        } 
                        
                    });
                }
            };
            $scope.titCaption="Add";
            $scope.btnStatus='Save';
            $scope.course_cleardata = function() {
                $scope.clearValidation1();
                $scope.course_id='';
                $scope.course_name='';
                $scope.dept_id='';
                $scope.attendance_type='';
                $scope.percentage='';
                $scope.grade_type='';
                $timeout(function(){
                    $scope.shouldBeOpen = true;
                    $('.uk-modal').find('input').trigger('blur');    
                },500);
            };
            // Save Data
            $scope.saveCourse=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'AcademicsAPI/courseDetail',
                data: {
                    // 'COURSE_ID' : $scope.course_id,
                    'COURSE_NAME' : $scope.course_name,
                    'COURSE_DEPT_ID' : $scope.dept_id,
                    'COURSE_ATTENDANCE_TYPE' : $scope.attendance_type,
                    'COURSE_PERCENTAGE' : $scope.percentage,
                    'COURSE_GARDE_TYPE' : $scope.grade_type
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.message.message);
                    if(return_data.data.message.status==true){
                        UIkit.modal("#course_modal").hide();
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $scope.courseData.push({ID:return_data.data.message.COURSE_ID,NAME:return_data.data.message.COURSE_NAME});
                        $timeout(function(){
                            UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false}).show();       
                        },100); 
                        $scope.course_cleardata();
                        // UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false}).show();
                    }else {
                        // UIkit.notify('Course Name Already Exists','danger');
                        UIkit.modal.alert('Course Name Already Exists');
                    }
                });
            }
            //Department js
            $scope.department_clearData= function() {
                $scope.clearValidation2();
                $scope.dept_id='';
                $scope.dept_name='';
                $scope.dept_code='';
                $scope.hod_prof_id='';
                $scope.phone_no='';
                $timeout(function(){
                    $scope.shouldBeOpen = true;
                    $('.uk-modal').find('input').trigger('blur');    
                },500);
                // $('.uk-modal').find('input').trigger('blur');
                //  $scope.deptFORM.$setPristine();
            };
            $scope.empList=[];
            $http.get($localStorage.service+'SettingAPI/employeeList',{headers:{'access_token':$localStorage.access_token}})
            .success(function(return_data){
                $scope.empList.push(return_data.data);
            });

            $scope.selectize_hodProfieId_options =$scope.empList;
            $scope.selectize_hodProfieId_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select HOD',
                valueField: 'PROFILE_ID',
                labelField: 'FULLNAME',
                searchField: 'FULLNAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };
            $scope.saveDeaprtment=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'AcademicsAPI/departmentDetail',
                data: {
                    'DEPT_NAME' : $scope.dept_name,
                    'DEPT_CODE' : $scope.dept_code,
                    'DEPT_ROOM_ID' : $scope.room_id,
                    'DEPT_HOD' : $scope.hod_prof_id,
                    'DEPT_PHONE' : $scope.phone_no
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    if(return_data.data.message.status==true){
                        console.log(return_data.data.message.message);
                        UIkit.modal("#department_Modal").hide();
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $scope.deptData.push({ID:return_data.data.message.DEPT_ID,NAME:return_data.data.message.DEPT_NAME});
                            $timeout(function(){
                                UIkit.modal("#course_modal",{bgclose: false, keyboard:false}).show();    
                            },100); 
                        $scope.department_clearData();
                    }else {
                        UIkit.modal.alert('Department Name Already Exists');
                    }
                });
            }
            // End Department
        }
    );