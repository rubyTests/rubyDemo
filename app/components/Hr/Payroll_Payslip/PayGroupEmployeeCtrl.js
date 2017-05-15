angular
    .module('rubycampusApp')
    .controller('PayGroupEmployeeCtrl',['$scope',
        '$compile',
        '$stateParams', 
        '$timeout', 
        '$resource', 
        '$filter', 
        'DTOptionsBuilder', 
        'DTColumnDefBuilder',
        '$localStorage',
        '$http',
        function( $scope, $compile, $stateParams, $timeout, $resource, $filter, DTOptionsBuilder, DTColumnDefBuilder,$localStorage,$http) {
            var vm = this;
            vm.dt_data = [];
            $scope.EmployeeDetail=[];
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
                            type: 'number',
                            bRegex: true,
                            bSmart: true
                        },
                        // {
                        //     type: 'number',
                        //     bRegex: true,
                        //     bSmart: true
                        // }
                    ]
                })
                .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
            });
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('S.No'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Employee Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Department'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Employee Category'),
                // DTColumnDefBuilder.newColumnDef(4).withTitle('Recent Payslip')
            ];
            
            console.log($stateParams.id,'$stateParams');
            $localStorage.structureName=$stateParams.id;
            // $scope.test=$stateParams.id;

            $scope.refreshTable=function(){
                $http({
                    method:'GET',
                    url: $localStorage.service+'PayrollPayslipAPI/getAssignEmployee',
                    params:{id:$stateParams.id},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'assigned emp');
                    $scope.EmployeeDetail = return_data.data.message;
                });
            }
            $scope.refreshTable();
            $scope.PayStru_name=[];
            $http({
                method:'GET',
                url: $localStorage.service+'PayrollPayslipAPI/payStructure',
                params:{id:$stateParams.id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(pay_structure){
                console.log(pay_structure.data.message[0],'pay_structure');
                $scope.PayStru_name=pay_structure.data.message[0];
            });
            $scope.removeEmployee=function(id,$index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                                method:'POST',
                                url: $localStorage.service+'PayrollPayslipAPI/assignEmployee',
                                data:{id:id},
                                headers:{'access_token':$localStorage.access_token}
                            }).then(function(return_data){
                                console.log(return_data,'employee');
                                $scope.EmployeeDetail.splice($index, 1);
                                UIkit.notify({
                                    message : return_data.data.message.message,
                                    status  : 'success',
                                    timeout : 2000,
                                    pos     : 'top-center'
                                });
                                $scope.refreshTable();
                            });
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
        }]);