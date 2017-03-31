angular
    .module('altairApp')
    .controller('assignleavecategoryviewCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter) {
            var vm = this;
            vm.itamCatTypeArray = [];
            $scope.leaveTypeArray = [];
            $scope.emplyeeData=[];
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

                $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/LeaveCategory.json')
                .query()
                .$promise
                .then(function(leavecategory_data) {
                    $scope.leaveTypeArray=leavecategory_data;
                });

                 $resource('app/components/employeemanagement/employee_list.json')
                .query()
                .$promise
                .then(function(employee_data) {
                    $scope.emplyeeData=employee_data;
                });

                $scope.addAssignCategory=function(){
                    $scope.tit_caption="Add";
                    $scope.status="Save";
                    $scope.selectize_employee='';
                    $scope.selectize_dept='';
                    $scope.selectize_leaveCat='';
                    $scope.leave_count='';
                    $scope.valid_from='';
                    $('.uk-modal').find('input').trigger('blur');
                }
                $scope.editAssignCategory=function(data){
                  console.log(data,'data');
                    $scope.tit_caption="Edit";
                    $scope.status="update";
                    if (data) {
                        $scope.selectize_employee=data.id;
                        $scope.selectize_dept=data.Dept;
                        $scope.selectize_leaveCat="Principal";
                        $scope.leave_count=4;
                        $scope.valid_from='03.23.2017';
                    }
                }


            $scope.employeeData=[];
            $scope.categoryArray=[];
            $scope.positionData=[];
            $scope.leaveCategory=[];
            $resource('app/components/employeemanagement/employee_list.json')
            .query()
            .$promise
            .then(function(employee_data) {
                $scope.employeeData.push(employee_data);
            });

            $resource('app/components/Hr/configuration/category.json')
            .query()
            .$promise
            .then(function(category_data) {
                $scope.categoryArray.push(category_data);
            });

            $resource('app/components/Hr/configuration/position.json')
            .query()
            .$promise
            .then(function(position_data) {
                $scope.positionData.push(position_data);
            });

            $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/LeaveCategory.json')
            .query()
            .$promise
            .then(function(leaveCategory_data) {
                $scope.leaveCategory.push(leaveCategory_data);
            });

            $scope.selectize_employee_option = $scope.employeeData;
            $scope.selectize_employee_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Employee',
                valueField: 'id',
                labelField: 'firstname',
                onInitialize: function(selectize){
                    selectize.on('change', function() {
                        console.log('on "change" event fired');
                    });
                }
            };

            // $scope.selectize_position_option = $scope.positionData;
            // $scope.selectize_position_config = {
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Select Position...',
            //     valueField: 'id',
            //     labelField: 'name',
            //     onInitialize: function(selectize){
            //         selectize.on('change', function() {
            //             console.log('on "change" event fired');
            //         });
            //     }
            // };

            $scope.selectize_dept_option = $scope.employeeData;
            $scope.selectize_dept_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department',
                valueField: 'id',
                labelField: 'Dept',
                onInitialize: function(selectize){
                    selectize.on('change', function() {
                        console.log('on "change" event fired');
                    });
                }
            };

            $scope.selectize_leaveCat_option = $scope.leaveCategory;
            $scope.selectize_leaveCat_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Leave Category',
                valueField: 'id',
                labelField: 'Name',
                onInitialize: function(selectize){
                    selectize.on('change', function() {
                        console.log('on "change" event fired');
                    });
                }
            };

            $scope.select_option="employee";
        }
    );