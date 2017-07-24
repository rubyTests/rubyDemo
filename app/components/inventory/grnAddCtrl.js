angular
    .module('rubycampusApp')
    .controller('grnAddCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, $http, $state, $rootScope, $localStorage) {
            // var vm = this;
            // vm.dt_data = [];

            // $resource('data/finance/fine.json')
            //     .query()
            //     .$promise
            //     .then(function(dt_data) {
            //         vm.dt_data = dt_data;
            //     });

            //     $scope.selectize_purchaseOrder_options = ["PO_1", "PO_2", "PO_3"];
            //     $scope.selectize_purchaseOrder_config = {
            //         create: false,
            //         maxItems: 1,
            //         placeholder: 'Purchase Order'
            //     };

            $scope.purchse_order_name = [];
            $http.get($localStorage.service+'inventoryApi/purchaseOrder',{headers:{'access_token':$localStorage.access_token}})
            .success(function(purchse_order_data){
                console.log(purchse_order_data,'purchse_order_data');
                $scope.purchse_order_name.push(purchse_order_data.data);
            });
            
            $scope.selectize_purchaseOrder_options = $scope.purchse_order_name;
            $scope.selectize_purchaseOrder_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Purchase Order',
                valueField: 'ID',
                labelField: 'PO_NUMBER',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $scope.purchaseOrderItem_options = [];
                        $scope.getItems(value);
                    });
                }
            };

            $scope.getItems = function(id){
                $http({
                    method : 'GET',
                    url : $localStorage.service+'inventoryApi/purchaseOrderIdItems',
                    params : {'id' : id},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){

                    $scope.purchaseOrderItem_options = return_data.data.data;
                    console.log($scope.purchaseOrderItem_options,'return_data');
                });               
            }

            $scope.total = function(){
                var total = 0;
                angular.forEach($scope.purchaseOrderItem_options, function(item){
                    total += item.QUANTITY * item.PRICE;
                });
                $scope.totalAmount = total;
                return $scope.totalAmount;
            }

            $scope.totalPrice = function(item){
                var total = item.QUANTITY * item.PRICE;
                item.totalPriceVal = total;
            }

            $scope.saveGRN = function(){
                $http({
                    method : 'POST',
                    url : $localStorage.service+'inventoryApi/GRN',
                    data : {
                        'grn_id' : $scope.grn_id,
                        'grn_number' : $scope.grn_number,
                        'grn_date' : $scope.grn_date,
                        'po_id' : $scope.selectize_purchaseOrder,
                        'invoice_number' : $scope.invoice_number,
                        'invoice_date' : $scope.invoice_date,
                        'total_amount' : $scope.totalAmount,
                        'itemData' : $scope.purchaseOrderItem_options,
                        'institute_id':$scope.institute_id
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    if(return_data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $timeout(function(){
                            $state.go('restricted.inventory.grnView');
                        },200);
                    }else {
                        UIkit.modal.alert('Already Exists');
                    }
                })
            }

            // $scope.newRowObj = {
            //         feesItem1 : '',
            //         feesItem2 : '',
            //         feesItem3 : '',
            //         feesItem4 : '',
            //         feesItem5 : ''
            //     };
            // $scope.newRow=[];
            // $scope.newRow.push($scope.newRowObj);
            // $scope.addRow = function(){
            //     $scope.newRow.push($scope.newRowObj);
            // }

            $scope.removeRow = function(index){
                $scope.purchaseOrderItem_options.splice(index,1);
            }

            $scope.backBtn = function(){
                window.history.back();
            }


            // added by vijayaraj 24-07-17
            $http({
                method:'GET',
                url: $localStorage.service+'ProfileAPI/getAutoincrementNo',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(profile_data){
               $scope.grn_number=profile_data.data.message[0].GOODS_RECEIPT_PREFIX +''+ profile_data.data.message[0].GRN_NO;
               $scope.institute_id=profile_data.data.message[0].ID;
               if(profile_data.data.message[0].GOODS_RECEIPT==null || profile_data.data.message[0].GOODS_RECEIPT=='undefined' || profile_data.data.message[0].GOODS_RECEIPT==''){
                    $scope.grn_Status=false;
               }else{
                    $scope.grn_Status=true;
               }
            });


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