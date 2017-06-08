angular
    .module('rubycampusApp')
    .controller('setweightageCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$localStorage) {
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
                            type: 'number',
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
                DTColumnDefBuilder.newColumnDef(1).withTitle('Assessment'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Weightage'),

            ];

            var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
            
            $scope.get_id = [];
                
			$http({
			method:'get',
			url: $localStorage.service+'ExamAPI/setAssessment',
			headers:{'access_token':$localStorage.access_token}
			}).then(function(return_data){
				//vm.dt_data = return_data.data.message;
				$scope.get_id.push(return_data.data.message);
			});
			$scope.selectize_assessment_options = $scope.get_id;
			$scope.selectize_assessment_config = {
				create: false,
				maxItems: 1,
				placeholder: 'Select Assessment',
				valueField: 'ID',
				labelField: 'NAME',
				onInitialize: function(val){
					console.log(val);
				}
			};
			
			$scope.openModel = function(){
				//$scope.buttonStatus='Save';
				$scope.Savebutton=true;
				$scope.Updatebutton=false;
				$('.uk-modal').find('input').trigger('blur');
			};
			$scope.edit_data= function(res){
				if (typeof res=="undefined") return false;
				//console.log(res,"messsssssssssss");
				$scope.Updatebutton=true;
				$scope.Savebutton=false;
				$scope.weightage={id:res.ID,assessmentId:res.ASSESSMENT_ID,credit:res.WEIGHTAGE};
			}
			
			$scope.refreshTable=function(){
				$http({
				method:'get',
				url: $localStorage.service+'ExamAPI/setWeightage',
				headers:{'access_token':$localStorage.access_token}
				}).then(function(return_data){
					vm.dt_data = return_data.data.message;
				});
			}
			
			$scope.refreshTable();
			
			$scope.weightage={};
			$scope.saveData= function(){
				$http({
				method:'POST',
				url: $localStorage.service+'ExamAPI/setWeightage',
				data: {id:$scope.weightage.id,assessmentId:$scope.weightage.assessmentId,weightage:$scope.weightage.credit},
				headers:{'Content-Type':'application/json; charset=UTF-8','access_token':$localStorage.access_token}
				}).then(function(response){
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
				$scope.weightage={};
			}
			
			$scope.deleteWeightage=function(id,$index){
				if(id){
					UIkit.modal.confirm('Are you sure to delete ?', function(e) {
						if(id){
							$http({
							method : "DELETE",
							url : $localStorage.service+"ExamAPI/setWeightage",
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