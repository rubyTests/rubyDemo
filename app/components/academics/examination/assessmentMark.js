angular
    .module('rubycampusApp')
    .controller('assessmentMarkCtrl', [
        '$compile',
        '$scope',
        '$window',
        '$timeout',
        '$resource',
        '$http',
        '$localStorage',
        function ($compile,$scope,$window,$timeout,$resource,$http,$localStorage) {
			//$scope.assessmentList={termId:'',createExam:'',assessmentId:'',course:'',batch:'',subject:''};
			$scope.assessmentList={};
			// $resource('app/components/academics/examination/marks.json')
                // .query()
                // .$promise
                // .then(function(dt_data) {
                    // $scope.dt_data = dt_data;
                // });
				
			
			$scope.getStuData = function(){
				//console.log($scope.assessmentList.course,'data');
				//console.log("stuData");
				$scope.dt_data='';
				if($scope.assessmentList.termId==undefined || $scope.assessmentList.termId==''){
					//console.log('null');
				}else if($scope.assessmentList.createExam==undefined || $scope.assessmentList.createExam==''){
					//console.log('null');
				}else if($scope.assessmentList.assessmentId==undefined || $scope.assessmentList.assessmentId==''){
					//console.log('null');
				}else if($scope.assessmentList.course==undefined || $scope.assessmentList.course==''){
					//console.log('null');
				}else if($scope.assessmentList.batch==undefined || $scope.assessmentList.batch==''){
					//console.log('null');
				}else if($scope.assessmentList.subject==undefined || $scope.assessmentList.subject==''){
					//console.log('null');
				}else{
					$http.get($localStorage.service+'ExamAPI/studentDetails',{params:{termId:$scope.assessmentList.termId,createExam:$scope.assessmentList.createExam,assessmentId:$scope.assessmentList.assessmentId,course:$scope.assessmentList.course,batch:$scope.assessmentList.batch,subject:$scope.assessmentList.subject,},headers:{'access_token':$localStorage.access_token}})
					.success(function(data){
						//console.log(data.message,"studentDetails");
						$scope.dt_data = data.message;
					});
				}
			}
			
			$scope.courseData=[];
			$scope.batchData=[];
			$scope.getSub_id = [];
			$http.get($localStorage.service+'AcademicsAPI/courseDetail',{headers:{'access_token':$localStorage.access_token}})
			.success(function(data){
				$scope.courseData.push(data.message);
			});
			
			$scope.fetchBatch=function(id){
				$http.get($localStorage.service+'AcademicsAPI/fetchbatchDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
				.success(function(batch_data){
					$scope.selectize_batch_options=batch_data.data;
				});
				
				$http.get($localStorage.service+'AcademicsAPI/fetchSubjectDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
				.success(function(return_data){
					$scope.selectize_subject_options = return_data.data;
				});
			}
			
			$scope.selectize_courseNew_options =$scope.courseData;
			$scope.selectize_courseNew_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Course...',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                   selectize.on('change', function(value) {
						$scope.assessmentList.batch='';
						$scope.assessmentList.subject='';
						$scope.getStuData();
						$scope.fetchBatch(value);
						//$scope.fetchSubject(value);
                    });
                    
                }
            };
			
			$scope.selectize_batch_options=[];
            $scope.selectize_batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Batch...',
                valueField: 'ID',
                labelField: 'NAME',
				searchField: 'NAME',
				onInitialize: function(selectize){
                   selectize.on('change', function(value) {
					   $scope.getStuData();
                    });
                }
            };

			$scope.get_id = [];
			$http({
			method:'get',
			url: $localStorage.service+'ExamAPI/setTerm',
			headers:{'access_token':$localStorage.access_token}
			}).then(function(return_data){
				//console.log(return_data.data.message,'return_data');
				$scope.get_id.push(return_data.data.message);
			});
			
			$scope.get_id1 = [];
			$scope.fetchTerm=function(id){
				$http({
				method:'get',
				url: $localStorage.service+'ExamAPI/termExam',
				params:{termId:id},
				headers:{'access_token':$localStorage.access_token}
				}).then(function(return_data){
					// $scope.get_id1.push(return_data.data.message);
					$scope.selectize_exam_options = return_data.data.message;
				});
			}
			
			$scope.get_id2 = [];
			$scope.fetchAssessment=function(id){
				$http({
				method:'get',
				url: $localStorage.service+'ExamAPI/examAssessment',
				params:{assessmentId:id},
				headers:{'access_token':$localStorage.access_token}
				}).then(function(return_data){
					// $scope.get_id1.push(return_data.data.message);
					$scope.selectize_assessment_options = return_data.data.message;
				});
			}
			
			$scope.selectize_term_options = $scope.get_id;
			$scope.selectize_term_config = {
				create: false,
				maxItems: 1,
				placeholder: 'Term',
				valueField: 'ID',
				labelField: 'NAME',
				searchField: 'NAME',
				onInitialize: function(selectize){
					selectize.on('change', function(val) {
						$scope.fetchTerm(val);
						$scope.getStuData();
                    });
				}
			};

			// $scope.selectize_exam_options = $scope.get_id1;
			$scope.selectize_exam_options = [];
			$scope.selectize_exam_config = {
				create: false,
				maxItems: 1,
				placeholder: 'Exam',
				valueField: 'ID',
				labelField: 'NAME',
				searchField: 'NAME',
				onInitialize: function(selectize){
					selectize.on('change', function(val) {
						$scope.fetchAssessment(val);
						$scope.getStuData();
                    });
				}
			};
			
			$scope.selectize_assessment_options = [];
			$scope.selectize_assessment_config = {
				create: false,
				maxItems: 1,
				placeholder: 'Assessment',
				valueField: 'ID',
				labelField: 'NAME',
				searchField: 'NAME',
				onInitialize: function(selectize){
					selectize.on('change', function(val) {
						$scope.getStuData();
                    });
				}
			};
			
			$scope.selectize_subject_options = [];
			$scope.selectize_subject_config = {
				create: false,
				maxItems: 1,
				placeholder: 'Subject',
				valueField: 'COU_ID',
				labelField: 'COURSE_NAME',
				searchField: 'COURSE_NAME',
				onInitialize: function(selectize){
					selectize.on('change', function(val) {
						$scope.getStuData();
                    });
				}
			};
			
            $scope.saveData = function(){
				// console.log($scope.dt_data,"data");
				
				$http({
				method:'POST',
				url: $localStorage.service+'ExamAPI/studentDetails',
				data: {markList:$scope.dt_data,assessmentId:$scope.assessmentList.assessmentId,batch:$scope.assessmentList.batch,subject:$scope.assessmentList.subject},
				headers:{'Content-Type':'application/json; charset=UTF-8','access_token':$localStorage.access_token}
				}).then(function(response){
					if(response.data.status==true){
						UIkit.notify({
							message : response.data.message,
							status  : 'success',
							timeout : 2000,
							pos     : 'top-center'
						});
						$scope.assessmentList={};
						$scope.dt_data='';
					}
				});
				
			}
            $scope.backBtn = function(){
                $window.history.back();
            }
        }
    ]);