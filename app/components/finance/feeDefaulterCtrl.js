angular
    .module('rubycampusApp')
    .controller('feeDefaulterCtrl', [
        '$compile',
        '$scope',
        '$window',
        '$timeout',
        '$resource',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        '$http',
        '$localStorage',
        function ($compile,$scope,$window,$timeout,$resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$localStorage) {

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

            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('Sl.No'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Admission Number'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Course'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Batch'),
                DTColumnDefBuilder.newColumnDef(5).withTitle('Fee Due')
            ];
            
            $scope.courseList=[];
            $http.get($localStorage.service+'FinanceAPI/fetchCourse',{headers:{'access_token':$localStorage.access_token}})
            .success(function(course_data){
                console.log(course_data,'course_data');
                $scope.courseList.push(course_data.message)
            });

            $scope.selectize_courseNew_options = $scope.courseList;
            $scope.selectize_courseNew_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Course',
                valueField: 'COURSE_ID',
                labelField: 'COURSE_NAME',
                searchField: 'COURSE_NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        if(value){
                            $scope.getStudentdetails(value,'course');
                            $scope.getStudentFeedetails(value);
                            $scope.getBatchList(value);
                        }else {
                            $scope.selectize_planets_options=[];
                            $scope.selectize_batch_options=[];
                            $scope.viewTable=[];
                        }
                    });
                }
            };

            $scope.getStudentFeedetails=function(courseVal){
                $http({
                    url: $localStorage.service+'FinanceAPI/fetchFeeDefaulterDetails',
                    method : 'GET',
                    params:{'course_id':courseVal},
                    headers: { 'access_token':$localStorage.access_token},
                }).success(function(response) {
                    console.log(response.message,'stud');
                    $scope.viewTable=response.message;
                }).error(function(data){
                    console.log('error');
                });
            }

            $scope.studentList=[];
            $scope.getStudentdetails=function(checkID,checkmode){
                $http({
                    url: $localStorage.service+'FinanceAPI/fetchAssignedStudentList',
                    method : 'GET',
                    params:{'checkId':checkID,'checkmode':checkmode},
                    headers: { 'access_token':$localStorage.access_token},
                }).success(function(response) {
                    $scope.selectize_planets_options=[].concat([response.message]);
                }).error(function(data){
                    console.log('error');
                });
            }

            $scope.batchList=[];
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
                    if(response.status==true){
                        // $scope.batchList.push(response.message);
                        $scope.selectize_batch_options=[].concat([response.message]);
                    }else {
                        $scope.selectize_batch_options=[];
                    }
                }).error(function(data){
                    console.log('error');
                });
            }


            $scope.selectize_batch_options = [];
            $scope.selectize_batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Batch',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        if(value){
                            $scope.getStudentdetails(value,'batch');
                            $scope.getStudentFeedetails_batch(value);
                        }
                    });
                }
            };

            $scope.getStudentFeedetails_batch=function(batchID){
                 $http({
                    url: $localStorage.service+'FinanceAPI/fetchFeeDefaulterDetails',
                    method : 'GET',
                    params:{'batch_id':batchID},
                    headers: { 'access_token':$localStorage.access_token},
                }).success(function(response) {
                    $scope.viewTable=response.message;
                }).error(function(data){
                    console.log('error');
                });
            }
            
            // var planets_data = $scope.selectize_planets_options = $scope.studentList;
            var planets_data = $scope.selectize_planets_options = [];

            $scope.selectize_planets_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                maxItems: 1,
                valueField: 'STUDENT_PROFILE_ID',
                labelField: 'STUDENT_NAME',
                searchField: 'STUDENT_NAME',
                create: false,
                placeholder: 'Student Name / Admission No',
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
                        $scope.getPartucularStudentFeedetails(value);
                    });
                }
            };

            $scope.getPartucularStudentFeedetails=function(student_id){
                $http({
                    url: $localStorage.service+'FinanceAPI/fetchFeeDefaulterDetails',
                    method : 'GET',
                    params:{'student_id':student_id},
                    headers: { 'access_token':$localStorage.access_token},
                }).success(function(response) {
                    $scope.viewTable=response.message;
                }).error(function(data){
                    console.log('error');
                });
            }
        }
    ]);

// fetchFeeDefaulterDetails