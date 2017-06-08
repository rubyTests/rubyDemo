angular
    .module('rubycampusApp')
    .controller('setgradingCtrl',
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
                DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Percentage'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Credit Points'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Description'),

            ];

            var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
            
			$scope.refreshTable=function(){
				$http({
				method:'get',
				url: $localStorage.service+'ExamAPI/setGrade',
				headers:{'access_token':$localStorage.access_token}
				}).then(function(return_data){
					vm.dt_data = return_data.data.message;
				});
			}
			
			$scope.refreshTable();
			
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
				if (res){
					// console.log(res,"messsssssssssss");
					$scope.Updatebutton=true;
					$scope.Savebutton=false;
					$scope.grade={id:res.ID,name:res.NAME,marks:res.MINI_PERCENTAGE,credit:res.CREDIT_POINTS,description:res.DESCRIPTION};
				}
			}
			$scope.grade={};
			$scope.saveData= function(){
				$http({
                method:'POST',
                url: $localStorage.service+'ExamAPI/setGrade',
                data: {id:$scope.grade.id,name:$scope.grade.name,percentage:$scope.grade.marks,creditPoints:$scope.grade.credit,description:$scope.grade.description},
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
				$scope.grade={};
			}
			
			$scope.deleteGrade=function(id,$index){
				if(id){
					UIkit.modal.confirm('Are you sure to delete ?', function(e) {
						if(id){
							$http({
							method : "DELETE",
							url : $localStorage.service+"ExamAPI/setGrade",
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