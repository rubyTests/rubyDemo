angular
    .module('rubycampusApp')
    .controller('feeCollectionCtrl', [
        '$compile',
        '$scope',
        '$window',
        '$timeout',
        '$resource',
        'DTOptionsBuilder',
        'DTColumnDefBuilder','$localStorage','$http','$filter',
        function ($compile,$scope,$window,$timeout,$resource, DTOptionsBuilder, DTColumnDefBuilder,$localStorage,$http,$filter) {

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
                $scope.courseList=[];
                $http({
                    url: $localStorage.service+'FinanceAPI/fetchCourseDetails',
                    method : 'GET',
                    headers: { 'access_token':$localStorage.access_token},
                }).success(function(response) {
                    console.log(response.message,'batch');
                    $scope.courseList.push(response.message);
                }).error(function(data){
                    console.log('error');
                });

                $scope.course_options =$scope.courseList;
                $scope.course_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Course',
                    valueField: 'COURSE_ID',
                    labelField: 'COUSE_NAME',
                    searchField: 'COUSE_NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            $scope.getBatchList(value);
                            $scope.getStudentFeedetailsbasedonCourse(value);
                        });
                    }
                };
                $scope.getStudentFeedetailsbasedonCourse=function(courseVal){
                    $http({
                        url: $localStorage.service+'FinanceAPI/getStudentFeeList',
                        method : 'GET',
                        params:{'course_id':courseVal},
                        headers: { 'access_token':$localStorage.access_token},
                    }).success(function(response) {
                        console.log(response.message,'stud');
                        $scope.viewTable=response.message;
                    }).error(function(data){
                        console.log('error');
                        $scope.viewTable=[];
                    });
                }
                $scope.getBatchList=function(courseID){
                    $http({
                        url: $localStorage.service+'FinanceAPI/fetchBatchDetails',
                        method : 'GET',
                        params:{
                            'course_id':courseID
                        },
                        headers: { 'access_token':$localStorage.access_token},
                    }).success(function(response) {
                        console.log(response.message,'batch');
                        $scope.batch_options=[];
                        $scope.batch_options1 =[];
                        $scope.batch_options.push(response.message);
                    }).error(function(data){
                        console.log('error');
                        $scope.batch_options=[];
                        $scope.batch_options1 =[];
                    });
                }
                $scope.batch_options =[];
                $scope.batch_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Batch',
                    valueField: 'ID',
                    labelField: 'BATCH_DISPLAY_NAME',
                    searchField: 'BATCH_DISPLAY_NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            if(value){
                                $scope.getStudentdetails(value,'batch');
                                $scope.getStudentFeedetails(value);
                            }
                        });
                    }
                }

                // $scope.studentList=[];
                $scope.getStudentdetails=function(checkId,checkmode){
                    $http({
                        url: $localStorage.service+'FinanceAPI/fetchAssignedStudentList',
                        method : 'GET',
                        params:{'checkId':checkId,'checkmode':checkmode},
                        headers: { 'access_token':$localStorage.access_token},
                    }).success(function(response) {
                        console.log(response.message,'stud');
                        $scope.batch_options1=[];
                        // $timeout(function(){
                            // $scope.batch_options1.push(response.message);
                            $scope.batch_options1=[].concat([response.message]);
                        // },1500);
                        console.log($scope.batch_options1,'$scope.batch_options1');
                    }).error(function(data){
                        console.log('error');
                    });
                }

                $scope.getStudentFeedetails=function(batchID){
                    $http({
                        url: $localStorage.service+'FinanceAPI/getStudentFeeList',
                        method : 'GET',
                        params:{'batch_id':batchID},
                        headers: { 'access_token':$localStorage.access_token},
                    }).success(function(response) {
                        console.log(response.message,'stud');
                        $scope.viewTable=response.message;
                    }).error(function(data){
                        console.log('error');
                    });
                }

                $scope.batch_options1 =[];
                $scope.batch_config1 = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Student',
                    valueField: 'STUDENT_PROFILE_ID',
                    labelField: 'STUDENT_NAME',
                    searchField: 'STUDENT_NAME',
                    render: {
                        option: function(planets_data, escape) {
                            return  '<div class="option">' +
                                '<span class="title">' + escape(planets_data.STUDENT_NAME) + '</span><br>' +
                                '<span class="title Addition uk-text-muted uk-text-small">' + escape(planets_data.ADMISSION_NO) + '</span>' +
                                '</div>';
                        }
                    },
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            console.log(value,'student_id');
                            $scope.getPartucularStudentFeedetails(value);
                        });
                    }
                }
                $scope.getPartucularStudentFeedetails=function(student_id){
                    $http({
                        url: $localStorage.service+'FinanceAPI/getStudentFeeList',
                        method : 'GET',
                        params:{'student_id':student_id},
                        headers: { 'access_token':$localStorage.access_token},
                    }).success(function(response) {
                        console.log(response.message,'stud');
                        $scope.viewTable=response.message;
                    }).error(function(data){
                        console.log('error');
                    });
                }

        }
    ]);