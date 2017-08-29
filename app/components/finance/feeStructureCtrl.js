angular
    .module('rubycampusApp')
    .controller('feeStructureCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$localStorage,$http) {
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
                            type: 'number',
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
                $scope.refreshTable=function(){
                    $http({
                        url: $localStorage.service+'FinanceAPI/feeStructure',
                        method : 'GET',
                        headers: { 'access_token':$localStorage.access_token},
                    }).then(function(response) {
                        // console.log(response,'success');
                        $scope.viewData=response.data.message;
                    });
                }
                $scope.refreshTable();
                $scope.deleteFeeStructure=function($index,id){

                    if(id){
                        $http({
                        method : "GET",
                        url: $localStorage.service+'FinanceAPI/checkFeeStructure',
                        params : {id : id},
                        headers:{'access_token':$localStorage.access_token}
                    }).then(function(response){
                        console.log(response,'response');
                        if(response.data.status==true){
                            UIkit.modal.alert('This fee structure assigned to a student, remove the student to continue removing this fee structure');
                        }else{
                            UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                                if(id){
                                    $http({
                                        method : "DELETE",
                                        url : $localStorage.service+"FinanceAPI/feeStructure",
                                        params : {id : id},
                                        headers:{'access_token':$localStorage.access_token}
                                    }).then(function(response) {
                                        console.log('delete',response);
                                        $scope.viewData.splice($index, 1);
                                        UIkit.notify({
                                            message : response.data.message,
                                            status  : 'success',
                                            timeout : 2000,
                                            pos     : 'top-center'
                                        });
                                        $scope.refreshTable();
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
                    })
                        // }).then(function mySucces(response) {
                        //     UIkit.modal.alert('This fee structure assigned to a student, remove the student to continue removing this fee structure');
                        // },function myError(response) {
                        //     console.log(response,'error');
                        //     UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        //         if(id){
                        //             $http({
                        //                 method : "DELETE",
                        //                 url : $localStorage.service+"FinanceAPI/feeStructure",
                        //                 params : {id : id},
                        //                 headers:{'access_token':$localStorage.access_token}
                        //             }).then(function mySucces(response) {
                        //                 console.log('delete',response);
                        //                 $scope.viewData.splice($index, 1);
                        //                 UIkit.notify({
                        //                     message : response.data.message,
                        //                     status  : 'success',
                        //                     timeout : 2000,
                        //                     pos     : 'top-center'
                        //                 });
                        //                 $scope.refreshTable();
                        //             },function myError(response) {
                        //             })
                        //         }
                        //     },function(){
                        //         // console.log("false");
                        //     }, {
                        //         labels: {
                        //             'Ok': 'Ok'
                        //         }
                        //     });
                        // })
                    }
                }
        }
    );