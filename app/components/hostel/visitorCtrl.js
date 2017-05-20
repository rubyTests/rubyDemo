angular
    .module('rubycampusApp')
    .controller('visitorCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter,$http,$localStorage) {
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

                $scope.clearValidation=function(){
                    $('#form_validation').parsley().reset();
                }
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

                $scope.selectize_employee_options = ['Vijay Raj','Karthik Selvam','Mani Vannan','Senthil Kumar','Mani Kandan','Junaid Muhammed'];
                $scope.selectize_employee_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Employee'
                };
                $scope.selectize_student_options = ['Vijay Raj','Karthik Selvam','Mani Vannan','Senthil Kumar','Mani Kandan','Junaid Muhammed'];
                $scope.selectize_student_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Student'
                };

                 // $resource('app/components/hostel/alloacation.json')
                // .query()
                // .$promise
                // .then(function(allac_data) {
                    // $scope.viewData=allac_data;
                // });
				
				// Dept course and batch details start
				$scope.deptData=[];
				$scope.course_data=[];
				$scope.batch_data=[];
			
				$http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
				.success(function(dept_data){
					$scope.deptData.push(dept_data.message);
				});
				
				$scope.selectize_deptId_options =$scope.deptData;
				$scope.selectize_deptId_config = {
					create: false,
					maxItems: 1,
					placeholder: 'Department',
					valueField: 'ID',
					labelField: 'NAME',
					onInitialize: function(selectize){
						selectize.on('change', function(value) {
							if($scope.visitor.selectize_usertype=='Student'){
								$scope.courseData(value);
							}else{
								$scope.getEmployeeList(value);
							}
						});
					}
				};
				
				$scope.courseData=function(id){
					$http.get($localStorage.service+'AcademicsAPI/fetchcourseDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
					.success(function(course_data){
						$scope.selectize_courseId_options=course_data.data;
					});
				}
				
				$scope.selectize_courseId_options =[];
				$scope.selectize_courseId_config = {
					create: false,
					maxItems: 1,
					placeholder: 'Course',
					valueField: 'ID',
					labelField: 'NAME',
					onInitialize: function(selectize){
						selectize.on('change', function(value) {
							$scope.batchData(value);
						});
					}
				};
				
				$scope.batchData=function(id){
					$http.get($localStorage.service+'AcademicsAPI/fetchbatchDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
					.success(function(batch_data){
						$scope.selectize_batchId_options=batch_data.data;
					});
				}
				
				$scope.selectize_batchId_options =[];
				$scope.selectize_batchId_config = {
					create: false,
					maxItems: 1,
					placeholder: 'Batch',
					valueField: 'ID',
					labelField: 'NAME',
					onInitialize: function(selectize){
						selectize.on('change', function(value) {
							//console.log(value);
							$scope.getStudentList(value);
						});
					}
				};
				
				$scope.getEmployeeList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'AcademicsAPI/fetchTeacherDetailList',
                    params: {
                        'id' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        $scope.selectize_employee_options=return_data.data.data;
                    });
                }
				
				$scope.selectize_employee_options =[];
                $scope.selectize_employee_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Employee',
                    valueField: 'EMP_ID',
                    labelField: 'EMP_ANME',
                    searchField: 'EMP_ANME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                        });
                    }
                };
				
				// $scope.studentName =[];
                // $http.get($localStorage.service+'HostelAPI/allocateStudentDetail',{headers:{'access_token':$localStorage.access_token}})
                // .success(function(user_data){
                    // $scope.studentName.push(user_data.result);
                // });
				
				$scope.getStudentList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'HostelAPI/allocateStudentDetail',
                    params: {
                        'batchId' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        $scope.selectize_student_options=return_data.data.result;
                    });
                }
				
                $scope.selectize_student_options =[];
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

				// Visitors Details get,add and edit
				$http({
				method:'get',
				url: $localStorage.service+'HostelAPI/visitors',
				headers:{'access_token':$localStorage.access_token}
				}).then(function(return_data){
					$scope.viewData=return_data.data.message;
				});
				$scope.refreshTable=function(){
					$http({
					method:'get',
					url: $localStorage.service+'HostelAPI/visitors',
					headers:{'access_token':$localStorage.access_token}
					}).then(function(return_data){
						$scope.viewData=return_data.data.message;
					});
				}
				
                $scope.addAllocation=function(){
                    $scope.btnStatus="Save";
					$scope.wizard={};
					$scope.visitor={};
					$scope.id='';
                    // $scope.selectize_usertype='';
                    // $scope.selectize_employee='';
                    // $scope.selectize_student='';
                    // $scope.relation='';
                    // $scope.visitorname='';
                    // $scope.visit_date='';
                    // $scope.visit_intime='';
                    // $scope.visit_outtime='';
                    $('.uk-modal').find('input').trigger('blur');
                }
                $scope.editAllocation=function(data){
                    $scope.btnStatus="Update";
                    if (data) {
                        $scope.id=data.ID;
                        console.log($scope.id,'$scope.id');
						if(data.RESIDENT_TYPE=='Student'){
							$scope.wizard={dept_id:data.deptId,course_id:data.courseId,batchId:data.batchId};
							$scope.visitor={selectize_usertype:data.RESIDENT_TYPE,selectize_student:data.PROFILE_ID,visitorname:data.visitorName,relation:data.RELATION,visit_date:data.DATE,visit_intime:data.INTIME,visit_outtime:data.OUTTIME};
						}else{
							$scope.wizard={dept_id:data.deptId};
							$scope.visitor={selectize_usertype:data.RESIDENT_TYPE,selectize_employee:data.PROFILE_ID,visitorname:data.visitorName,relation:data.RELATION,visit_date:data.DATE,visit_intime:data.INTIME,visit_outtime:data.OUTTIME};
						}	    
                    }
                }
				
				$scope.sendData=function(){
					if($scope.visitor.selectize_usertype=='Student'){
						$scope.profileId=$scope.visitor.selectize_student
					}else{
						$scope.profileId=$scope.visitor.selectize_employee
					}
					
					$http({
                    method:'POST',
                    url: $localStorage.service+'HostelAPI/visitors',
                    data: {
                        'id' : $scope.id,
                        'type' : $scope.visitor.selectize_usertype,
                        'profileId' : $scope.profileId,
						'name' : $scope.visitor.visitorname,
						'relation' : $scope.visitor.relation,
                        'date' : $scope.visitor.visit_date,
                        'inTime' : $scope.visitor.visit_intime,
                        'outTime' : $scope.visitor.visit_outtime
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data);
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
                    }, function error(response) {
                        
                    });
				}
				
				$scope.deleteVacate=function(id,$index){
                    if(id){
                        UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                            if(id){
                                $http({
                                method : "DELETE",
                                url : $localStorage.service+"HostelAPI/visitors",
                                params : {id : id},
                                headers:{'access_token':$localStorage.access_token}
                                }).then(function mySucces(response) {
                                    UIkit.notify({
                                        message : response.data.message,
                                        status  : 'success',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                    $scope.viewData.splice($index, 1);
                                    $scope.refreshTable();
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