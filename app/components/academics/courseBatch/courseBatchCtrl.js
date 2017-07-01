angular
    .module('rubycampusApp')
    .controller('courseBatchCtrl',
       
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage) {
            //Batch
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
                $scope.courseID="";
                $scope.dept_id="";
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
                $scope.courseID="";
                $scope.dept_id="";
                $scope.course_id='';
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
                $scope.courseID="";
                $scope.dept_id="";
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
                 .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });
                $timeout(function(){
                // date range
                    var $dp_start = $('#uk_dp_start'),
                    $dp_end = $('#uk_dp_end');
                    var start_date = UIkit.datepicker($dp_start, {
                        format:'DD.MM.YYYY'
                    });

                    var end_date = UIkit.datepicker($dp_end, {
                        format:'DD.MM.YYYY'
                    });

                    $dp_start.on('change',function() {
                        end_date.options.minDate = $dp_start.val();
                    });

                    $dp_end.on('change',function() {
                        start_date.options.maxDate = $dp_end.val();
                    });
                },600);
                var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
                $scope.clear_courseData = function() {
                    $scope.course_name='';
                    $scope.dept_id='';
                    $scope.attendance_type='';
                    $scope.percentage='';
                    $scope.grade_type='';
                    $scope.dept_id='';
                    $('.inputName').trigger('blur'); 
                }
                $scope.clear_deptData = function() {
                    $scope.dept_name='';
                    $scope.dept_code='';
                    $scope.hod_prof_id='';
                    $scope.room_id='';
                    $scope.phone_no='';
                    $('.inputName').trigger('blur'); 

                }
                 $scope.addBatch = function() {
                    //academicsAPI_courseData();
                    // academicsAPI_departmentList();
                    $scope.clearValidation();
                    $scope.titCaption="Add";
                    $scope.btnStatus="Save";
                    $scope.batch_id='';
                    $scope.course_id='';
                    $scope.batch_name='';
                    $scope.incharge_id='';
                    $scope.period_from='';
                    $scope.period_to='';
                    $scope.course_id='';
                    $scope.course_name='';
                    $scope.dept_id='';
                    $scope.attendance_type='';
                    $scope.percentage='';
                    $scope.grade_type='';
                    $scope.dept_name='';
                    $scope.dept_code='';
                    $scope.hod_prof_id='';
                    $scope.room_id='';
                    $scope.phone_no='';
                    $('.inputName').trigger('blur'); 
                    $timeout(function(){
                        $scope.shouldBeOpen = true;
                        // $('.uk-modal').find('input').trigger('blur');       
                    },500);
                };
                $scope.editBatch= function(res){
                    $scope.clearValidation();
                    $scope.titCaption="Edit";
                    $scope.btnStatus="Update";
                    if(res){
                        $scope.batch_id=res.ID;
                        $scope.course_id=res.COURSE_ID;
                        $scope.batch_name=res.NAME;
                        $scope.period_from=res.PERIOD_FROM;
                        $scope.period_to=res.PERIOD_TO;  
                        $scope.incharge_id=res.empData[0].ID;
                    }                    
                }

                $scope.courseData=[];
                $scope.viewData=[];
                $scope.EmpLIST=[];
                $scope.refreshTable=function(){
                    $http.get($localStorage.service+'AcademicsAPI/batchDetail',{headers:{'access_token':$localStorage.access_token}})
                    .success(function(batch_data){
                        $scope.viewData=batch_data.message;
                    });
                }
                $scope.refreshTable();
                    $http.get($localStorage.service+'AcademicsAPI/fetchCourseData',{headers:{'access_token':$localStorage.access_token}})
                    .success(function(cor_data){
                        console.log(cor_data,'cor_data');
                        if(cor_data.status==false){
                            $scope.courseData.push([{ID:0, NAME:"Add Course"}]);
                        }else{
                            $scope.courseData.push(cor_data.data);
                            $scope.courseData.push([{ID:0, NAME:"Add Course"}]);
                        }
                    }).error(function(cor_data){
                    })
                $http.get($localStorage.service+'SettingAPI/employeeList',{headers:{'access_token':$localStorage.access_token}})
                .success(function(emp_data){
                    //console.log(emp_data.data[0],'incharge');
                    $scope.EmpLIST.push(emp_data.data[0]);
                });

                $scope.selectize_courseId_options =$scope.courseData;
                $scope.selectize_courseId_config = {
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
                            if (value==0) {
                                $timeout(function(){
                                    $scope.shouldBeOpen = true;    
                                },500);
                                UIkit.modal("#course_modal",{bgclose: false, keyboard:false}).show(); 
                            };
                            
                            if(value){
                                $scope.selectize_incharge_options =$scope.EmpLIST;
                            }
                            else {
                                $scope.selectize_incharge_options =[];
                            }
                        });
                    }
                };

                $scope.selectize_incharge_options =[];
                $scope.selectize_incharge_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Batch Incharge',
                    valueField: 'PROFILE_ID',
                    labelField: 'FULLNAME',
                    searchField: 'FULLNAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            console.log(value);
                        });
                    }
                };
                $scope.saveCourseBatch=function(){
                    $http({
                        method:'POST',
                        url: $localStorage.service+'AcademicsAPI/batchDetail',
                        data: {
                            'batch_id' : $scope.batch_id,
                            'course_id' : $scope.course_id,
                            'batch_name' : $scope.batch_name,
                            'incharge' : $scope.incharge_id,
                            'period_from' : $scope.period_from,
                            'period_to' : $scope.period_to
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
                        UIkit.modal.alert('Course & Batch Name Already Exists');
                    }
                });
            }

            $scope.deleteBatch=function(id,$index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"AcademicsAPI/batchDetail",
                            params : {id : id},
                            headers:{'access_token':$localStorage.access_token}
                            }).then(function mySucces(response) {
                                
                                if(response.data.status==true){
                                    UIkit.notify({
                                        message : response.data.message,
                                        status  : 'success',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                    $scope.viewData.splice($index, 1);
                                    $scope.refreshTable();
                                }
                                
                            },function myError(response) {
                            })
                        }
                    },function(){
                        // console.log("false");
                        $scope.refreshTable();
                    }, {
                        labels: {
                            'Ok': 'Ok'
                        }
                    });
                }
            }
            // Course js
            $scope.deptData=[];
                $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
                .success(function(dept_data){
                    if(dept_data.status==false){
                        $scope.deptData.push([{ID:0,NAME:"Add Department"}]);
                    }else{
                        $scope.deptData.push(dept_data.message);
                        $scope.deptData.push([{ID:0,NAME:"Add Department"}]);
                    }
                });
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
                        console.log(value,'valuevalue');
                        if(value==0){
                             $timeout(function(){
                                $scope.shouldBeOpen = true;    
                            },500);
                            UIkit.modal("#department_Modal",{bgclose: false, keyboard:false}).show();
                            $scope.clear_deptData(); 

                        } 
                        
                    });
                }
            };
           
            // $scope.addCourse = function() {
            //     $scope.clearValidation();
            //     $scope.titCaption="Add";
            //     $scope.btnStatus='Save';
            //     $scope.course_id='';
            //     $scope.course_name='';
            //     $scope.dept_id='';
            //     $scope.attendance_type='';
            //     $scope.percentage='';
            //     $scope.grade_type='';
            //     $('.uk-modal').find('input').trigger('blur');
            // };
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
                    //console.log(return_data.data.message);
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
                            $('#form_validation').parsley().validate();          
                        },100); 
                        $scope.course_id=return_data.data.message.COURSE_ID;
                        $scope.clear_courseData();
                       
                    }else {
                        // UIkit.notify('Course Name Already Exists','danger');
                        UIkit.modal.alert('Course Name Already Exists');
                    }
                });
            }
            //Department js
            // $scope.addDepartment = function() {
            //         $scope.clearValidation();
            //         $scope.titCaption="Add";
            //         $scope.btnStatus="Save";
            //         $scope.dept_id='';
            //         $scope.dept_name='';
            //         $scope.dept_code='';
            //         $scope.hod_prof_id='';
            //         $scope.room_id='';
            //         $scope.phone_no='';
            //         $('.uk-modal').find('input').trigger('blur');
            //          $scope.deptFORM.$setPristine();
            //     };
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
                                $('#form_validation').parsley().validate();       
                            },100); 
                            $scope.dept_id=return_data.data.message.DEPT_ID;
                            $scope.clear_deptData();  
                        }else {
                            UIkit.modal.alert('Department Name Already Exists');
                        }
                    });
                }
                // End Department
        }
    );