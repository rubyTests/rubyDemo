angular
    .module('rubycampusApp')
    .controller('studentviewCtrl',
        function($rootScope,$compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$localStorage,$state) {

            $rootScope.toBarActive = true;
            $scope.$on('$destroy', function() {
                $rootScope.toBarActive = false;
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
                            type: 'number',
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
                .withButtons([
                    // {
                    //     extend:    'copyHtml5',
                    //     text:      '<i class="uk-icon-files-o"></i> Copy',
                    //     titleAttr: 'Copy'
                    // },
                    {
                        extend:    'print',
                        text:      '<i class="uk-icon-print"></i> Print',
                        titleAttr: 'Print'
                    },
                    {
                        extend:    'excelHtml5',
                        text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
                        titleAttr: ''
                    },
                    // {
                    //     extend:    'csvHtml5',
                    //     text:      '<i class="uk-icon-file-text-o"></i> CSV',
                    //     titleAttr: 'CSV'
                    // },
                    {
                        extend:    'pdfHtml5',
                        text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
                        titleAttr: 'PDF'
                    }
                ])
                 .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });
            // $resource('app/components/student/student_profile_view.json')
                // .query()
                // .$promise
                // .then(function(dt_data) {
                    // vm.dt_data = dt_data;
                // });
				
				$http.get($localStorage.service+'ProfileAPI/studentProfileDetails',{headers: {'access_token':$localStorage.access_token} })
				.success(function(data){
					// console.log(data.result,"data");
					vm.dt_data=data.result;
				}).error(function(err){
				});
				
				$scope.adminEditProfile=function(stuId){
					if(stuId){
						//console.log(stuId,"stuId");
						$localStorage.stuId=stuId;
						$localStorage.mode='edit'
						$state.go('restricted.student.admissionEdit');
					}
				}
                $scope.deleteStudents=function(id,$index){
                $http({
                    method : "get",
                    url : $localStorage.service+"AcademicsAPI/courseDetailCheck",
                    params : {id : id},
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function mySucces(response) {
                        if(response.data.status==true){
                            if(id){
                                UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                                    if(id){
                                        $http({
                                        method : "DELETE",
                                        url : $localStorage.service+"AcademicsAPI/courseDetail",
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
                                                $scope.viewData.splice($index, 1);
                                                $scope.refreshTable();
                                            }
                                            
                                        },function myError(response) {
                                        })
                                    }
                                },function(){
                                     //console.log("false");
                                    $scope.refreshTable();
                                }, {
                                    labels: {
                                        'Ok': 'Ok'
                                    }
                                });
                            }

                        }
                    },function myError(response) {
                        UIkit.modal.alert(response.data.message);
                    })
                }
        }
    );