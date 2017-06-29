angular
    .module('rubycampusApp')
    .controller('grnEditCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, $http, $state, $rootScope, $stateParams, $localStorage) {
            
            $scope.grn_data = [];
            $http({
                method:'GET',
                url: $localStorage.service+'inventoryApi/GRN',
                params: {
                    'id' : $stateParams.id,
                },
                headers:{'access_token':$localStorage.access_token}
            }).then(function(grn_data){
                console.log(grn_data,'grn_data');
                $scope.grn_data = grn_data.data.data[0];
                // $scope.grn_id = $scope.grn_data.ID;
                // $scope.grn_number = $scope.grn_data.GRN_NUMBER;
                // $scope.grn_date = $scope.grn_data.GRN_DATE;
                // $scope.selectize_purchaseOrder = $scope.grn_data.PURCHASE_ORDER_ID;
                // $scope.invoice_number = $scope.grn_data.INVOICE_NO;
                // $scope.invoice_date = $scope.grn_data.INVOICE_DATE;
                // $scope.purchaseOrderItem_options = $scope.grn_data.grn_items;
            });

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
                        $scope.grn_data.grn_items = [];
                        $scope.getItems(value);
                    });
                }
            };

            $scope.getItems = function(id){
                $http({
                    method : 'GET',
                    url : $localStorage.service+'inventoryApi/purchaseOrderIdUpdateItems',
                    params : {'id' : id},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'Datareturn_data');
                    $scope.grn_data.grn_items = return_data.data.data;
                    console.log($scope.grn_data.grn_items,'return_data');
                });               
            }

            $scope.total = function(){
                var total = 0;
                angular.forEach($scope.grn_data.grn_items, function(item){
                    console.log(item,'itemitem');
                    total += item.QUANTITY * item.PRICE;
                });
                $scope.totalAmount = total;
                return $scope.totalAmount;
            }

            $scope.totalPrice = function(item){
                var total = item.QUANTITY * item.PRICE;
                item.totalPriceVal = total;
            }

            $scope.updateGRN = function(grn_data){
                $http({
                    method : 'POST',
                    url : $localStorage.service+'inventoryApi/GRN',
                    data : {
                        'grn_id' : $scope.grn_data.ID,
                        'grn_number' : $scope.grn_data.GRN_NUMBER,
                        'grn_date' : $scope.grn_data.GRN_DATE,
                        'po_id' : $scope.grn_data.PURCHASE_ORDER_ID,
                        'invoice_number' : $scope.grn_data.INVOICE_NO,
                        'invoice_date' : $scope.grn_data.INVOICE_DATE,
                        'total_amount' : $scope.totalAmount,
                        'itemData' : $scope.grn_data.grn_items
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
                $scope.grn_data.grn_items.splice(index,1);
            }

            $scope.backBtn = function(){
                window.history.back();
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