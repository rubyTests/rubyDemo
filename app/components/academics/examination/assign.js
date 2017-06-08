angular
    .module('rubycampusApp')
    .controller('assignCtrl',
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
                DTColumnDefBuilder.newColumnDef(2).withTitle('Assessment'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Course'),

            ];

            var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
            
            $scope.get_id = [];
            $scope.course_data = [];
            $resource('app/components/academics/examination/assign.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                });
                
			$http({
			method:'get',
			url: $localStorage.service+'ExamAPI/setAssessment',
			headers:{'access_token':$localStorage.access_token}
			}).then(function(return_data){
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
				
			$http({
			method:'get',
			url: $localStorage.service+'AcademicsAPI/fetchCourseData',
			headers:{'access_token':$localStorage.access_token}
			}).then(function(return_data){
				$scope.course_data.push(return_data.data.data);
			});
			
			$scope.selectize_course_options = $scope.course_data;
			$scope.selectize_course_config = {
				create: false,
				maxItems: 1,
				placeholder: 'Select Course',
				valueField: 'ID',
				labelField: 'NAME',
				onInitialize: function(val){
					console.log(val);
				}
			};
			
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
				
			// Advanced selects

            // var course_data = $scope.selectize_course_options = [
                // {id: 1, title: 'Computer Science and Engineering'},
                // {id: 2, title: 'Mechanical Engineering'},
                // {id: 3, title: 'Electrical Communication Engineering'},
                // {id: 4, title: 'Electrical and Electronics Engineering'},
                // {id: 5, title: 'Aeronautical Engineering'},
                // {id: 6, title: 'Information Technology Engineering'},
                // {id: 7, title: 'Civil Engineering'},
                // {id: 8, title: 'Marine Engineering'}
            // ];

            $scope.selectize_course_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                maxItems: null,
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                create: false,
                placeholder: 'Course Name',
                render: {
                    option: function(course_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(course_data.NAME) + '</span><br>' +
                            '</div>';
                    }
                    // item: function(planets_data, escape) {
                    //     return '<div class="item"><a href="' + escape(planets_data.url) + '" target="_blank">' + escape(planets_data.title) + '</a></div>';
                    // }
                }
				// onInitialize: function(val){
					// selectize.on('change',function(values){
						// console.log(values,"values");
					// })
				// }
            };
				
                 $scope.openModel = function() {
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
					$http({
					method:'get',
					url: $localStorage.service+'ExamAPI/setAssignExam',
					headers:{'access_token':$localStorage.access_token}
					}).then(function(return_data){
						$scope.assignExam = {id:res.ID,name:res.NAME,assessmentId:res.ASSESSMENT_ID,courseId:res.COURSE_ID,startDate:res.START_DATE,endDate:res.END_DATE};
					});
                }
       
			//$scope.name=$scope.selectize_weightage+" "+$scope.selectize_course;
			
			$scope.refreshTable=function(){
				$http({
				method:'get',
				url: $localStorage.service+'ExamAPI/setAssignExam',
				headers:{'access_token':$localStorage.access_token}
				}).then(function(return_data){
					vm.dt_data = return_data.data.message;
				});
			}
			
			$scope.refreshTable();
			
			$scope.assignExam={};
			$scope.saveData= function(){
				$http({
				method:'POST',
				url: $localStorage.service+'ExamAPI/setAssignExam',
				data: {id:$scope.assignExam.id,name:$scope.assignExam.name,assessmentId:$scope.assignExam.assessmentId,courseId:$scope.assignExam.courseId,startDate:assignExam.startDate,endDate:assignExam.endDate},
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
				$scope.assignExam={};
			}
			
			$scope.deleteAssignExam=function(id,$index){
				if(id){
					UIkit.modal.confirm('Are you sure to delete ?', function(e) {
						if(id){
							$http({
							method : "DELETE",
							url : $localStorage.service+"ExamAPI/setAssignExam",
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