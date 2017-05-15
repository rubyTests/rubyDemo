angular
    .module('rubycampusApp')
    .controller('vacateCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter,$http,$localStorage) {
            $scope.btnStatus="Save";
			$scope.vacate={id:'',selectize_usertype:'',selectize_employee:'',selectize_student:'',vacate_date:''};
			var vm = this;
            $scope.viewData=[];
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
                        }
                    ]
                })
                .withButtons([
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

                var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});

                $scope.selectize_usertype_options = ['Student','Employee'];
                $scope.selectize_usertype_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Resident'
                };

               
				$scope.empName =[];
                $http.get($localStorage.service+'HostelAPI/allocateEmployeeDetail',{headers:{'access_token':$localStorage.access_token}})
                .success(function(user_data){
                    $scope.empName.push(user_data.data);
                });
                $scope.selectize_employee_options =$scope.empName;
                $scope.selectize_employee_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Employee',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                        });
                    }
                };
                $scope.studentName =[];
                $http.get($localStorage.service+'HostelAPI/allocateStudentDetail',{headers:{'access_token':$localStorage.access_token}})
                .success(function(user_data){
                    $scope.studentName.push(user_data.result);
                });
                $scope.selectize_student_options =$scope.studentName;
                $scope.selectize_student_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Student',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                        });
                    }
                };

                 // $resource('app/components/hostel/alloacation.json')
                // .query()
                // .$promise
                // .then(function(allac_data) {
                    // $scope.viewData=allac_data;
                // });
				
				// Table View 
				$http({
				method:'get',
				url: $localStorage.service+'HostelAPI/vacate',
				headers:{'access_token':$localStorage.access_token}
				}).then(function(return_data){
					console.log(return_data.data.message,"msg");
					$scope.viewData=return_data.data.message;
				});
				
				$scope.refreshTable=function(){
					$http({
					method:'get',
					url: $localStorage.service+'HostelAPI/vacate',
					headers:{'access_token':$localStorage.access_token}
					}).then(function(return_data){
						console.log(return_data.data.message,"msg");
						$scope.viewData=return_data.data.message;
					});
				}

                $scope.addVacate=function(){
                    // $scope.selectize_usertype='';
                    // $scope.selectize_employee='';
                    // $scope.selectize_student='';
                    // $scope.vacate_date='';
					//console.log($scope.vacate);
					
					if($scope.vacate.selectize_usertype=='Student'){
						$scope.profileId=$scope.vacate.selectize_student
					}else{
						$scope.profileId=$scope.vacate.selectize_employee
					}
					
					$http({
                    method:'POST',
                    url: $localStorage.service+'HostelAPI/vacate',
                    data: {
                        'id' : $scope.vacate.id,
                        'type' : $scope.vacate.selectize_usertype,
                        'profileId' : $scope.profileId,
                        'date' : $scope.vacate.vacate_date
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        if(return_data.data.status==true){
                            UIkit.modal("#modal_overflow").hide();
                            UIkit.notify({
                                message : return_data.data.message,
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });
                            $scope.refreshTable();
                        }
                    });
					
                    //$('.uk-modal').find('input').trigger('blur');
                }
                $scope.editVacate=function(data){
                    $scope.btnStatus="Update";
                    if (data) {
						if(data.RESIDENT_TYPE=='Student'){
							$scope.vacate={id:data.ID,selectize_usertype:data.RESIDENT_TYPE,selectize_employee:'',selectize_student:data.PROFILE_ID,vacate_date:data.DATE};
						}else{
							$scope.vacate={id:data.ID,selectize_usertype:data.RESIDENT_TYPE,selectize_employee:data.PROFILE_ID,selectize_student:'',vacate_date:data.DATE};
						}
						//$scope.vacate={id:'',selectize_usertype:'',selectize_employee:'',selectize_student:'',vacate_date:data.DATE};
						//$scope.getId=data.ID;
                        // $scope.selectize_usertype=data.type;
                        // $scope.selectize_employee=data.name;
                        // $scope.selectize_student=data.name;
                        // $scope.vacate_date=data.reg_date;
                    }
                }
        }
    );