angular
    .module('rubycampusApp')
    .controller('payslipgen_tableCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$stateParams',
        '$filter',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        '$compile',
        '$location',
        '$window',
        '$http',
        '$localStorage',
        function ($scope,$rootScope,$timeout,$resource,$stateParams,$filter,DTOptionsBuilder, DTColumnDefBuilder,$compile,$location,$window,$http,$localStorage) {
                console.log($stateParams,'stateParams');
                var path=$location.path().split( '/' );
                $scope.urlname=path[1];

                $scope.monthSelectorOptions = {
                    start: "year",
                    depth: "year"
                };
                $scope.getType = function(x) {
                    return typeof x;
                };
                $scope.isDate = function(x) {
                    return x instanceof Date;
                };


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
                        }
                    ]
                })
                 .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });
                $scope.viewData=[];
                $scope.payslipList=[];
               
                    $http({
                        method:'GET',
                        url: $localStorage.service+'PayrollPayslipAPI/fetchEmployeePayDetails',
                        params:{id:$stateParams.pay_id},
                        headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        $scope.viewData=return_data.data.message[0];
                    });
                
                $scope.refreshTable=function(){
                    $http({
                        method:'GET',
                        url: $localStorage.service+'PayrollPayslipAPI/employeePayslipDetails',
                        params:{id:$stateParams.pay_id},
                        headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        $scope.payslipList=return_data.data.message;
                    });
                }
                $scope.refreshTable();
                $scope.generatePDF = function(id,genDate) {
                    console.log(genDate,'genDategenDategenDategenDate');
                    if(id){
                        $http({
                            // url : 'http://localhost/ruby/Rubyctrl/index',
                            // url: 'http://localhost/rubyServices/PayrollPayslipAPI/index',
                            url: $localStorage.service+'PayrollPayslipAPI/index',
                            method : 'POST',
                            data : { 'id':id,'genDate':genDate},
                            responseType : 'arraybuffer',
                            headers: {
                             'Content-type' : 'application/pdf'
                            },
                            cache: true,
                        }).success(function(data) {
                            console.log('data',data);
                            var blob = new Blob([data], { type: 'application/pdf' });
                            var fileURL = URL.createObjectURL(blob);
                            var fileName = "1099.pdf";
                            var contentFile = blob;
                            $window.open(fileURL, "_blank");
                        }).error(function(data){
                            console.log('error');
                        });
                    }
                }

                $scope.deletePayslip=function(payslip_ID,$index){
                    // console.log(payslip_ID,'pay_id');
                    if(payslip_ID){
                        UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                            if(payslip_ID){
                                $http({
                                method : "DELETE",
                                url : $localStorage.service+"PayrollPayslipAPI/payslipDelete",
                                params : {id : payslip_ID},
                                headers:{'access_token':$localStorage.access_token}
                                }).then(function mySucces(response) {
                                    console.log('delete',response);
                                    $scope.payslipList.splice($index,1);
                                    UIkit.notify({
                                        message : response.data.message,
                                        status  : 'success',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                    $scope.refreshTable();
                                },function myError(response) {
                                    console.log(response,'errrr');
                                })
                            }
                        },function(){
                            // console.log("false");
                        }, {
                            labels: {
                                'Ok': 'Ok'
                            }
                        });
                    }
                }
            $scope.passDate=function(genDate){
                if(genDate){
                    console.log(genDate,'genDate');
                    $localStorage.GenDate=genDate;
                }
            }
        }
    ]);