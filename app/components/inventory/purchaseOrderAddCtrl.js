angular
    .module('rubycampusApp')
    .controller('purchaseOrderAddCtrl',
        function($compile, $scope, $window, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, $filter, $http, $state, $rootScope, $localStorage) {
            var vm = this;
            vm.dt_data = [];

            $scope.store_name = [];
            $http.get($localStorage.service+'inventoryApi/store',{headers:{'access_token':$localStorage.access_token}})
            .success(function(store_data){
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
                        $scope.selectize_storeItem_options = [];
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
                    $scope.selectize_storeItem_options = return_data.data.data;
                });
            }

            $scope.selectize_storeItem_options = [];
            $scope.selectize_storeItem_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Item',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(val){

                    })
                }
            };

            $scope.supplier_type = [];
            $http.get($localStorage.service+'inventoryApi/supplierType',{headers:{'access_token':$localStorage.access_token}})
            .success(function(supplier_data){
                $scope.supplier_type.push(supplier_data.data);
            });

            $scope.selectize_supplierType_options = $scope.supplier_type;
            $scope.selectize_supplierType_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Supplier Type',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $scope.selectize_supplier_options = [];
                        $scope.getSupplier(value);
                    });
                }
            };

            $scope.getSupplier = function(id){
                $http({
                    method : 'GET',
                    url : $localStorage.service+'inventoryApi/supplierIdData',
                    params : {'id' : id},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    $scope.selectize_supplier_options = return_data.data.data;
                });
            }

            $scope.selectize_supplier_options = [];
            $scope.selectize_supplier_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Supplier',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(val){

                    })
                }
            };

            $scope.savePurchaseOrder = function(){
                $http({
                    method : 'POST',
                    url : $localStorage.service+'inventoryApi/purchaseOrder',
                    data : {
                        'purchaseOrder_id' : $scope.purchaseOrder_id,
                        'po_number' : $scope.po_number,
                        'po_date' : $scope.po_date,
                        'store_id' : $scope.selectize_store,
                        'supplier_type_id' : $scope.selectize_supplierType,
                        'supplier_id' : $scope.selectize_supplier,
                        'po_reference' : $scope.po_reference,
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
                            $state.go('restricted.inventory.purchaseOrderView');
                        },200);
                    }else {
                        UIkit.modal.alert('Already Exists');
                    }
                })
            }

            $resource('data/finance/fine.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                });

                $scope.selectize_indent_options = ["1", "2", "3"];
                $scope.selectize_indent_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Indents'
                };

                // $scope.selectize_store_options = ["Store 1", "Store 2"];
                // $scope.selectize_store_config = {
                //     create: false,
                //     maxItems: 1,
                //     placeholder: 'Store'
                // };
                //  $scope.selectize_supplierType_options = ["Vendor", "Manufacturer"];
                // $scope.selectize_supplierType_config = {
                //     create: false,
                //     maxItems: 1,
                //     placeholder: 'Supplier Type'
                // };
                //  $scope.selectize_supplier_options = ["Supplier 1", "Supplier 2", "Supplier 3"];
                // $scope.selectize_supplier_config = {
                //     create: false,
                //     maxItems: 1,
                //     placeholder: 'Supplier'
                // };

                // $scope.selectize_storeItem_options = ["Pencil", "Pen", "Duster"];
                // $scope.selectize_storeItem_config = {
                //     create: false,
                //     maxItems: 1,
                //     placeholder: 'Store Item'
                // };

                // Clone functionality

            $scope.form_template = [
                [
                    {
                        'type': 'text',
                        'name': 'firstName',
                        'label': 'First Name'
                    },
                    {
                        'type': 'text',
                        'name': 'lastName',
                        'label': 'Last Name'
                    }
                ],
                [
                    {
                        'type': 'text',
                        'name': 'company',
                        'label': 'Company'
                    }
                ],
                [
                    {
                        'type': 'radio',
                        'label': 'Gender',
                        'name': 'gender',
                        'inputs': [
                            {
                                'label': 'Man',
                                'value': 'man'
                            },
                            {
                                'label': 'Woman',
                                'value': 'woman'
                            }
                        ]
                    },
                    {
                        'type': 'switch',
                        'label': 'Contact',
                        'inputs': [
                            {
                                'label': 'Email',
                                'name': 'switch_email'
                            },
                            {
                                'label': 'Phone',
                                'name': 'switch_phone'
                            }
                        ]
                    }
                ],
                [
                    {
                        'type': 'selectize',
                        'name': 'city',
                        'position': 'bottom',
                        'config': {
                            'valueField': 'value',
                            'labelField': 'title',
                            'placeholder': 'City...'
                        },
                        'data': [
                            {
                                "value": "city_a",
                                "title": "City A"
                            },
                            {
                                "value": "city_b",
                                "title": "City B"
                            },
                            {
                                "value": "city_c",
                                "title": "City C"
                            },
                            {
                                "value": "city_d",
                                "title": "City D"
                            },
                            {
                                "value": "city_e",
                                "title": "City E"
                            }
                        ]
                    },
                    {
                        'type': 'selectize',
                        'name': 'country',
                        'config': {
                            'valueField': 'value',
                            'labelField': 'title',
                            'create': false,
                            'maxItems': 1,
                            'placeholder': 'Country...'
                        },
                        'data': [
                            {
                                "value": "country_a",
                                "title": "Country A"
                            },
                            {
                                "value": "country_b",
                                "title": "Country B"
                            },
                            {
                                "value": "country_c",
                                "title": "Country C"
                            },
                            {
                                "value": "country_d",
                                "title": "Country D"
                            },
                            {
                                "value": "country_e",
                                "title": "Country E"
                            }
                        ]
                    }
                ]
            ];
            $scope.mode = [
                            {
                                'label': 'Man',
                                'value': 'man'
                            },
                            {
                                'label': 'Woman',
                                'value': 'woman'
                            }
                    ];
            $scope.form_dynamic = [];
            $scope.form_dynamic.push($scope.form_template);

            $scope.form_dynamic_model = [];

            // clone section
            $scope.cloneSection = function($event,$index) {
                $event.preventDefault();
                var ss = $scope.form_dynamic.push($scope.form_template);
            };

            // delete section
            $scope.deleteSection = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic_model.splice($index,1);
                $scope.form_dynamic.splice($index,1);
            };

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                altair_uikit.reinitialize_grid_margin();
            });

            $scope.backBtn = function(){
                window.history.back();
            }

            $scope.newRowObj = {
                selectize_storeItem : '',
                unitprice : '',
                quantity : '',
                totalprice : ''
            };
            $scope.items=[];
            $scope.items.push($scope.newRowObj);
            $scope.addRow = function(){
                $scope.items.push({ 'selectize_storeItem': '', 'unitprice' : '', 'quantity' : '', 'totalprice' : '' });
            }

            $scope.removeRow = function(index){
                $scope.items.splice(index,1);
            }

            $scope.total = function(){
                var total = 0;
                angular.forEach($scope.items, function(item){
                    total += item.unitprice * item.quantity;
                })
                $scope.totalAmount = total;
                return $scope.totalAmount;
            }

            // $scope.price = function(){
            //     angular.forEach($scope.items, function(item){
            //         total = item.unitprice * item.quantity;
            //     })
            //     $scope.totalPrice = total;
            //     return $scope.totalPrice;
            // }

        }
    );