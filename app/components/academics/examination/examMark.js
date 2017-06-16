angular
    .module('rubycampusApp')
    .controller('examMarkCtrl', [
        '$compile',
        '$scope',
        '$window',
        '$timeout',
        '$resource',
        '$http',
        '$localStorage',
        function ($compile,$scope,$window,$timeout,$resource,$http,$localStorage) {
			//$scope.examMark={termId:'',createExam:'',assessmentId:'',course:'',batch:'',subject:''};
			$scope.examMark={};
			
			$scope.getStuData = function(){
				$scope.dt_data='';
				if($scope.examMark.termId==undefined || $scope.examMark.termId==''){
					//console.log('null');
				}else if($scope.examMark.createExam==undefined || $scope.examMark.createExam==''){
					//console.log('null');
				}else if($scope.examMark.course==undefined || $scope.examMark.course==''){
					//console.log('null');
				}else if($scope.examMark.batch==undefined || $scope.examMark.batch==''){
					//console.log('null');
				}else if($scope.examMark.subject==undefined || $scope.examMark.subject==''){
					//console.log('null');
				}else{
					$http.get($localStorage.service+'ExamAPI/examStuDetails',{params:{termId:$scope.examMark.termId,createExam:$scope.examMark.createExam,course:$scope.examMark.course,batch:$scope.examMark.batch,subject:$scope.examMark.subject,},headers:{'access_token':$localStorage.access_token}})
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
                placeholder: 'Select Course...',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                   selectize.on('change', function(value) {
						$scope.examMark.batch='';
						$scope.examMark.subject='';
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
			
			$scope.selectize_term_options = $scope.get_id;
			$scope.selectize_term_config = {
				create: false,
				maxItems: 1,
				placeholder: 'Select Term',
				valueField: 'ID',
				labelField: 'NAME',
				onInitialize: function(selectize){
					selectize.on('change', function(val) {
						$scope.fetchTerm(val);
						$scope.getStuData();
                    });
				}
			};
			
			$scope.selectize_exam_options = [];
			$scope.selectize_exam_config = {
				create: false,
				maxItems: 1,
				placeholder: 'Select Exam',
				valueField: 'ID',
				labelField: 'NAME',
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
				placeholder: 'Select Subject',
				valueField: 'COU_ID',
				labelField: 'COURSE_NAME',
				onInitialize: function(selectize){
					selectize.on('change', function(val) {
						$scope.getStuData();
                    });
				}
			};
			
            $scope.saveData = function(){
				//console.log($scope.dt_data,"data");
				$http({
				method:'POST',
				url: $localStorage.service+'ExamAPI/examStuDetails',
				data: {markList:$scope.dt_data,createExam:$scope.examMark.createExam,batch:$scope.examMark.batch,subject:$scope.examMark.subject},
				headers:{'Content-Type':'application/json; charset=UTF-8','access_token':$localStorage.access_token}
				}).then(function(response){
					if(response.data.status==true){
						UIkit.notify({
							message : response.data.message,
							status  : 'success',
							timeout : 2000,
							pos     : 'top-center'
						});
						$scope.examMark={};
						$scope.dt_data='';
					}
				});
				
			}
            $scope.backBtn = function(){
                $window.history.back();
            }
        }
    ]);