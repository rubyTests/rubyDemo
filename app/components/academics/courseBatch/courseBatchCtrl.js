angular
    .module('altairApp')
    .controller('courseBatchCtrl',
       
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage) {
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
                        }
                    ]
                })
                 .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });
                
                 $scope.addBatch = function() {
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
                    $scope.titCaption="Edit";
                    $scope.btnStatus="Update";
                    if(res){
                      $scope.batch_id=res.ID;
                        $scope.course_id=res.COURSE_ID;
                        $scope.batch_name=res.NAME;
                        $scope.incharge_id=res.INCHARGE_ID;
                        $scope.period_from=res.PERIOD_FROM;
                        $scope.period_to=res.PERIOD_TO;  
                    }                    
                }

                $scope.courseData=[];
                $scope.viewData=[];
                $scope.EmpLIST=[];
                $http.get($localStorage.service+'AcademicsAPI/batchDetail',headers:{'access_token':$localStorage.access_token})
                .success(function(batch_data){
                    $scope.viewData=batch_data.message;
                });

                $http.get($localStorage.service+'AcademicsAPI/fetchCourseData',headers:{'access_token':$localStorage.access_token})
                .success(function(course_data){
                    $scope.courseData.push(course_data.data);
                });
                $http.get($localStorage.service+'AcademicsAPI/profile',headers:{'access_token':$localStorage.access_token})
                .success(function(emp_data){
                    $scope.EmpLIST.push(emp_data.message);
                });

                $scope.selectize_courseId_options =$scope.courseData;
                $scope.selectize_courseId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Course',
                    valueField: 'ID',
                    labelField: 'NAME',
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
                    placeholder: 'Select Incharge',
                    valueField: 'ID',
                    labelField: 'EMP_NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            console.log(value);
                        });
                    }
                };


                $scope.saveCourse=function(){
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
                    var course=$filter('filter')($scope.courseData,{ID:$scope.course_id},true);
                    var employeeData=$filter('filter')($scope.EmpLIST,{ID:$scope.incharge_id},true);
                    // console.log(employeeData[0].EMP_NAME,'employeeData');
                    if($scope.batch_id){
                        var data1=$filter('filter')($scope.viewData,{ID:$scope.batch_id},true);
                        // console.log(data1,'data1');
                        data1[0].NAME=$scope.batch_name;
                        data1[0].COURSE_ID=$scope.course_id;
                        data1[0].COURSE_NAME=course[0].NAME;
                        data1[0].INCHARGE_ID=$scope.incharge_id;
                        data1[0].INCHARGE_NAME=employeeData[0].EMP_NAME;
                        data1[0].PERIOD_FROM=$scope.period_from;
                        data1[0].PERIOD_TO=$scope.period_to;
                    }else{
                        $scope.viewData.push({ID:return_data.data.message.BATCH_ID,NAME:$scope.batch_name,COURSE_ID:$scope.course_id,COURSE_NAME:course[0].NAME,INCHARGE_ID:$scope.incharge_id,INCHARGE_NAME:employeeData[0].EMP_NAME,PERIOD_FROM:$scope.period_from,PERIOD_TO:$scope.period_to});
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
                                var data=response.data.message.message;
                                $scope.viewData.splice($index, 1);
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