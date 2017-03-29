angular
    .module('altairApp')
    .controller('routeAllocationCtrl',
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
                DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Stop Name'),
				DTColumnDefBuilder.newColumnDef(3).withTitle('Fare'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Vehicle Name'),
                DTColumnDefBuilder.newColumnDef(5).withTitle('Joining Date'),
            ];
            $scope.vehicle_name = [];
            $resource('app/components/transport/allocation.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                });
            $resource('app/components/transport/vehicleDetail.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.vehicle_name.push(dt_data);
                });    
				$scope.selectize_vehicleName_options = $scope.vehicle_name;
                $scope.selectize_vehicleName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Vehicle Name',
					valueField: 'id',
                    labelField: 'name',
					onInitialize: function(val){
                        console.log(val);
                    }
                };
			
			$scope.stop_name=[];
			$resource('app/components/transport/routeStops.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.stop_name.push(dt_data);
                });    
				$scope.selectize_stopsName_options = $scope.stop_name;
                $scope.selectize_stopsName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Stop Name',
					valueField: 'id',
                    labelField: 'stopName',
					onInitialize: function(val){
                        console.log(val);
                    }
                };
				
			$scope.student_name=[];
			$resource('app/components/student/profile.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.student_name.push(dt_data);
                });    
				$scope.selectize_stdName_options = $scope.student_name;
                $scope.selectize_stdName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Student Name',
					valueField: 'id',
                    labelField: 'firstname',
					onInitialize: function(val){
                        console.log(val);
                    }
                };
				
				
                 $scope.openModel = function() {
                    //$scope.buttonStatus='Save';
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
                    $scope.Updatebutton=true;
                    $scope.Savebutton=false;
                    $scope.dept_name=res.dept_name;
                    $scope.dept_code=res.dept_code;
                    $scope.selectize_hodProfieId=res.HOD_profile_id;
                    $scope.Phone=res.phone1;
                    $scope.id=vm.dt_data.indexOf(res);
                }
       



        }
    );