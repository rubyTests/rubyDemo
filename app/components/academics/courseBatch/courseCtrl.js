angular
    .module('rubycampusApp')
    .controller('courseCtrl',
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
                $http.get($localStorage.service+'AcademicsAPI/courseDetail',{headers:{'access_token':$localStorage.access_token}})
                .success(function(course_data){
                    $scope.viewData=course_data.message;
                });

                $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
                .success(function(dept_data){
                    $scope.deptData.push(dept_data.message);
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
                    placeholder: 'Select Type'
                };

                $scope.selectize_deptId_options =$scope.deptData;
                $scope.selectize_deptId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Department',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            console.log(value);
                        });
                    }
                };
                $scope.titCaption="Add";
                $scope.btnStatus='Save';
                $scope.addCourse = function() {
                    $scope.titCaption="Add";
                    $scope.btnStatus='Save';
                    $scope.course_id='';
                    $scope.course_name='';
                    $scope.dept_id='';
                    $scope.attendance_type='';
                    $scope.percentage='';
                    $scope.grade_type='';
                    $('.uk-modal').find('input').trigger('blur');
                };
                $scope.editCourse= function(res){
                    $scope.titCaption="Edit";
                    $scope.btnStatus='Update';
                    if(res){
                        $scope.course_id=res.ID;
                        $scope.course_name=res.NAME;
                        $scope.dept_id=res.DEPT_ID;
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
                    'COURSE_DEPT_ID' : $scope.dept_id,
                    'COURSE_ATTENDANCE_TYPE' : $scope.attendance_type,
                    'COURSE_PERCENTAGE' : $scope.percentage,
                    'COURSE_GARDE_TYPE' : $scope.grade_type
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.message.message);
                    var dept=$filter('filter')($scope.deptData,{ID:$scope.dept_id},true);
                    if($scope.course_id){
                        var data1=$filter('filter')($scope.viewData,{ID:$scope.course_id},true);
                        data1[0].NAME=$scope.course_name;
                        data1[0].ATTENDANCE_TYPE=$scope.attendance_type;
                        data1[0].PERCENTAGE=$scope.percentage;
                        data1[0].GARDE_TYPE=$scope.grade_type;
                        data1[0].DEPT_ID=$scope.dept_id;
                        data1[0].DEPT_NAME=dept[0].NAME;
                    }else{
                        $scope.viewData.push({ID:return_data.data.message.COURSE_ID,NAME:$scope.course_name,ATTENDANCE_TYPE:$scope.attendance_type,PERCENTAGE:$scope.percentage,GARDE_TYPE:$scope.grade_type,DEPT_ID:$scope.dept_id,DEPT_NAME:dept[0].NAME});
                    }
                });
            }

            $scope.deleteCourse=function(id,$index){
                    if(id){
                        UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                            if(id){
                                $http({
                                method : "DELETE",
                                url : $localStorage.service+"AcademicsAPI/courseDetail",
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