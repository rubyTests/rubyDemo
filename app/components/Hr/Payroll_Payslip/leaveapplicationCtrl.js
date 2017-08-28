angular
    .module('rubycampusApp')
    .controller('leaveapplicationCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter,$http,$localStorage) {
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

                $scope.ViewDetas=[];
                $scope.refreshTable=function(){
                   $http({
                    method:'GET',
                    url: $localStorage.service+'LeavemgmntAPI/leaveApplicationDetails',
                    params: {
                        'id' : 1
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data.data.data,'return_data');
                        $scope.ViewDetas=return_data.data.data;
                    }); 
                }
                $scope.refreshTable();

                $scope.deleteLeaveApplication=function(id,bal_id,$index){
                    if(id){
                        UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                            if(id){
                                $http({
                                method : "DELETE",
                                url : $localStorage.service+"LeavemgmntAPI/leaveApplicationDetails",
                                params : {id : id,bal_id:bal_id},
                                headers:{'access_token':$localStorage.access_token}
                                }).then(function mySucces(response) {
                                    console.log(response,'response');
                                    if(response.data.status==true){
                                        UIkit.notify({
                                            message : response.data.message,
                                            status  : 'success',
                                            timeout : 2000,
                                            pos     : 'top-center'
                                        });
                                        $scope.ViewDetas.splice($index, 1);
                                        $scope.refreshTable();
                                    }
                                    
                                },function myError(response) {
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
        }
    );