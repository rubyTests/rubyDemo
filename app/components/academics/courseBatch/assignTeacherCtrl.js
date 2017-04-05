angular
    .module('altairApp')
    .controller('assignTeacherCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter) {
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
                // .withButtons([
                //     {
                //         extend:    'copyHtml5',
                //         text:      '<i class="uk-icon-files-o"></i> Copy',
                //         titleAttr: 'Copy'
                //     },
                //     {
                //         extend:    'print',
                //         text:      '<i class="uk-icon-print"></i> Print',
                //         titleAttr: 'Print'
                //     },
                //     {
                //         extend:    'excelHtml5',
                //         text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
                //         titleAttr: ''
                //     },
                //     {
                //         extend:    'csvHtml5',
                //         text:      '<i class="uk-icon-file-text-o"></i> CSV',
                //         titleAttr: 'CSV'
                //     },
                //     {
                //         extend:    'pdfHtml5',
                //         text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
                //         titleAttr: 'PDF'
                //     }
                // ]);
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('S.No'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Course'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Batch '),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Department'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Employee Name'),
            ];
           
            //     .newOptions()
            //     // .withDisplayLength(10)
            //     // .withColumnFilter({
            //     //     aoColumns: [
            //     //         {
            //     //             type: 'text',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'text',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'text',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'number',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'number',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'number',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         }
            //     //     ]
            //     // })
            //     .withButtons([
            //         {
            //             extend:    'copyHtml5',
            //             text:      '<i class="uk-icon-files-o"></i> Copy',
            //             titleAttr: 'Copy'
            //         },
            //         {
            //             extend:    'print',
            //             text:      '<i class="uk-icon-print"></i> Print',
            //             titleAttr: 'Print'
            //         },
            //         {
            //             extend:    'excelHtml5',
            //             text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
            //             titleAttr: ''
            //         },
            //         {
            //             extend:    'csvHtml5',
            //             text:      '<i class="uk-icon-file-text-o"></i> CSV',
            //             titleAttr: 'CSV'
            //         },
            //         {
            //             extend:    'pdfHtml5',
            //             text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
            //             titleAttr: 'PDF'
            //         }
            //     ])
            //     .withOption('initComplete', function() {
            //         $timeout(function() {
            //             $compile($('.dt-uikit .md-input'))($scope);
            //         })
            //     });
            // vm.dtColumnDefs = [
            //     DTColumnDefBuilder.newColumnDef(0),
            //     DTColumnDefBuilder.newColumnDef(1),
            //     DTColumnDefBuilder.newColumnDef(2),
            //     DTColumnDefBuilder.newColumnDef(3),
            //     DTColumnDefBuilder.newColumnDef(4),
            //     DTColumnDefBuilder.newColumnDef(5)
            // ];

            var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
            
             $scope.get_name = [];
             $resource('app/components/academics/courseBatch/course.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.get_data = [];
                    $scope.get_data =  dt_data;
                     angular.forEach($scope.get_data, function(value, key){
                        $scope.name=  value.course_name;
                        $scope.get_name.push($scope.name);
                    });
                });
                 $scope.dept_name = [];
                $resource('app/components/academics/courseBatch/department.json')
                    .query()
                    .$promise
                    .then(function(dt_data) {
                        $scope.dept_data = [];
                        $scope.dept_data =  dt_data;
                         angular.forEach($scope.dept_data, function(value, key){
                            $scope.name=  value.dept_name;
                            $scope.dept_name.push($scope.name);
                        });
                    });
                $scope.emp_name = [];
                $resource('app/components/academics/courseBatch/employee.json')
                    .query()
                    .$promise
                    .then(function(dt_data) {
                        $scope.emp_data = [];
                        $scope.emp_data =  dt_data;
                         angular.forEach($scope.emp_data, function(value, key){
                            $scope.name=  value.employee_name;
                            $scope.emp_name.push($scope.name);
                        });
                    });
                //$scope.course_name = [];
                $scope.batch_name = [];
                $resource('app/components/academics/courseBatch/courseBatch.json')
                    .query()
                    .$promise
                    .then(function(dt_data) {
                        vm.dt_data =  dt_data;
                        // angular.forEach(vm.dt_data, function(value, key){
                        //     $scope.courseName=  value.course_name;
                        //     $scope.course_name.push($scope.courseName);
                        // });
                        angular.forEach(vm.dt_data, function(value, key){
                            $scope.batchName=  value.cBatch_name;
                            $scope.batch_name.push($scope.batchName);
                        });
                        angular.forEach(vm.dt_data, function(value, key){
                            value.courseName=$scope.courseName(value.id);
                        });
                        angular.forEach(vm.dt_data, function(value, key){
                            value.employeeName=$scope.employeeName(value.id);
                        });
                        angular.forEach(vm.dt_data, function(value, key){
                            value.departmentName=$scope.departmentName(value.id);
                        });
                    });
                    $scope.courseName = function(id){
                        var getName=$filter('filter')($scope.get_data,{id : id },true);
                        if (getName[0]) return getName[0].course_name;
                    }
                    $scope.employeeName = function(id){
                        var getName=$filter('filter')($scope.emp_data,{id : id },true);
                        if (getName[0]) return getName[0].employee_name;
                    }
                    $scope.departmentName = function(id){
                        var getName=$filter('filter')($scope.dept_data,{id : id },true);
                        if (getName[0]) return getName[0].dept_name;
                    }


                $scope.selectize_deptId_options = $scope.dept_name;
                $scope.selectize_deptId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Employee Department'
                };
                $scope.selectize_empName_options =  $scope.emp_name;
                $scope.selectize_empName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Assign Class Teacher'
                };
                $scope.selectize_courseName_options = $scope.get_name;
                $scope.selectize_courseName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Course Name'
                };
                $scope.selectize_batchName_options = $scope.batch_name;
                $scope.selectize_batchName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Batch Name'
                };
                $scope.openModel = function() {
                    $scope.Savebutton=true;
                    $scope.Updatebutton=false;
                    $scope.selectize_courseName=null;
                    $scope.selectize_batchName=null;
                    $scope.selectize_deptId=null;
                    $scope.selectize_empName=null;
                    $('.uk-modal').find('input').trigger('blur');
                };
                $scope.edit_data= function(res){
                    if (typeof res=="undefined") return false;
                    //console.log(res,"resres");
                    $scope.Updatebutton=true;
                    $scope.Savebutton=false;
                    $scope.selectize_courseName=res.courseName;
                    $scope.selectize_batchName=res.cBatch_name;
                    $scope.selectize_deptId=res.departmentName;
                    $scope.selectize_empName=res.employeeName;
                    $scope.id=vm.dt_data.indexOf(res);
                }




        }
    );