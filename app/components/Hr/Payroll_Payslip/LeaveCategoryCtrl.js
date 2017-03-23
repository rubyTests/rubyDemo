angular
    .module('altairApp')
    .controller('LeaveCategoryCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter) {
            var vm = this;
            vm.itamCatTypeArray = [];
            $scope.leaveTypeArray = [];
            $scope.leaveCategoryArray=[];
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
                        {
                            type: 'number',
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
                $scope.addleavecategory=function(){
                    $scope.tit_caption="Add";
                    $scope.status="Save";
                    $scope.leave_category='';
                    $scope.leave_code='';
                    $scope.leave_count='';
                    $scope.valid_from='';
                    $('.uk-modal').find('input').trigger('blur');
                }
                $scope.editLeaveCategory=function(data){
                  console.log(data,'data');
                    $scope.tit_caption="Edit";
                    $scope.status="update";
                    if (data) {
                        $scope.leavecat_id=data.id;
                        $scope.leave_category=data.Name;
                        $scope.leave_code=data.code;
                        $scope.leave_count=data.count;
                        $scope.valid_from=data.valid_from;
                    }
                }
        }
    );