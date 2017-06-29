angular
    .module('rubycampusApp')
    .controller('reportViewCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$filter',
        'DTOptionsBuilder', 
        'DTColumnDefBuilder',
        '$compile',
        '$location',
        '$http',
        '$localStorage',
        function ($scope,$rootScope,$timeout,$resource,$filter,DTOptionsBuilder, DTColumnDefBuilder,$compile,$location,$http,$localStorage) {
            $scope.deptArray=[];
            $scope.tableArray=[];
            
            var path=$location.path().split( '/' );
            $scope.urlname=path[1];
            // $resource('app/components/employeemanagement/employee_list.json')
            //     .query()
            //     .$promise
            //     .then(function(return_data) {
            //         $scope.tableArray=return_data;
            //     });


            
            // $http.get($localStorage.service+'inventoryApi/purchaseOrder',{headers:{'access_token':$localStorage.access_token}})
            // .success(function(dept_data){
            //     $scope.purchaseData = dept_data;
            // });

            
            // $http.get($localStorage.service+'inventoryApi/GRN',{headers:{'access_token':$localStorage.access_token}})
            // .success(function(dept_data){
            //     $scope.grnData = dept_data;
            // });

            // $resource('app/components/inventory/materialRequest.json')
            //     .query()
            //     .$promise
            //     .then(function(return_data) {
            //         $scope.materialData=return_data;
            //     });
            // $resource('app/components/inventory/purchaseOrder.json')
            //     .query()
            //     .$promise
            //     .then(function(return_data) {
            //         $scope.purchaseData=return_data;
            //     });
            // $resource('app/components/inventory/grn.json')
            //     .query()
            //     .$promise
            //     .then(function(return_data) {
            //         $scope.grnData=return_data;
            //     });

            // $scope.selectize_category_options = ["Material request", "Purchase Order", "GRN"];
            // $scope.selectize_category_config = {
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Select Category'
            // };

            $scope.selectize_category_options =["Material Request", "Purchase Order", "GRN"];
            $scope.selectize_category_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Category',
                onInitialize: function(selectize){
                    // selectize.on('change', function(value) {
                    //     if(value == 'Material request'){
                    //         var deptReturn_Data = $scope.materialData;
                    //     } else if(value == 'Purchase Order'){
                    //         var deptReturn_Data = $scope.purchaseData;
                    //     } else if(value == 'GRN'){
                    //         var deptReturn_Data = $scope.grnData;
                    //     }
                    // });
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

                //  $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/PayStructure.json')
                // .query()
                // .$promise
                // .then(function(return_paydata) {
                //     $scope.return_paydata=return_paydata;
                // });

                // $resource('app/components/Hr/Payroll_Payslip/Payroll_temData/PayItemStructure.json')
                // .query()
                // .$promise
                // .then(function(payitemstruc_data) {
                //     $scope.payitemstruc_data=payitemstruc_data;
                // }); 

                $scope.materialData = [];
                $scope.purchaseData = [];
                $scope.grnData = [];

                $scope.getPayslipdetail=function(value){

                    if(value.selectize_category == 'Material Request'){
                        $http({
                            method:'GET',
                            url: $localStorage.service+'inventoryApi/materialRequestReport',
                            params: {
                                'id' : value.selectize_category,
                                'fromDate' : value.fromDate,
                                'toDate' : value.toDate,
                            },
                            headers:{'access_token':$localStorage.access_token}
                        }).success(function(material_data){
                           $scope.tableView_data = material_data.data;
                           $scope.tableView_data1 = '';
                           $scope.tableView_data2 = '';
                        }).error(function(material_data){
                            $scope.tableView_data = [];
                        });
                    }else if(value.selectize_category == 'Purchase Order'){
                        $http({
                            method:'GET',
                            url: $localStorage.service+'inventoryApi/purchaseOrderReport',
                            params: {
                                'id' : value.selectize_category,
                                'fromDate' : value.fromDate,
                                'toDate' : value.toDate,
                            },
                            headers:{'access_token':$localStorage.access_token}
                        }).success(function(purchaseOrder_data){
                           $scope.tableView_data1 = purchaseOrder_data.data;
                           $scope.tableView_data = '';
                           $scope.tableView_data2 = '';
                        }).error(function(purchaseOrder_data){
                            $scope.tableView_data = [];
                        });
                    }else if(value.selectize_category == 'GRN'){
                        $http({
                            method:'GET',
                            url: $localStorage.service+'inventoryApi/GRNReport',
                            params: {
                                'id' : value.selectize_category,
                                'fromDate' : value.fromDate,
                                'toDate' : value.toDate,
                            },
                            headers:{'access_token':$localStorage.access_token}
                        }).success(function(grn_data){
                           $scope.tableView_data2 = grn_data.data;
                           $scope.tableView_data = '';
                           $scope.tableView_data1 = '';
                        }).error(function(grn_data){
                            $scope.tableView_data = [];
                        });
                    }

                        //$scope.tableView_data = deptReturn_Data;
                        // angular.forEach($scope.tableView_data, function(value,key){
                        //     value.pay_amount=getAmount(value.payitem_id);
                        //     value.pay_freq=getFrequency(value.payitem_id);
                        // });
                        // function getAmount(id){
                        //     var data=$filter('filter')($scope.payitemstruc_data,{id : id}, true);
                        //     if(data[0]) return data[0].Amount;
                        // }
                        // function getFrequency(id){
                        //     var data_val=$filter('filter')($scope.payitemstruc_data,{ id : id}, true);
                        //     // console.log(data_val,"data_val");
                        //     if(data_val[0]) return getdatafrompaystructure(data_val[0].PayStructure_id);
                        // }
                        // function getdatafrompaystructure(id){
                        //     var data1=$filter('filter')($scope.return_paydata,{ id : id}, true);
                        //     if(data1[0]) return data1[0].Frequency;
                        // }
                }
                
                // date range
                var $dp_start = $('#uk_dp_start'),
                    $dp_end = $('#uk_dp_end');

                var start_date = UIkit.datepicker($dp_start, {
                    format:'DD.MM.YYYY'
                });

                var end_date = UIkit.datepicker($dp_end, {
                    format:'DD.MM.YYYY'
                });

                $dp_start.on('change',function() {
                    end_date.options.minDate = $dp_start.val();
                });

                $dp_end.on('change',function() {
                    start_date.options.maxDate = $dp_end.val();
                });
        }
    ]);
