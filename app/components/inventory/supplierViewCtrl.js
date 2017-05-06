angular
    .module('rubycampusApp')
    .controller('supplierViewCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
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
			$resource('app/components/transport/vehicleDetail.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.supplierType.push(dt_data);
                });
				
				$scope.selectize_supplierType_options = $scope.supplierType;
				$scope.selectize_supplierType_config = {
					create: false,
                    maxItems: 1,
                    placeholder: 'Supplier Type',
					valueField: 'id',
                    labelField: 'name',
					onInitialize: function(val){
                        console.log(val);
                    }
				};
				
                 $scope.openModel = function() {
                    //$scope.buttonStatus='Save';
                    $scope.title = "Add";
                    $scope.Savebutton=true;
                    $scope.Updatebutton=false;
                    $scope.dept_name=null;
                    $scope.dept_code=null;
                    $scope.selectize_hodProfieId=null;
                    $scope.Phone=null;
                    $('.uk-modal').find('input').trigger('blur');
                };
                $scope.edit_data= function(res){
                    if (typeof res=="undefined") return false;
                    //console.log(res,"messsssssssssss");
                    $scope.title = "Edit";
                    $scope.Updatebutton=true;
                    $scope.Savebutton=false;
                    $scope.supplier_name=res.supplier_name;
                    $scope.contact_number=res.contact_number;
                    $scope.selectize_supplierType=res.supplier_type;
                    $scope.supplier_address=res.supplier_address;
                    $scope.tin_number=res.tin_number;
                    $scope.region=res.region;
                    $scope.id=vm.dt_data.indexOf(res);
                }
       



        }
    );