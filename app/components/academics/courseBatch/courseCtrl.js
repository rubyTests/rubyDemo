angular
    .module('rubycampusApp')
    .controller('courseCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage,$state) {
            var vm = this;
            $timeout(function(){
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
            })
                $scope.clearValidation=function(){
                    $('#form_validation').parsley().reset();
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

                var modal = UIkit.modal("#course_modal",{bgclose: false, keyboard:false});

                $scope.deptData=[];
                $scope.viewData=[];

                $scope.refreshTable=function(){
                    $http.get($localStorage.service+'AcademicsAPI/courseDetail',{headers:{'access_token':$localStorage.access_token}})
                    .success(function(course_data){
                        $scope.viewData=course_data.message;
                    });
                }
                $scope.refreshTable();
                //$scope.refreshTable();
                // $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
                // .success(function(dept_data){
                //     if(dept_data.status==false){
                //         $scope.deptData.push({ID:0,NAME:'Add Department'});
                //     }else{
                //         $scope.deptData.push(dept_data.message);
                //     }
                // });
                $scope.setDepartmentId=function(dept_data){
                    if (dept_data.status==false) {
                        // $scope.deptData=[];
                        $scope.deptData.push([{ID:0, NAME:"Add Department"}]);
                    }else{
                        $scope.deptData.push(dept_data.message);
                        $scope.deptData.push([{ID:0, NAME:"Add Department"}]);
                    }
                }
                
                $scope.refreshdepartment=function(){
                    $scope.deptData=[];
                    $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
                    .success(function(dept_data){
                        console.log(dept_data,'dept_data');
                        $scope.setDepartmentId(dept_data);
                    }).error(function(dept_data){
                        $scope.setDepartmentId(dept_data);
                    })
                };
                $scope.refreshdepartment();


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
                    placeholder: 'Select Department',
                    valueField: 'ID',
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
                                UIkit.modal("#department_modal").show();
                            };
                            // if(value=='Add Department'){
                            //     $localStorage.coursePath=true;
                            //     $state.go('restricted.academics.department')
                            // } 
                            
                        });
                    }
                };
                $scope.titCaption="Add";
                $scope.btnStatus='Save';
                $scope.addCourse = function() {
                    $scope.refreshdepartment();
                    $scope.clearValidation();
                    $scope.titCaption="Add";
                    $scope.btnStatus='Save';
                    $scope.coursedata={
                        course_id:"",
                        course_name:"",
                        dept_id:"",
                        attendance_type:"",
                        percentage:"",
                        grade_type:""
                    };
                    $('.uk-modal').find('input').trigger('blur');
                };
                $scope.editCourse= function(res){
                    console.log(res,'res');
                    $scope.clearValidation();
                    $scope.titCaption="Edit";
                    $scope.btnStatus='Update';
                    if(res){
                        $scope.coursedata={
                            course_id:res.ID,
                            course_name:res.NAME,
                            dept_id:res.DEPT_ID,
                            attendance_type:res.ATTENDANCE_TYPE,
                            percentage:res.PERCENTAGE,
                            grade_type:res.GARDE_TYPE
                        };
                      
                    }
                }

                // Save Data
                $scope.coursedata={}
            $scope.saveCourse=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'AcademicsAPI/courseDetail',
                data: {
                    'COURSE_ID' : $scope.coursedata.course_id,
                    'COURSE_NAME' : $scope.coursedata.course_name,
                    'COURSE_DEPT_ID' : $scope.coursedata.dept_id,
                    'COURSE_ATTENDANCE_TYPE' : $scope.coursedata.attendance_type,
                    'COURSE_PERCENTAGE' : $scope.coursedata.percentage,
                    'COURSE_GARDE_TYPE' : $scope.coursedata.grade_type
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
                        $scope.refreshTable();
                    }else {
                        // UIkit.notify('Course Name Already Exists','danger');
                        UIkit.modal.alert('Course Name Already Exists');
                    }
                    // var dept=$filter('filter')($scope.deptData,{ID:$scope.dept_id},true);
                    //  if(dept.length == 0){
                    //         var DEPTNAME='';
                    //     }else {
                    //         var DEPTNAME=dept[0].NAME;
                    //     }
                    // if($scope.course_id){
                    //     var data1=$filter('filter')($scope.viewData,{ID:$scope.course_id},true);
                    //     data1[0].NAME=$scope.course_name;
                    //     data1[0].ATTENDANCE_TYPE=$scope.attendance_type;
                    //     data1[0].PERCENTAGE=$scope.percentage;
                    //     data1[0].GARDE_TYPE=$scope.grade_type;
                    //     data1[0].DEPT_ID=$scope.dept_id;
                    //     data1[0].DEPT_NAME=DEPTNAME;
                    // }else{
                    //     $scope.viewData.push({ID:return_data.data.message.COURSE_ID,NAME:$scope.course_name,ATTENDANCE_TYPE:$scope.attendance_type,PERCENTAGE:$scope.percentage,GARDE_TYPE:$scope.grade_type,DEPT_ID:$scope.dept_id,DEPT_NAME:DEPTNAME});
                    // }
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
                                     console.log("false");
                                    $scope.refreshTable();
                                }, {
                                    labels: {
                                        'Ok': 'Ok'
                                    }
                                });
                            }

                        }
                    },function myError(response) {
                        //console.log(response,'errr');
                        UIkit.modal.alert(response.data.message);
                    })
               
            }
            // $scope.deleteCourse=function(id, $index){
            //     if(id){
            //         $http({
            //             method : "DELETE",
            //             url : $localStorage.service+"AcademicsAPI/courseDetail",
            //             params : {id : id},
            //             headers:{'access_token':$localStorage.access_token}
            //         }).then(function mySucces(response) {
            //             UIkit.modal.confirm('Are you sure to delete ?', function(e) {
            //             if(id){
            //                 UIkit.notify({
            //                 message : response.data.message,
            //                 status  : 'success',
            //                 timeout : 2000,
            //                 pos     : 'top-center'
            //             });
            //                 $scope.viewData.splice($index, 1);
            //                 $scope.refreshTable();
            //             }
            //             },function(){
            //                  console.log("false");
            //             }, {
            //                 labels: {
            //                     'Ok': 'Ok'
            //                 }
            //             })

            //         },function myError(response) {
                        
            //             UIkit.modal.alert(response.data.message);

            //         })
                    
            //     }
            // }
        }
    );