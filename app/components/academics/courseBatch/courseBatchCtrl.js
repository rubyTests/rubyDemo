angular
    .module('rubycampusApp')
    .controller('courseBatchCtrl',
       
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage) {
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
                
                var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});

                 $scope.addBatch = function() {
                    $scope.clearValidation();
                    $scope.titCaption="Add";
                    $scope.btnStatus="Save";
                    $scope.batch_id='';
                    $scope.course_id='';
                    $scope.batch_name='';
                    $scope.incharge_id='';
                    $scope.period_from='';
                    $scope.period_to='';
                    $('.uk-modal').find('input').trigger('blur');
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
                .success(function(course_data){
                    $scope.courseData.push(course_data.data);
                });
                $http.get($localStorage.service+'SettingAPI/employeeList',{headers:{'access_token':$localStorage.access_token}})
                .success(function(emp_data){
                    $scope.EmpLIST.push(emp_data.data);
                });

                $scope.selectize_courseId_options =$scope.courseData;
                $scope.selectize_courseId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Course',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
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
                    placeholder: 'Select Batch Incharge',
                    valueField: 'ID',
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
                    // var course=$filter('filter')($scope.courseData,{ID:$scope.course_id},true);
                    // if(course.length == 0){
                    //     var COUSRENAME='';
                    // }else {
                    //     var COUSRENAME=course[0].NAME;
                    // }
                    // var employeeData=$filter('filter')($scope.EmpLIST,{ID:$scope.incharge_id},true);
                    // if(employeeData.length == 0){
                    //     var EMPLOYEENAME='';
                    // }else {
                    //     var EMPLOYEENAME=employeeData[0].EMP_NAME;
                    // }
                    // if($scope.batch_id){
                    //     var data1=$filter('filter')($scope.viewData,{ID:$scope.batch_id},true);
                    //     // console.log(data1,'data1');
                    //     data1[0].NAME=$scope.batch_name;
                    //     data1[0].COURSE_ID=$scope.course_id;
                    //     data1[0].COURSE_NAME=COUSRENAME;
                    //     data1[0].INCHARGE_ID=$scope.incharge_id;
                    //     data1[0].INCHARGE_NAME=EMPLOYEENAME;
                    //     data1[0].PERIOD_FROM=$scope.period_from;
                    //     data1[0].PERIOD_TO=$scope.period_to;
                    // }else{
                    //     $scope.viewData.push({ID:return_data.data.message.BATCH_ID,NAME:$scope.batch_name,COURSE_ID:$scope.course_id,COURSE_NAME:COUSRENAME,INCHARGE_ID:$scope.incharge_id,INCHARGE_NAME:EMPLOYEENAME,PERIOD_FROM:$scope.period_from,PERIOD_TO:$scope.period_to});
                    // }
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
        }
    );