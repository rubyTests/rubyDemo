angular
    .module('altairApp')
    .controller('assignTeacherCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter,$http,$rootScope,$localStorage) {
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
                
                $scope.courseData=[];
                $scope.deptData=[];
                $scope.empList=[];
                $scope.subjectList=[];
                $http.get('http://localhost/smartedu/test/AcademicsAPI/fetchCourseData')
                .success(function(course_data){
                    $scope.courseData.push(course_data.data);
                });
                $http.get('http://localhost/smartedu/test/AcademicsAPI/departmentlist')
                .success(function(dept_data){
                    $scope.deptData.push(dept_data.message);
                });
                $http.get('http://localhost/smartedu/test/AcademicsAPI/profile')
                .success(function(return_data){
                    $scope.empList.push(return_data.message);
                });
                $http.get('http://localhost/smartedu/test/AcademicsAPI/fetchSubjectData')
                .success(function(subject_data){
                    $scope.subjectList.push(subject_data.data);
                });

                $scope.selectize_deptId_options = $scope.deptData;
                $scope.selectize_deptId_config = {
                   create: false,
                    maxItems: 1,
                    placeholder: 'Select Department',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            // console.log(value);
                        });
                    }
                };
                $scope.selectize_subject_options = $scope.subjectList;
                $scope.selectize_subject_config = {
                   create: false,
                    maxItems: 1,
                    placeholder: 'Select Subject',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            // console.log(value);
                        });
                    }
                };
                $scope.selectize_empName_options =  $scope.empList;
                $scope.selectize_empName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Employee',
                    valueField: 'ID',
                    labelField: 'EMP_NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            // console.log(value);
                        });
                    }
                };
                $scope.selectize_courseName_options = $scope.courseData;
                $scope.selectize_courseName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Course',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            // console.log(value);
                        });
                    }
                };
                // $scope.selectize_batchName_options = $scope.courseData;
                // $scope.selectize_batchName_config = {
                //      create: false,
                //     maxItems: 1,
                //     placeholder: 'Select Batch',
                //     valueField: 'ID',
                //     labelField: 'NAME',
                //     onInitialize: function(selectize){
                //         selectize.on('change', function(value) {
                //             // console.log(value);
                //         });
                //     }
                // };
                $scope.openModel = function() {
                    $scope.btnStatus="Save";
                    $scope.selectize_courseName=null;
                    $scope.selectize_batchName=null;
                    $scope.selectize_deptId=null;
                    $scope.selectize_empName=null;
                    $scope.subject_id=null;
                    $('.uk-modal').find('input').trigger('blur');
                };
                $scope.edit_data= function(res){
                    $scope.btnStatus="Update";
                    $scope.selectize_courseName=res.courseName;
                    $scope.selectize_batchName=res.cBatch_name;
                    $scope.selectize_deptId=res.departmentName;
                    $scope.selectize_empName=res.employeeName;
                    $scope.subject_id=res.courseName;
                }
                $scope.saveAssignteacher=function(){
                    console.log($scope.selectize_courseName,'test');
                }

                $http({
                    method:'POST',
                    url: 'http://localhost/smartedu/test/AcademicsAPI/assignTeacher',
                    data: {
                        'selectize_courseName' :$scope.selectize_courseName,
                        'selectize_batchName' :$scope.selectize_batchName,
                        'subject_id' :$scope.subject_id,
                        'selectize_deptId' :$scope.selectize_deptId,
                        'selectize_empName' :$scope.selectize_empName,
                    },
                    // headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_data');
                });
        }
    );