angular
    .module('rubycampusApp')
    .controller('supplierViewCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, $http, $rootScope, $filter,$localStorage) {

            $scope.clearValidation=function(){
                $('#form_validation').parsley().reset();
            }
            var $formValidate = $('#form_validation');
            $formValidate
                .parsley()
                .on('form:validated',function() {
                    $scope.$apply();
                })
                .on('field:validated',function(parsleyField) {
                    if($(parsleyField.$element).hasClass('md-input')) {
                        $scope.$apply();
                    }
                });

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
                .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('S.No'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Supplier Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Supplier Type'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Contact Number'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('TIN Number'),
                DTColumnDefBuilder.newColumnDef(5).withTitle('Region'),
            ];

            var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
            
            $scope.route_name = [];
            $resource('app/components/inventory/supplier.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                });
            
			
			$scope.supplierType=[];
			$http.get($localStorage.service+'inventoryApi/supplierType',{headers:{'access_token':$localStorage.access_token}})
            .success(function(supplierType_data){
                $scope.supplierType.push(supplierType_data.data);
            });
				
			$scope.selectize_supplierType_options = $scope.supplierType;
			$scope.selectize_supplierType_config = {
				create: false,
                maxItems: 1,
                placeholder: 'Supplier Type',
				valueField: 'ID',
                labelField: 'NAME',
				onInitialize: function(val){
                    console.log(val);
                }
			};
			
             $scope.openModel = function() {
                $scope.titleCaption="Add";
                $scope.btnStatus="Save";
                $scope.supplier_id=null;
                $scope.supplier_name=null;
                $scope.supplier_contact_number=null;
                $scope.supplier_address=null;
                $scope.supplier_region=null;
                $scope.selectize_supplierType=null;
                $('.uk-modal').find('input').trigger('blur');
            };
            $scope.edit_supplier= function(res){
                $scope.titleCaption="Edit";
                $scope.btnStatus="Update";
                if(res){
                    $scope.supplier_id=res.ID;
                    $scope.supplier_name=res.NAME;
                    $scope.selectize_supplierType=res.SUPPLIER_TYPE_ID;
                    $scope.supplier_address=res.ADDRESS;
                    $scope.supplier_region=res.REGION;
                    $scope.supplier_contact_number=res.PHONE;
                }
            }

            $scope.viewData=[];
            $scope.refreshTable=function(){
                $http.get($localStorage.service+'inventoryApi/supplier',{headers:{'access_token':$localStorage.access_token}})
                .success(function(response){
                    $scope.viewData=response.data;
                    console.log($scope.viewData,'$scope.viewData');
                });
            }
            
            $scope.refreshTable();

            // Save Data
            $scope.saveSupplierData=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'inventoryApi/supplier',
                data: {
                    'supplier_id' : $scope.supplier_id,
                    'supplier_name' : $scope.supplier_name,
                    'supplier_contact_number' : $scope.supplier_contact_number,
                    'supplier_address' : $scope.supplier_address,
                    'supplier_region' : $scope.supplier_region,
                    'supplier_type_id' : $scope.selectize_supplierType,
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.message);
                    if(return_data.data.status==true){
                        UIkit.modal("#modal_overflow").hide();
                        UIkit.notify({
                            message : return_data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                    }
                    $scope.refreshTable();
                });
            }

            // delete block
            $scope.deleteSupplier=function(id, $index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"inventoryApi/supplier",
                            params : {id : id},
                            headers:{'access_token':$localStorage.access_token}
                            }).then(function mySucces(return_data) {
                                if(return_data.data.status==true){
                                    UIkit.notify({
                                        message : return_data.data.message.message,
                                        status  : 'success',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                }
                                $scope.viewData.splice($index, 1);
                                $scope.refreshTable();
                            },function myError(return_data) {
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