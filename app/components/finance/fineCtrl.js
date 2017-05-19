angular
    .module('rubycampusApp')
    .controller('fineCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$localStorage) {
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
                    url: $localStorage.service+'FinanceAPI/feeFine',
                    method : 'GET',
                    headers: { 'access_token':$localStorage.access_token},
                }).success(function(response) {
                    $scope.viewData=response.message;
                }).error(function(data){
                    console.log('error');
                });
            }
            $scope.refreshTable();
            $scope.deleteFeeFine=function(id,$index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                                url: $localStorage.service+'FinanceAPI/feeFine',
                                method : 'DELETE',
                                params:{'id':id},
                                headers: { 'access_token':$localStorage.access_token},
                            }).success(function(response) {
                                console.log(response,'success111');
                                $scope.viewData.splice($index, 1);
                                $scope.refreshTable();
                            }).error(function(data){
                                console.log('error');
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
        }
    );