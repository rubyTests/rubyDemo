angular
    .module('rubycampusApp')
    .controller('routeStopsCtrl',
        function($compile, $scope, $rootScope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, $filter, $localStorage, $http) {

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

                $scope.viewData=[];
                $http({
                    method:'GET',
                    url: $localStorage.service+'TransportAPI/routeStops',
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(view_data){
                    console.log(view_data,'view_dataview_data222');
                    $scope.viewData=view_data.data.message;
                });
                $scope.deleteRouteStops=function(id,$index){
                    $http({
                        method : "get",
                        url : $localStorage.service+"TransportAPI/checkRoutestopsdetails",
                        params : {id : id},
                        headers:{'access_token':$localStorage.access_token}
                        }).then(function mySucces(response) {
                            //console.log(response,'responseresponse');
                            if(response.data.status==true){
                                if(id){
                                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                                        if(id){
                                            $http({
                                            method : "DELETE",
                                            url : $localStorage.service+"TransportAPI/routeStops",
                                            params : {id : id},
                                            headers:{'access_token':$localStorage.access_token}
                                            }).then(function mySucces(response) {
                                                
                                                if(response.data.status==true){
                                                    UIkit.notify({
                                                        message : response.data.message,
                                                        status  : 'success',
                                                        timeout : 2000,
                                                        pos     : 'top-center'
                                                    });
                                                    $scope.viewData.splice($index, 1);
                                                    
                                                }
                                                
                                            },function myError(response) {
                                            })
                                        }
                                    },function(){
                                         console.log("false");
                                    }, {
                                        labels: {
                                            'Ok': 'Ok'
                                        }
                                    });
                                }

                            }
                        },function myError(response) {
                            //console.log(response,'errr');
                            UIkit.modal.alert(response.data.message);
                        })
                   
                }
                // $scope.deleteRouteStops=function(id,$index){
                //     if(id){
                //         UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                //             if(id){
                //                 $http({
                //                 method : "DELETE",
                //                 url : $localStorage.service+"TransportAPI/routeStops",
                //                 params : {id : id},
                //                 headers:{'access_token':$localStorage.access_token}
                //                 }).then(function mySucces(response) {
                //                     //console.log(response.data.message.message,'delete');
                //                     UIkit.notify({
                //                         message : response.data.message,
                //                         status  : 'success',
                //                         timeout : 2000,
                //                         pos     : 'top-center'
                //                     });
                //                     $scope.viewData.splice($index, 1);
                //                     // $scope.refreshTable();
                //                 },function myError(response) {
                //                 })
                //             }
                //         },function(){
                //         }, {
                //             labels: {
                //                 'Ok': 'Ok'
                //             }
                //         });
                //     }
                // }
        }
    );