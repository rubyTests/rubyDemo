angular
    .module('rubycampusApp')
    .controller('courseCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage,$state) {
            var vm = this;
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
            //Department
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
                $scope.courDept_name='';
            }
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
                        }
                    ]
                })
                   .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });
                var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});

                $scope.deptData=[];
                $scope.viewData=[];

                $scope.refreshTable=function(){
                    $http.get($localStorage.service+'AcademicsAPI/courseDetail',{headers:{'access_token':$localStorage.access_token}})
                    .success(function(course_data){
                        console.log(course_data,'course_datacourse_data');
                        // console.log(angular.isArray(course_data.message),'course_datatestttttt');
                        //     if (angular.isArray(course_data.message)) {
                        //         $scope.viewData = course_data.message;    
                        //     }else{
                        //         $scope.viewData=[];
                        //     }
                        $scope.viewData=course_data.message;
                    });
                }
                $scope.refreshTable();
                var AcademicsAPI_departmentlist = function(){
                    $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
                    .success(function(dept_data){
                        if(dept_data.status==false){
                            $scope.deptData.push([{ID:0,NAME:"Add Department"}]);
                        }else{
                            $scope.deptData.push(dept_data.message);
                            $scope.deptData.push([{ID:0,NAME:"Add Department"}]);
                        }
                    });
                }
                AcademicsAPI_departmentlist();
                // $scope.selectize_gradingType_options = ['Weighted','UnWeighted'];
                // $scope.selectize_gradingType_config = {
                //     create: false,
                //     maxItems: 1,
                //     placeholder: 'Select Grade'
                // };
                $scope.selectize_attdnceType_options = ["Subject-Wise", "Daily"];
                $scope.selectize_attdnceType_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Attendance Type'
                };

                $scope.selectize_courDeptId_options =$scope.deptData;
                $scope.selectize_courDeptId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Department',
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
                        console.log()
                        if(value==0){
                            // /alert('out');
                            var modal = UIkit.modal("#department_Modal",{bgclose: false, keyboard:false});
                            if ( modal.isActive() ) {
                                modal.hide();
                            } else {
                                modal.show();
                            }
                            $timeout(function(){
                                $scope.shouldBeOpen = true;    
                            },500);
                        }
                        
                    });
                }
                };
                 $scope.clear_deptData = function(){
                    $scope.dept_name='';
                    $scope.dept_code='';
                    $scope.hod_prof_id='';
                    $scope.phone_no='';
                 }
                $scope.addCourse = function() {
                    //AcademicsAPI_departmentlist();
                    $scope.titCaption="Add";
                    $scope.btnStatus='Save';
                    $scope.course_id='';
                    $scope.course_name='';
                    $scope.courDept_name='';
                    $scope.attendance_type='';
                    $scope.percentage='';
                    $scope.grade_type='';
                    $scope.dept_name='';
                    $scope.dept_code='';
                    $scope.hod_prof_id='';
                    $scope.phone_no='';
                    $scope.clearValidation();
                    $('.inputName').trigger('blur'); 
                    $timeout(function(){
                        $scope.shouldBeOpen = true;
                        // $('.uk-modal').find('input').trigger('blur');        
                    },500);
                };
                $scope.editCourse= function(res){
                    $scope.clearValidation();
                    $scope.titCaption="Edit";
                    $scope.btnStatus='Update';
                    if(res){
                        $scope.course_id=res.ID;
                        $scope.course_name=res.NAME;
                        $scope.courDept_name=res.DEPT_ID;
                        $scope.attendance_type=res.ATTENDANCE_TYPE;
                        $scope.percentage=res.PERCENTAGE;
                        $scope.grade_type=res.GARDE_TYPE;
                    }
                }
            // Save Data
            $scope.saveCourse=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'AcademicsAPI/courseDetail',
                data: {
                    'COURSE_ID' : $scope.course_id,
                    'COURSE_NAME' : $scope.course_name,
                    'COURSE_DEPT_ID' : $scope.courDept_name,
                    'COURSE_ATTENDANCE_TYPE' : $scope.attendance_type,
                    'COURSE_PERCENTAGE' : $scope.percentage,
                    'COURSE_GARDE_TYPE' : $scope.grade_type
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
                        UIkit.modal.alert('Course Name Already Exists');
                    }
                });
            }
            $scope.deleteCourse=function(id,$index){
                $http({
                    method : "get",
                    url : $localStorage.service+"AcademicsAPI/courseDetailCheck",
                    params : {id : id},
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function mySucces(response) {
                        if(response.data.status==true){
                            if(id){
                                UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                                    if(id){
                                        $http({
                                        method : "DELETE",
                                        url : $localStorage.service+"AcademicsAPI/courseDetail",
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
                                     //console.log("false");
                                    $scope.refreshTable();
                                }, {
                                    labels: {
                                        'Ok': 'Ok'
                                    }
                                });
                            }

                        }
                    },function myError(response) {
                        UIkit.modal.alert(response.data.message);
                    })
            }
            //Department js
            // $scope.addDepartment = function() {
            //     $scope.clearValidation();
            //     $scope.titCaption="Add";
            //     $scope.btnStatus="Save";
            //     $scope.dept_id='';
            //     $scope.dept_name='';
            //     $scope.dept_code='';
            //     $scope.hod_prof_id='';
            //     $scope.room_id='';
            //     $scope.phone_no='';
            //     $('.uk-modal').find('input').trigger('blur');
            //      $scope.deptFORM.$setPristine();
            // };
                // $scope.selectize_deptId_options =$scope.deptData;
                // $scope.selectize_deptId_config = {
                //     create: false,
                //     maxItems: 1,
                //     placeholder: 'Select Department',
                //     valueField: 'ID',
                //     sortField: [{field: 'ID', direction: 'desc'}],
                //     labelField: 'NAME',
                //     searchField: 'NAME',
                //     render: {
                //     option: function (item, escape) {
                //         if(item.ID==0){
                //             return '<div class="option">' +
                //                         '<div class="text">' +
                //                             '<i class="uk-icon-plus linkClr"></i>' + '<span class="linkClrtxt">' + escape(item.NAME) + '</span>' +
                //                        '</div>' +
                //                     '</div>';
                //         }else{
                //              return '<div class="option">' +
                //                         '<div class="text">' +
                //                             '<span class="name">' + escape(item.NAME) + '</span>' +
                //                        '</div>' +
                //                     '</div>';
                //         }
                       
                //     }
                // },
                // onInitialize: function(selectize){
                //     selectize.on('change', function(value) {
                //         if(value==0){
                //             var modal = UIkit.modal("#department_Modal",{bgclose: false, keyboard:false});
                //             if ( modal.isActive() ) {
                //                 modal.hide();
                //             } else {
                //                 modal.show();
                //             }
                //             $timeout(function(){
                //                 $scope.shouldBeOpen = true;    
                //             },500);
                //             //UIkit.modal("#department_Modal").show();
                //         } 
                        
                //     });
                // }
                // };
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
                        //console.log(value);
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
                        //console.log(return_data.data.message.message);
                        UIkit.modal("#department_Modal").hide();
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        // AcademicsAPI_departmentlist();
                        $scope.deptData.push({ID:return_data.data.message.DEPT_ID,NAME:return_data.data.message.DEPT_NAME});
                        //console.log($scope.deptData.,'$scope.deptData1111');
                        $timeout(function(){
                            UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false}).show();    
                        },100); 
                        $scope.courDept_name=return_data.data.message.DEPT_ID;
                        $scope.clear_deptData();    
                        // $scope.courDept_name=return_data.data.message.DEPT_NAME;                       
                        //$scope.deptData.push({ID:100,NAME:"Add "});
                        //console.log(return_data.data.message.DEPT_NAME,'return_data22');
                       
                    }else {
                        UIkit.modal.alert('Department Name Already Exists');
                    }
                });
            }
           
        }
    );