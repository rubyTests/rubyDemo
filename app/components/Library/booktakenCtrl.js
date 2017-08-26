angular
    .module('rubycampusApp')
    .controller('booktakenCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter,$http,$localStorage) {
            var vm = this;
            //$scope.viewData=[];
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

            $scope.viewData=[];
            $http({
                method:'GET',
                url: $localStorage.service+'LibraryAPI/bookTaken',
				params:{profileId:$localStorage.userProfile_id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                // console.log(return_data,'ViewData');
                $scope.viewData=return_data.data.message;
				angular.forEach($scope.viewData,function(value,key){
					if(value.daysLeft<0){
						$scope.viewData[key].daysV=true;
						$scope.viewData[key].daysLeft=Math.abs(value.daysLeft);
					}else{
						$scope.viewData[key].daysV=false;
						$scope.viewData[key].daysLeft=value.daysLeft
					}
				});
            });
			
			$scope.positiveLookingValue = function(value){
			  return Math.abs($scope.value);
			}

            $scope.deleteBookIssueData=function(id, $index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+'LibraryAPI/lBookIssue',
                            params : {id : id},
                            headers:{'access_token':$localStorage.access_token}
                            }).then(function mySucces(response) {
                                if(response.data.status==true){
                                    UIkit.notify({
                                        message : response.data.message,
                                        status  : 'success',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                }
                                $scope.viewData.splice($index, 1);
                            },function myError(response) {
                              // console.log(response,'response');
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