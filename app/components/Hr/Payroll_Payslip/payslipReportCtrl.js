angular
    .module('altairApp')
    .controller('payslipReportCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$filter',
        'DTOptionsBuilder', 
        'DTColumnDefBuilder',
        '$compile',
        '$location',
        function ($scope,$rootScope,$timeout,$resource,$filter,DTOptionsBuilder, DTColumnDefBuilder,$compile,$location) {
            $scope.deptArray=[];
            $scope.tableArray=[];
            var path=$location.path().split( '/' );
            $scope.urlname=path[1];
            $resource('app/components/employeemanagement/employee_list.json')
                .query()
                .$promise
                .then(function(return_data) {
                    $scope.tableArray=return_data;
                });
            $scope.selectize_dept_data =['Computer Science And Engineering','Electronic Communication Engineering','Materials Science engineering','Electrical and Electronics Engineering'];
            $scope.selectize_dept_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department...',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        if(value){
                            var deptReturn_Data=$filter('filter')($scope.tableArray, {Dept : value});
                            // $scope.tableView_data = deptReturn_Data;
                            // $('#page_content_inner').trigger('click');
                        }
                    });
                }
            };

            var vm = this;
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

                 $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/PayStructure.json')
                .query()
                .$promise
                .then(function(return_paydata) {
                    $scope.return_paydata=return_paydata;
                });

                $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/PayItemStructure.json')
                .query()
                .$promise
                .then(function(payitemstruc_data) {
                    $scope.payitemstruc_data=payitemstruc_data;
                }); 

                 $scope.getPayslipdetail=function(){
                    // console.log($scope.selectize_dept,$scope.from_date,$scope.upto_date,'ddddddddd');
                    // if($scope.selectize_dept && $scope.from_date && $scope.upto_date) {
                        
                    // }else {
                    //     $scope.tableArray='';
                    // }
                    var deptReturn_Data=$filter('filter')($scope.tableArray, {Dept : $scope.selectize_dept});
                        $scope.tableView_data = deptReturn_Data;
                        angular.forEach($scope.tableView_data, function(value,key){
                            value.pay_amount=getAmount(value.payitem_id);
                            value.pay_freq=getFrequency(value.payitem_id);
                        });
                        function getAmount(id){
                            var data=$filter('filter')($scope.payitemstruc_data,{id : id}, true);
                            if(data[0]) return data[0].Amount;
                        }
                        function getFrequency(id){
                            var data_val=$filter('filter')($scope.payitemstruc_data,{ id : id}, true);
                            // console.log(data_val,"data_val");
                            if(data_val[0]) return getdatafrompaystructure(data_val[0].PayStructure_id);
                        }
                        function getdatafrompaystructure(id){
                            var data1=$filter('filter')($scope.return_paydata,{ id : id}, true);
                            if(data1[0]) return data1[0].Frequency;
                        }
                }
        }
    ]);
// .filter("myfilter", function() {
//   return function(items, from, to) {
//         var df = parseDate(from);
//         var dt = parseDate(to);
//         var arrayToReturn = [];        
//         console.log(items)
//         for (var i=0; i<items.length; i++){
//             var tf = new Date(items[i].date1 * 1000),
//                 tt = new Date(items[i].date2 * 1000);
//             if (tf > df && tt < dt)  {
//                 arrayToReturn.push(items[i]);
//             }
//         }
        
//         return arrayToReturn;
//   };
// });
// function parseDate(input) {
//   var parts = input.split('.');
//   // Note: months are 0-based
//   return new Date(parts[2], parts[0], parts[1]-1); 
// }