angular
    .module('rubycampusApp')
    .controller('stuApplyLeaveCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$localStorage,$filter) {
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
                DTColumnDefBuilder.newColumnDef(1).withTitle('Reason'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Date'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('No Of Leaves'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Status')

            ];

			// date range
            var $dp_start = $('#uk_dp_start'),
                $dp_end = $('#uk_dp_end');

            var start_date = UIkit.datepicker($dp_start, {
                format:'DD.MM.YYYY'
            });

            var end_date = UIkit.datepicker($dp_end, {
                format:'DD.MM.YYYY'
            });

            $dp_start.on('change',function() {
                end_date.options.minDate = $dp_start.val();
            });

            $dp_end.on('change',function() {
                start_date.options.maxDate = $dp_end.val();
            });
			
            var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
             
			$scope.openModel = function() {
				//$scope.buttonStatus='Save';
				$scope.Savebutton=true;
				$scope.Updatebutton=false;
				$('.uk-modal').find('input').trigger('blur');
			};
			
			$scope.duration_config = {
                create: false,
                maxItems: 1
            };
            $scope.durationsdata=['Full Day', 'Half Day', 'Multiple Days'];
			
			$scope.edit_data= function(res){
				if (typeof res=="undefined") return false;
				//console.log(res,"messsssssssssss");
				$scope.Updatebutton=true;
				$scope.Savebutton=false;
				$scope.Fromdate = $filter('date')(res.STARTDATE,'dd.MM.yyyy');
				$scope.Todate = $filter('date')(res.ENDDATE,'dd.MM.yyyy');
				// $scope.exam={id:res.ID,name:res.NAME,termId:res.SETTERM_ID,startDate:res.STARTDATE,endDate:res.ENDDATE};
				$scope.exam={id:res.ID,name:res.NAME,termId:res.SETTERM_ID,startDate:$scope.Fromdate,endDate:$scope.Todate};
			}
			
			$scope.refreshTable=function(){
				$http({
				method:'get',
				url: $localStorage.service+'StuAttendanceAPI/stuApplyLeave',
				params:{profileId:$localStorage.userProfile_id},
				headers:{'access_token':$localStorage.access_token}
				}).then(function(return_data){
					vm.dt_data = return_data.data.message;
				});
			}
			
			$scope.refreshTable();
			
			$scope.leave={};
			$scope.saveData= function(){
				$scope.startDate = $filter('date')($scope.leave.startDate,'yyyy-MM-dd');
				$scope.endDate = $filter('date')($scope.leave.endDate,'yyyy-MM-dd');
				$http({
				method:'POST',
				url: $localStorage.service+'StuAttendanceAPI/stuApplyLeave',
				data: {profileId:$localStorage.userProfile_id,duration:$scope.leave.duration,reason:$scope.leave.reason,startDate:$scope.startDate,endDate:$scope.endDate,userId:$localStorage.userProfile_id},
				headers:{'Content-Type':'application/json; charset=UTF-8','access_token':$localStorage.access_token}
				}).then(function(response){
					console.log(response,"response");
					if(response.data.status==true){
						UIkit.notify({
							message : response.data.message,
							status  : 'success',
							timeout : 2000,
							pos     : 'top-center'
						});
						$scope.refreshTable();
						$scope.clearData();
					}
				});
			}
			
			$scope.clearData=function(){
				$scope.leave={};
			}
			
			$scope.deleteLeave=function(id,$index){
				if(id){
					UIkit.modal.confirm('Are you sure to delete ?', function(e) {
						if(id){
							$http({
							method : "DELETE",
							url : $localStorage.service+"StuAttendanceAPI/stuApplyLeave",
							params : {id : id},
							headers:{'access_token':$localStorage.access_token}
							}).then(function mySucces(response) {
								UIkit.notify({
									message : response.data.message,
									status  : 'success',
									timeout : 2000,
									pos     : 'top-center'
								});
								$scope.refreshTable();
								$scope.viewData.splice($index, 1);
							},function myError(response) {
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