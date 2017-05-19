angular
    .module('rubycampusApp')
    .controller('grnAddCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
            var vm = this;
            vm.dt_data = [];

            $resource('data/finance/fine.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                });

                $scope.selectize_purchaseOrder_options = ["PO_1", "PO_2", "PO_3"];
                $scope.selectize_purchaseOrder_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Purchase Order'
                };

            $scope.backBtn = function(){
                window.history.back();
            }

            $scope.newRowObj = {
                    feesItem1 : '',
                    feesItem2 : '',
                    feesItem3 : '',
                    feesItem4 : '',
                    feesItem5 : ''
                };
            $scope.newRow=[];
            $scope.newRow.push($scope.newRowObj);
            $scope.addRow = function(){
                $scope.newRow.push($scope.newRowObj);
            }

            $scope.removeRow = function(index){
                $scope.newRow.splice(index,1);
            }

            // var d=new Date();
            // var year=d.getFullYear();
            // var month=d.getMonth()+1;
            // var day=d.getDate();
            // if (month<10){
            // month="0" + month;
            // };
            // if (day<10){
            //     dayNew = "0" + day;
            // }else{
            //     dayNew = day;
            // };
            
            // $scope.date=dayNew + "." + month + "." + year;
            // $scope.invoice_date = $scope.date;
            //$scope.grn_date = $scope.date;
        }
    );