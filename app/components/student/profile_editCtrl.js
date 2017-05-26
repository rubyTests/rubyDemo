angular
    .module('rubycampusApp')
    .controller('studentprofile_edit', [
        '$rootScope',
        '$scope',
        'user_data',
        '$stateParams',
        '$filter',
		'$http',
		'$localStorage',
		'$state',
		'$timeout',
        // 'groups_data',
        function ($rootScope,$scope,user_data,$stateParams,$filter,$http,$localStorage,$state,$timeout) {
            // console.log($stateParams,'stateParams');
			//console.log($stateParams.stu_id,"ID");
            $scope.CountryLIST=[];
			$scope.NationalityLIST=[];
			
			$http.get($localStorage.service+'ProfileAPI/parentsDetails',{params:{id:$stateParams.stu_id},headers: {'access_token':$localStorage.access_token} })
			.success(function(data){
				$timeout(function(){
					$scope.user_data=data.result[0].user_detail;
					console.log($scope.user_data,"data")
					$scope.profileId=$scope.user_data.id;
					$scope.parents_data=data.result[0].user_parents;
					$scope.pre_edu=data.result[0].pre_edu;
				},100);
			}).error(function(err){
			});
			
			$timeout(function(){
				var $formValidate = $('#user_edit_form');
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
			},500)
			
			$timeout(function(){
				// date range
				var $dp_start = $('#uk_dp_start'),
				$dp_end = $('#uk_dp_end');

				var start_date = UIkit.datepicker($dp_start, {
					format:'DD.MM.YYYY'
				});

				var end_date = UIkit.datepicker($dp_end, {
					format:'DD.MM.YYYY'
				});
				
				// $dp_start.on('change',function() {
					// //end_date.options.maxDate = $dp_start.val();
					// var customeDate=$dp_start.val().split(".");
					// end_date.options.maxDate = parseInt(customeDate[0])-1+"."+customeDate[1]+"."+customeDate[2];
				// });

				// $dp_end.on('change',function() {
					// start_date.options.minDate = $dp_end.val();
				// });
			},600);
			
			$scope.selectize_blood_options = ["O+ve", "A+ve","A+ve","B-ve","B+ve","O-ve"];
            $scope.selectize_blood_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Blood Group'
            };
            $scope.selectize_cat_options = ["Category 1", "Category 2","Category 3"];
            $scope.selectize_cat_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Category'
            };
			
			$scope.selectize_stuType_data =['Day-scholar','Hostel']
            $scope.selectize_styType_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Student Type'
            };
			
			$scope.selectize_studentLive_options = ["Parents", "Father", "Mother","Guardian"];
            $scope.selectize_studentLive_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Lives With'
            };
			
            // user role
            $scope.user_role_config = {
                valueField: 'value',
                labelField: 'title',
                create: false,
                maxItems: 1,
                placeholder: 'Select...'
            };

            $scope.user_role_options = [
                {
                    "value": "admin",
                    "title": "Admin"
                },
                {
                    "value": "super_admin",
                    "title": "Super Admin"
                },
                {
                    "value": "editor",
                    "title": "Editor"
                },
                {
                    "value": "author",
                    "title": "Author"
                },
                {
                    "value": "none",
                    "title": "None"
                }
            ];
			$scope.parVal=[];
			// $scope.user_data={};
			// $scope.parents_data={};
			// $scope.pre_edu={};
			$scope.updateValue=function(){
				// console.log($scope.user_data,"user_data");
				// console.log($scope.parents_data,"parents_data");
				// console.log($scope.pre_edu,"pre_edu");
				//console.log($('.fileinput-preview').find('img').attr('src'));
				if($('.fileinput-preview').find('img').attr('src')==undefined){
					$scope.user_data.filename=$('.fileinput-new').find('img').attr('src');
					if($scope.user_data.filename==undefined){
						$scope.user_data.filename="";
					}
				}else{
					$scope.user_data.filename=$('.fileinput-preview').find('img').attr('src');
				}
				//console.log($scope.user_data.filename,"file");
				$http({
                method:'POST',
                url: $localStorage.service+'ProfileAPI/profileEdit',
                data: {profile:$scope.user_data,pre_edu:$scope.pre_edu,parents:$scope.parents_data},
				headers:{'Content-Type':'application/json; charset=UTF-8','access_token':$localStorage.access_token}
                }).then(function(response){
                    //console.log(response,"student");
					if(response.data.status==true){
						UIkit.notify({
							message : response.data.message,
							status  : 'success',
							timeout : 2000,
							pos     : 'top-center'
						});
						$state.go('restricted.student.student_list');
					}
                });
				
			}
			
			$http.get($localStorage.service+'InstitutionAPI/country',{headers:{'access_token':$localStorage.access_token}})
            .success(function(country_list){
                $scope.CountryLIST.push(country_list.data);
            });
			
			$scope.selectize_country_options = $scope.CountryLIST;
            $scope.selectize_country_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Country',
                valueField: 'ID',
                labelField: 'NAME',
				searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        
                    });
                }
            };
			
			$http.get($localStorage.service+'SettingAPI/Nationality',{headers:{'access_token':$localStorage.access_token}})
            .success(function(nationality_list){
                $scope.NationalityLIST.push(nationality_list.data);
            });
			
			$scope.selectize_nation_options = $scope.NationalityLIST;
            $scope.selectize_nation_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Nationality',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        //console.log(value);
                    });
                }
            };
			
			$scope.sibling_courseId=[];
			$http.get($localStorage.service+'AcademicsAPI/fetchCourseData',{headers:{'access_token':$localStorage.access_token}})
			.success(function(course_data){
				$scope.sibling_courseId.push(course_data.data);
			});
			
			$scope.sibling_courseId_options =$scope.sibling_courseId;
			$scope.sibling_courseId_config = {
				create: false,
				maxItems: 1,
				placeholder: 'Course',
				valueField: 'ID',
				labelField: 'NAME',
				onInitialize: function(selectize){
					selectize.on('change', function(value) {
						//console.log(value);
						$scope.siblingBatchData(value);
					});
				}
			};
			
			$scope.siblingBatchData=function(id){
				//console.log(id,"deptId")
				$http.get($localStorage.service+'AcademicsAPI/fetchbatchDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
				.success(function(batch_data){
					// console.log(batch_data.data,"batch");
					$scope.sibling_batchId_options=batch_data.data;
				});
			}
			
			$scope.sibling_batchId_options =[];
			$scope.sibling_batchId_config = {
				create: false,
				maxItems: 1,
				placeholder: 'Batch',
				valueField: 'ID',
				labelField: 'NAME',
				onInitialize: function(selectize){
					selectize.on('change', function(value) {
						//console.log(value);
						$scope.siblingProfile(value);
					});
				}
			};
			
			$scope.siblingProfile=function(id){
				$http.get($localStorage.service+'ProfileAPI/studentSiblingDetails',{params:{batchId:id},headers:{'access_token':$localStorage.access_token}})
				.success(function(Studata){
					//console.log(Studata.result,"batch");
					$scope.sibling_studentId_options=Studata.result;
				});
			}
			
			$scope.sibling_studentId_options =[];
			$scope.sibling_studentId_config = {
				create: false,
				maxItems: 1,
				placeholder: 'Sibling',
				valueField: 'ID',
				labelField: 'FIRSTNAME',
				searchField: 'FIRSTNAME',
				onInitialize: function(selectize){
					selectize.on('change', function(value) {
						console.log(value);
					});
				}
			};

        }
    ])
;