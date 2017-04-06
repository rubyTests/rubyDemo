angular
    .module('rubycampusApp')
    .controller('leaveapplicationCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter) {
            var vm = this;
            vm.apllicationData=[];
            $scope.leaveTypeArray=[];
            $scope.employee_array=[];
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
                        // {
                        //     type: 'text',
                        //     bRegex: true,
                        //     bSmart: true
                        // },
                        // {
                        //     type: 'text',
                        //     bRegex: true,
                        //     bSmart: true
                        // },
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
                $scope.dpdwnTypeOption=[];
                $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/Leavetype.json')
                .query()
                .$promise
                .then(function(leavetype_data) {
                    $scope.leaveTypeArray=leavetype_data;
                    $scope.dpdwnTypeOption.push(leavetype_data);
                });

                $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/leaveapplication.json')
                .query()
                .$promise
                .then(function(application_data) {
                    vm.apllicationData=application_data;
                });
                $scope.dpdwnEmpOption=[];
                $resource('app/components/employeemanagement/employee_list.json')
                .query()
                .$promise
                .then(function(employee_data) {
                    $scope.employee_array=employee_data;
                    $scope.dpdwnEmpOption.push(employee_data);
                });

                $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/LeaveCategory.json')
                .query()
                .$promise
                .then(function(category_data) {
                    angular.forEach(vm.apllicationData, function(value,key){
                        value.leaves_type=getleaveType(value.leave_type_id);
                        value.employee_name=getemployeeDetails(value.emp_id);
                    });
                    function getleaveType(id){
                        var data=$filter('filter')($scope.leaveTypeArray,{id : id},true);
                        if(data[0]) return data[0].Name;
                    }
                    function getemployeeDetails(id){
                        var data1=$filter('filter')($scope.employee_array,{id : id},true);
                        if(data1[0]) return data1[0].firstname+" "+data1[0].lastname ;
                    }
                });

                $scope.selectize_leavetype_options = $scope.dpdwnTypeOption;
                $scope.selectize_leavetype_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Leave Type...',
                    valueField: 'id',
                    labelField: 'Name'
                };
                $scope.selectize_employee_options = $scope.dpdwnEmpOption;
                $scope.selectize_employee_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Employee...',
                    valueField: 'id',
                    labelField: 'firstname'
                };

                $scope.selectize_status_option = ['Approved','Pending','Rejected'];
                $scope.selectize_status_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Status...',
                    valueField: 'id',
                    labelField: 'firstname'
                };

                $scope.status= "Status";

                $scope.changeStatus = function(){
                    var ss = $scope.selectize_status;
                    vm.apllicationData = ss;
                }

                $scope.addleavecategory=function(){
                    $scope.tit_caption="Add";
                    $scope.status="Save";
                    $scope.selectize_employee='';
                    $scope.selectize_leavetype='';
                    $scope.description='';
                    $scope.from_date='';
                    $scope.upto_date='';
                    $scope.total_leave='';
                    $scope.leave_status='';
                    $('.uk-modal').find('input').trigger('blur');
                }
                $scope.editLeaveCategory=function(data){
                  console.log(data,'data');
                    $scope.tit_caption="Edit";
                    $scope.status="update";
                    if (data) {
                        $scope.application_id=data.id;
                        $scope.selectize_employee=data.employee_name;
                        $scope.selectize_leavetype=data.leaves_type;
                        $scope.description=data.description;
                        $scope.from_date=data.from_date;
                        $scope.upto_date=data.upto_date;
                        $scope.total_leave=data.total_leave;
                        $scope.leave_status='Approved';
                    }
                }
        }
    );