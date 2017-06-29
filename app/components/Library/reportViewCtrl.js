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
            // $scope.deptArray=[];
            // $scope.tableArray=[];
            
            // var path=$location.path().split( '/' );
            // $scope.urlname=path[1];

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


                $scope.selectize_category_options =["Issued Books", "Student", "Employee"];
                $scope.selectize_category_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Reports For',
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

                $scope.selectize_bookType_options =["Issued Report", "Returned Report"];
                $scope.selectize_bookType_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Report',
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

                $scope.materialData = [];
                $scope.purchaseData = [];
                $scope.grnData = [];

                $scope.getPayslipdetail=function(value){
                    console.log(value,'valuevalue');
                    if(value.selectize_category == 'Issued Books'){
                        $http({
                            method:'GET',
                            url: $localStorage.service+'LibraryAPI/IssuedBookReport',
                            params: {
                                'id' : value.selectize_category,
                                'fromDate' : value.fromDate,
                                'toDate' : value.toDate,
                            },
                            headers:{'access_token':$localStorage.access_token}
                        }).success(function(issuedBook_data){
                            console.log(issuedBook_data,'issuedBook_data');
                           $scope.tableView_data1 = issuedBook_data.data;
                           $scope.tableView_data2 = '';
                           $scope.tableView_data3 = '';
                        }).error(function(issuedBook_data){
                            $scope.tableView_data = [];
                        });
                    }else if(value.selectize_category == 'Student'){
                        $http({
                            method:'GET',
                            url: $localStorage.service+'LibraryAPI/StudentBookReport',
                            params: {
                                'id' : value.stuProfileId,
                                'type' : value.selectize_bookType,
                            },
                            headers:{'access_token':$localStorage.access_token}
                        }).success(function(studentBook_data){
                            console.log(studentBook_data,'studentBook_data');
                            if(studentBook_data.status == false){
                                $scope.tableView_data2 = '';
                            }else{
                                $scope.tableView_data2 = studentBook_data.data;
                            }
                            $scope.tableView_data1 = '';
                            $scope.tableView_data3 = '';
                        }).error(function(studentBook_data){
                            $scope.tableView_data = [];
                        });
                    }else if(value.selectize_category == 'Employee'){
                        $http({
                            method:'GET',
                            url: $localStorage.service+'LibraryAPI/EmployeeBookReport',
                            params: {
                                'id' : value.empProfileId,
                                'type' : value.selectize_bookType,
                            },
                            headers:{'access_token':$localStorage.access_token}
                        }).success(function(employeeBook_data){
                           $scope.tableView_data3 = employeeBook_data.data;
                           $scope.tableView_data1 = '';
                           $scope.tableView_data2 = '';
                        }).error(function(employeeBook_data){
                            $scope.tableView_data = [];
                        });
                    }
                }

                $scope.student=[];
                $http({
                    method:'GET',
                    url: $localStorage.service+'LibraryAPI/stuReportAutocomplete',
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_data');
                    $scope.student.push(return_data.data.message);

                    angular.forEach($scope.student[0], function(values, keys){
                        values.value=values.adm_no+" - "+values.name;
                    });

                    UIkit.on('domready.uk.dom', function(){
                        UIkit.autocomplete($('#autocomplete'), {
                          source: $scope.student[0],
                          minLength:1,
                          flipDropdown:true
                        }).on('selectitem.uk.autocomplete', function (e, data, ac) {
                                $scope.report.stuProfileId = data.id;
                            
                            // var index = e.target.id.split("_")[1];
                            // $scope.items[index]['item_id']=data.id;
                            // var id = data.id;
                            // console.log(id,'idid');
                            // $http({
                            //     method : 'GET',
                            //     url : $localStorage.service+'inventoryApi/getItemCode',
                            //     params : {'id' : id},
                            //     headers:{'access_token':$localStorage.access_token}
                            // }).then(function(item_code){
                            //     $scope.items[index]['item_code'] = item_code.data.data[0]["CODE"];
                            // });
                        });
                    });
                });

                $scope.employee=[];
                $http({
                    method:'GET',
                    url: $localStorage.service+'LibraryAPI/empReportAutocomplete',
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){

                    $scope.employee.push(return_data.data.message);

                    angular.forEach($scope.employee[0], function(values, keys){
                        values.value=values.adm_no+" - "+values.name;
                    });

                    UIkit.on('domready.uk.dom', function(){
                        UIkit.autocomplete($('#autocomplete1'), {
                          source: $scope.employee[0],
                          minLength:1,
                          flipDropdown:true
                        }).on('selectitem.uk.autocomplete', function (e, data, ac) {
                                $scope.report.empProfileId = data.id;
                            
                            // var index = e.target.id.split("_")[1];
                            // $scope.items[index]['item_id']=data.id;
                            // var id = data.id;
                            // console.log(id,'idid');
                            // $http({
                            //     method : 'GET',
                            //     url : $localStorage.service+'inventoryApi/getItemCode',
                            //     params : {'id' : id},
                            //     headers:{'access_token':$localStorage.access_token}
                            // }).then(function(item_code){
                            //     $scope.items[index]['item_code'] = item_code.data.data[0]["CODE"];
                            // });
                        });
                    });
                });
                    
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
