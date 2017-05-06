angular
    .module('rubycampusApp')
    .controller('storeItemViewCtrl',
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
                DTColumnDefBuilder.newColumnDef(1).withTitle('Item Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Item Category'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Store Name'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Quantity'),
                DTColumnDefBuilder.newColumnDef(5).withTitle('Unit Price'),
            ];

            var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
            
            $scope.store_name = [];
            $resource('app/components/inventory/storeItem.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                });
            $resource('app/components/transport/routeDetail.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.store_name.push(dt_data);
                });    
				$scope.selectize_store_options = $scope.store_name;
                $scope.selectize_store_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Store',
					valueField: 'id',
                    labelField: 'name',
					onInitialize: function(val){
                        console.log(val);
                    }
                };
			
			$scope.itemCategory=[];
			$resource('app/components/transport/vehicleDetail.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.itemCategory.push(dt_data);
                });
				
				$scope.selectize_itemCategory_options = $scope.itemCategory;
				$scope.selectize_itemCategory_config = {
					create: false,
                    maxItems: 1,
                    placeholder: 'Item Category',
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
                    console.log(res,"messsssssssssss");
                    $scope.title = "Edit";
                    $scope.Updatebutton=true;
                    $scope.Savebutton=false;
                    $scope.item_name=res.item_name;
                    $scope.selectize_itemCategory=res.item_category;
                    $scope.selectize_store=res.store_name;
                    $scope.quantity=res.quantity;
                    $scope.price=res.price;
                    $scope.id=vm.dt_data.indexOf(res);
                }
       



        }
    );