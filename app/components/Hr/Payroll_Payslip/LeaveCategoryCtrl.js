// angular
//     .module('altairApp')
//     .controller('LeaveCategoryCtrl',
//         function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter) {
//             var vm = this;
//             vm.itamCatTypeArray = [];
//             $scope.leaveTypeArray = [];
//             $scope.leaveCategoryArray=[];
//             vm.dtOptions = DTOptionsBuilder
//                 .newOptions()
//                 .withDOM("<'dt-uikit-header'<'uk-grid'<'uk-width-medium-2-3'l><'uk-width-medium-1-3'f>>>" +
//                     "<'uk-overflow-container'tr>" +
//                     "<'dt-uikit-footer'<'uk-grid'<'uk-width-medium-3-10'i><'uk-width-medium-7-10'p>>>")
//                 .withOption('createdRow', function(row, data, dataIndex) {
//                     // Recompiling so we can bind Angular directive to the DT
//                     $compile(angular.element(row).contents())($scope);
//                 })
//                 .withOption('headerCallback', function(header) {
//                     if (!vm.headerCompiled) {
//                         // Use this headerCompiled field to only compile header once
//                         vm.headerCompiled = true;
//                         $compile(angular.element(header).contents())($scope);
//                     }
//                 })
//                 .withPaginationType('full_numbers')
//                 // Active Buttons extension
//                 .withColumnFilter({
//                     aoColumns: [
//                         {
//                             type: 'number',
//                             bRegex: true,
//                             bSmart: true
//                         },
//                         {
//                             type: 'text',
//                             bRegex: true,
//                             bSmart: true
//                         },
//                         {
//                             type: 'text',
//                             bRegex: true,
//                             bSmart: true
//                         },
//                         {
//                             type: 'text',
//                             bRegex: true,
//                             bSmart: true
//                         }
//                     ]
//                 })
//                 .withButtons([
//                     {
//                         extend:    'print',
//                         text:      '<i class="uk-icon-print"></i> Print',
//                         titleAttr: 'Print'
//                     },
//                     {
//                         extend:    'excelHtml5',
//                         text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
//                         titleAttr: ''
//                     },
//                     {
//                         extend:    'pdfHtml5',
//                         text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
//                         titleAttr: 'PDF'
//                     }
//                 ])
//                  .withOption('initComplete', function() {
//                     $timeout(function() {
//                         $compile($('.dt-uikit .md-input'))($scope);
//                     })
//                 });
//             $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/Leavetype.json')
//                 .query()
//                 .$promise
//                 .then(function(leavetype_data) {
//                     $scope.leaveTypeArray.push(leavetype_data);
//                 });

//                 $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/LeaveCategory.json')
//                 .query()
//                 .$promise
//                 .then(function(leavecategory_data) {
//                     $scope.leaveCategoryArray.push(leavecategory_data);
//                 });

//                 $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/LeaveTypeCategory.json')
//                 .query()
//                 .$promise
//                 .then(function(leaveitemcat_data) {
//                     vm.itamCatTypeArray=leaveitemcat_data;
//                     angular.forEach(vm.itamCatTypeArray, function(value,key){
//                         value.leave_type=getleaveType(value.LeaveType_id);
//                         value.leave_category=getLeaveCategory(value.LeaveCategory_id);
//                         // console.log(value.leave_type,'leave_type');
//                         // console.log(value.leave_category,'leave_category');
//                     });
//                     function getleaveType(id){
//                         var data=$filter('filter')($scope.leaveTypeArray,{ id : id},true);
//                         if(data[0]) return data[0].Name;
//                     }
//                     function getLeaveCategory(id){
//                         var data1=$filter('filter')($scope.leaveCategoryArray,{ id : id},true);
//                         if(data1[0]) return data1[0].Name;
//                     }
//                 });

                

//                 $scope.selectize_category_options = $scope.leaveCategoryArray;
//                 $scope.selectize_category_config = {
//                     create: false,
//                     maxItems: 1,
//                     placeholder: 'Select Category...',
//                     valueField: 'id',
//                     labelField: 'Name',
//                     onInitialize: function(selectize){
                        
//                     }
//                 };

//                 $scope.selectize_leavetype_options = $scope.leaveTypeArray;
//                 $scope.selectize_leavetype_config = {
//                     create: false,
//                     maxItems: 1,
//                     placeholder: 'Select Leave Type...',
//                     valueField: 'id',
//                     labelField: 'Name',
//                     onInitialize: function(selectize){
                        
//                     }
//                 };

//                 $scope.addleavecategory=function(){
//                     $scope.tit_caption="Add";
//                     $scope.status="Save";
//                     $scope.selectize_leavetype='';
//                     $scope.selectize_category='';
//                     $scope.leave_count='';
//                     $('.uk-modal').find('input').trigger('blur');
//                 }
//                 $scope.editLeaveCategory=function(data){
//                   console.log(data,'data');
//                     $scope.tit_caption="Edit";
//                     $scope.status="update";
//                     if (data) {
//                         $scope.leavetype_id=data.id;
//                         $scope.selectize_leavetype=data.leave_type;
//                         $scope.selectize_category=data.leave_category;
//                         $scope.leave_count=data.LeaveTypeCount;
//                     }
//                 }
//         }
//     );


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