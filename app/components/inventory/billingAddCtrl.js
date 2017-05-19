angular
    .module('rubycampusApp')
    .controller('billingAddCtrl', [
        '$scope',
        '$window',
        '$timeout',
        'struct_data',
        '$filter',
        '$http',
        '$state',
        '$rootScope',
        '$localStorage',
        function ($scope, $window, $timeout, struct_data, $filter, $http, $state, $rootScope, $localStorage) {

            $scope.store_name = [];
            $http.get($localStorage.service+'inventoryApi/store',{headers:{'access_token':$localStorage.access_token}})
            .success(function(store_data){
                console.log(store_data,'store_data');
                $scope.store_name.push(store_data.data);
            });
            
            $scope.selectize_store_options = $scope.store_name;
            $scope.selectize_store_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Store',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $scope.storeItem_options = [];
                        $scope.getItems(value);
                    });
                }
            };

            $scope.getItems = function(id){

                $http({
                    method : 'GET',
                    url : $localStorage.service+'inventoryApi/storeIdData',
                    params : {'id' : id},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    $scope.storeItem_options = return_data.data.data;
                    angular.forEach($scope.storeItem_options, function(values, keys){
                        values.value=values.ITEM_NAME;
                        console.log(values,"values");
                    });
                    UIkit.on('domready.uk.dom', function(){
                        UIkit.autocomplete($('#autocomplete'), {
                          source: $scope.storeItem_options,
                          minLength:0,
                          flipDropdown:true
                        }).on('selectitem.uk.autocomplete', function (e, data, ac) {
                            var id = data.value;
                            $http({
                                method : 'GET',
                                url : $localStorage.service+'inventoryApi/getItemCode',
                                params : {'id' : id},
                                headers:{'access_token':$localStorage.access_token}
                            }).then(function(item_code){
                                $scope.items[0]['item_code'] = item_code.data.data[0]["CODE"];
                            });
                        });
                    });
                });               
            }

            $scope.saveBilling = function(){
                $http({
                    method : 'POST',
                    url : $localStorage.service+'inventoryApi/billing',
                    data : {
                        'billing_id' : $scope.billing_id,
                        'invoice_no' : $scope.invoice_no,
                        'invoice_date' : $scope.invoice_date,
                        'store_id' : $scope.selectize_store,
                        // 'stu_emp_id' : $scope.selectize_supplierType,
                        // 'course_id' : $scope.selectize_supplier,
                        // 'batch_id' : $scope.selectize_supplier,
                        // 'po_reference' : $scope.po_reference,
                        'notes' : $scope.billing_notes,
                        'total_amount' : $scope.totalAmount,
                        'itemData' : $scope.items
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
                            $state.go('restricted.inventory.billingView');
                        },200);
                    }else {
                        UIkit.modal.alert('Already Exists');
                    }
                })
            }

            $scope.total = function(){
                var total = 0;
                angular.forEach($scope.items, function(item){
                    total += item.unitprice * item.quantity;
                })
                $scope.totalAmount = total;
                return $scope.totalAmount;
            }
        
            // $scope.selectize_store_options = ["Store 1", "Store 2", "Store 3","Store 4"];
            // $scope.selectize_store_config = {
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Store'
            // };

            $scope.selectize_issuedTo_options = ["Student", "Employee"];
            $scope.selectize_issuedTo_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Issued To'
            };

            $scope.selectize_course_options = ["Course 1", "Course 2", "Course 3"];
            $scope.selectize_course_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Course'
            };

            $scope.selectize_batch_options = ["Batch 1", "Batch 2", "Batch 3"];
            $scope.selectize_batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Batch'
            };

            $scope.selectize_department_options = ["Department 1", "Department 2", "Department 3"];
            $scope.selectize_department_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Department'
            };
            
            var d=new Date();
            var year=d.getFullYear();
            var month=d.getMonth()+1;
            var day=d.getDate();
            if (month<10){
            month="0" + month;
            };
            if (day<10){
                dayNew = "0" + day;
            }else{
                dayNew = day;
            };
            
            $scope.date=dayNew + "." + month + "." + year;
            $scope.invoice_date = $scope.date;
           

            var $maskedInput = $('.masked_input');
            if($maskedInput.length) {
                $maskedInput.inputmask();
            }

            $scope.changePaid = function () {
                var Paidtotal = 0;
                var Fixedtotal = 0;
                angular.forEach($scope.feesItem, function(value,keys){
                    angular.forEach(value, function(value1,keys1){
                        Paidtotal+=parseInt(value1.fees);
                        Fixedtotal+=parseInt(value1.fixedFee);
                    });
                });
                $scope.totalPaid=Paidtotal;
                $scope.totalAmount = Fixedtotal;
            };

            $scope.newRowObj = {
                    item_name : '',
                    item_code : '',
                    quantity : '',
                    unitprice : '',
                    totalPrice : ''
                };
            $scope.items=[];
            $scope.items.push($scope.newRowObj);
            $scope.addRow = function(){
                $scope.items.push({ 'item_name': '', 'item_code' : '', 'quantity' : '', 'unitprice' : '', 'totalprice' : '' });
            }

            $scope.removeRow = function(index){
                $scope.items.splice(index,1);
            }

            $scope.backBtn = function(){
                window.history.back();
            }

        }
    ]);