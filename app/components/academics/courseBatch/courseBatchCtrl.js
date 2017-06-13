angular
    .module('rubycampusApp')
    .controller('courseBatchCtrl',
       
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

                
                var modal = UIkit.modal("#batch_modal",{bgclose: false, keyboard:false});

                 $scope.addBatch = function() {
                    $scope.clearValidation();
                    $scope.titCaption="Add";
                    $scope.btnStatus="Save";
                     $scope.batchdata={
                            batch_id:"",
                            course_id:"",
                            batch_name:"",
                            period_from:"",
                            period_to:"",
                            incharge_id:""
                        };
                    $('.uk-modal').find('input').trigger('blur');
                };
                $scope.editBatch= function(res){
                    $scope.clearValidation();
                    $scope.titCaption="Edit";
                    $scope.btnStatus="Update";
                    if(res){
                        $scope.batchdata={
                            batch_id:res.ID,
                            course_id:res.COURSE_ID,
                            batch_name:res.NAME,
                            period_from:res.PERIOD_FROM,
                            period_to:res.PERIOD_TO,
                            incharge_id:res.empData[0].ID
                        };
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
                $scope.setCourseId=function(cor_data){
                    if (cor_data.status==false) {
                       $scope.courseData.push([{ID:0, NAME:"Add Course"}]);
                    }else{
                        $scope.courseData.push(cor_data.data);
                        $scope.courseData.push([{ID:0, NAME:"Add Course"}]);
                    }
                }
                $scope.refreshcourse=function(){
                    $scope.courseData=[];
                    $http.get($localStorage.service+'AcademicsAPI/fetchCourseData',{headers:{'access_token':$localStorage.access_token}})
                    .success(function(cor_data){
                        console.log(cor_data,'cor_data');
                        $scope.setCourseId(cor_data);
                    }).error(function(cor_data){
                        $scope.setCourseId(cor_data);
                    })
                };
                $scope.refreshcourse();

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
                                UIkit.modal("#course_modal").show();
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

                $scope.batchdata ={};
                $scope.saveCourseBatch=function(){
                    $http({
                        method:'POST',
                        url: $localStorage.service+'AcademicsAPI/batchDetail',
                        data: {
                            'batch_id' : $scope.batchdata.batch_id,
                            'course_id' : $scope.batchdata.course_id,
                            'batch_name' :$scope.batchdata.batch_name,
                            'incharge' : $scope.batchdata.incharge_id,
                            'period_from' : $scope.batchdata.period_from,
                            'period_to' : $scope.batchdata.period_to
                        },
                        headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                    console.log(return_data.data.message.message);
                    if(return_data.data.message.status==true){
                        UIkit.modal("#batch_modal").hide();
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