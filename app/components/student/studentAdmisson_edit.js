angular
    .module('rubycampusApp')
    .controller('studentAdmisson_editCtrl', [
        '$scope',
        'utils',
		'$localStorage',
		'$http',
		'$filter',
		'$state',
		'$timeout',
		'WizardHandler',
        function ($scope,utils,$localStorage,$http,$filter,$state,$timeout,WizardHandler) {
			$scope.CountryLIST=[];
			$scope.NationalityLIST=[];
			$scope.sibling_courseId=[];
			$scope.wizard=[];
			$scope.previous=[];
			$scope.mailling={};
			$scope.permanent={};
			$scope.sibling={};
			$scope.social=[];
			$scope.contact=[];
			$scope.father={};
			$scope.mother={};
			$scope.guardian={};
			
			$timeout(function(){
				var $formValidate = $('#admission_details');
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
				
				var $formValidate = $('#academics_details');
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
				
				var $formValidate = $('#contact_details');
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
				
				var $formValidate = $('#parents_details');
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
				
			},3000)
			
			//if($localStorage.mode=='edit'){
				$scope.checkbox_demo_1;
				$http.get($localStorage.service+'ProfileAPI/parentsDetails',{params:{id:$localStorage.stuId},headers: {'access_token':$localStorage.access_token} })
				.success(function(data){
					$timeout(function(){
						$scope.wizard=data.result[0].user_detail;
						$scope.profileId=$scope.wizard.id;
						$scope.parents_data=data.result[0].user_parents;
						$scope.form_dynamic1=data.result[0].pre_edu;
						$scope.mailling={address:$scope.wizard.mail_address,city:$scope.wizard.mail_city,state:$scope.wizard.mail_state,pincode:$scope.wizard.mail_pincode,country:$scope.wizard.mail_country};
						$scope.permanent={address:$scope.wizard.address,city:$scope.wizard.stu_city,state:$scope.wizard.stu_state,pincode:$scope.wizard.pincode,country:$scope.wizard.country};
						if($scope.wizard.location_Id==$scope.wizard.maillingAddressId){
							$scope.checkbox_demo_1=true;
							$('.motherDetails').find('input').attr('disabled',true);
						}
						$scope.contact={phone:$scope.wizard.wizard_phone,mobile_no:$scope.wizard.mobile_no,email:$scope.wizard.email};
						$scope.social={facebook:$scope.wizard.facebook,google:$scope.wizard.google,linkedin:$scope.wizard.linkedin};
						$scope.sibling={courseId:$scope.wizard.sibling_courseId,batchId:$scope.wizard.sibling_batchId,studentId:$scope.wizard.sibling_id};
						$scope.previous={birthplace:$scope.wizard.birthplace,selectize_blood:$scope.wizard.selectize_blood,selectize_cat:$scope.wizard.selectize_cat,selectize_styType:$scope.wizard.selectize_styType,student_lives:$scope.wizard.student_lives};
						$scope.guardianCon=false;
						$scope.rmBtnGuardian=true;
						angular.forEach(data.result[0].user_parents, function(data) {
							
							if(data.p_relation=="Father"){
								$localStorage.frelationId=data.pPro_id;
								$scope.father={p_first_name:data.p_first_name,relationId:data.pPro_id,first_relation:data.p_relation,p_last_name:data.p_last_name,p_dob:data.p_dob,p_education:data.p_education,occupation:data.occupation,p_income:data.p_income,pr_address:data.pr_address,pr_city:data.pr_city,pr_state:data.pr_state,pr_pincode:data.pr_pincode,country:data.pr_country,p_phone:data.p_phone,p_mobile_no:data.p_mobile_no,p_email:data.p_email,facebook:data.p_facebook,google:data.p_google,linkedin:data.p_linkedin,availabe:data.availabe};
								if(data.availabe=='Y'){
									$scope.checkbox_demo_11=true;
									$('.first_details').show();
								}else{
									$scope.checkbox_demo_11=false;
									$('.first_details').hide();
								}
							}else if(data.p_relation=="Mother"){
								$localStorage.mrelationId=data.pPro_id;
								$scope.mother={p_first_name:data.p_first_name,relationId:data.pPro_id,second_relation:data.p_relation,p_last_name:data.p_last_name,p_dob:data.p_dob,p_education:data.p_education,occupation:data.occupation,p_income:data.p_income,pr_address:data.pr_address,pr_city:data.pr_city,pr_state:data.pr_state,pr_pincode:data.pr_pincode,country:data.pr_country,p_phone:data.p_phone,p_mobile_no:data.p_mobile_no,p_email:data.p_email,facebook:data.p_facebook,google:data.p_google,linkedin:data.p_linkedin,availabe:data.availabe};
								if(data.availabe=='Y'){
									$scope.checkbox_demo_2=true;
									$('.second_details').show();
								}else{
									$scope.checkbox_demo_2=false;
									$('.second_details').hide();
								}
							}else if(data.p_relation=="Guardian"){
								$localStorage.grelationId=data.pPro_id;
								$scope.guardianCon=true;
								$scope.rmBtnGuardian=false;
								$scope.guardian={p_first_name:data.p_first_name,relationId:data.pPro_id,third_relation:data.p_relation,p_last_name:data.p_last_name,p_dob:data.p_dob,p_education:data.p_education,occupation:data.occupation,p_income:data.p_income,pr_address:data.pr_address,pr_city:data.pr_city,pr_state:data.pr_state,pr_pincode:data.pr_pincode,country:data.pr_country,p_phone:data.p_phone,p_mobile_no:data.p_mobile_no,p_email:data.p_email,facebook:data.p_facebook,google:data.p_google,linkedin:data.p_linkedin};
							}
						});
					},500);
				}).error(function(err){
				});
			// }else{
				// $scope.wizard.admission_date=$filter('date')(new Date(),'MM.dd.yyyy');
			// }
			
			$scope.defaultImg="assets/img/avatars/user.png";
			
			// Date
			
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
				
				$dp_start.on('change',function() {
					//end_date.options.maxDate = $dp_start.val();
					var customeDate=$dp_start.val().split(".");
					end_date.options.maxDate = parseInt(customeDate[0])-1+"."+customeDate[1]+"."+customeDate[2];
				});

				$dp_end.on('change',function() {
					start_date.options.minDate = $dp_end.val();
				});
			},600);
			
            $scope.checkbox_demo_11=true;
            $scope.checkbox_demo_2=true;
            $scope.checkStatusParents=function(check){
                //console.log(check,"fa");
				if(check==true){
					$scope.father.availabe="Y";
                    $('.first_details').show();
                }else {
					$scope.father.availabe="N";
                    $('.first_details').hide();
					$scope.father={p_first_name:$scope.father.p_first_name,relationId:$localStorage.frelationId,first_relation:'Father',p_last_name:$scope.father.p_last_name,p_dob:'',p_education:'',occupation:'',p_income:'',pr_address:'',pr_city:'',pr_state:'',pr_pincode:'',country:'',p_phone:'',p_mobile_no:'',p_email:'',facebook:'',google:'',linkedin:'',availabe:$scope.father.availabe};
					$('input').trigger('blur');
                }
            }
            $scope.checkStatusParents1=function(check){
                //console.log(check,"ma");
				if(check==true){
					$scope.mother.availabe="Y";
                    $('.second_details').show();
                }else {
                    $scope.mother.availabe="N";
					$('.second_details').hide();
					$scope.mother={p_first_name:$scope.mother.p_first_name,relationId:$localStorage.mrelationId,second_relation:'Mother',p_last_name:$scope.mother.p_last_name,p_dob:'',p_education:'',occupation:'',p_income:'',pr_address:'',pr_city:'',pr_state:'',pr_pincode:'',country:'',p_phone:'',p_mobile_no:'',p_email:'',facebook:'',google:'',linkedin:'',availabe:$scope.mother.availabe};
					$('input').trigger('blur');
                }
            }
            var $wizard_advanced_form = $('#wizard_advanced_form');
            $scope.mailling=[];
            $scope.permanent=[];
            setTimeout(function(){$scope.guardianCon=false;},500);	
            $scope.removeGuardian=false;
            $scope.addGuardian=true;
            $scope.showGuardianFrom=function(){
                $scope.guardianCon=true;
                $scope.removeGuardian=true;
                $scope.addGuardian=false;
            }
            $scope.hideGuardianFrom=function(){
                $scope.guardianCon=false;
                $scope.removeGuardian=false;
                $scope.addGuardian=true;
				$scope.guardian={relationId:'',p_first_name:'',p_dob:'',p_phone:'',p_mobile_no:'',p_email:'',facebook:'',google:'',linkedin:'',pr_address:'',pr_city:'',pr_state:'',country:'',pr_pincode:'',occupation:'',p_income:'',p_education:'',third_relation:'Guardian'};
            }
			$scope.sameAddress="No";
            $scope.checkStatus=function(res){
                console.log(res);
                if(res==true){
					$scope.sameAddress="Yes";
                    $scope.permanent.address=$scope.mailling.address;
                    $scope.permanent.city=$scope.mailling.city;
                    $scope.permanent.state=$scope.mailling.state;
                    $scope.permanent.pincode=$scope.mailling.pincode;
                    $scope.permanent.country=$scope.mailling.country;
                    $('.motherDetails').find('input').attr('disabled',true);
                }else {
					$scope.sameAddress="No";
					$scope.permanent.addressId='';
                    $scope.permanent.address='';
                    $scope.permanent.city='';
                    $scope.permanent.state='';
                    $scope.permanent.pincode='';
                    $scope.permanent.country='';
                    $('.motherDetails').find('input').attr('disabled',false);
                    $('.motherDetails').find('input').trigger('blur');
                }
            }
			
			// Select box details
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
						//console.log(value);
						$scope.courseData(value);
					});
				}
			};
			
			$scope.courseData=function(id){
				//console.log(id,"deptId")
				$http.get($localStorage.service+'AcademicsAPI/fetchcourseDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
				.success(function(course_data){
					// console.log(course_data.data,"course");
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
						//console.log(value);
						$scope.batchData(value);
					});
				}
			};
			
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
					});
				}
			};
			
			$scope.batchData=function(id){
				//console.log(id,"deptId")
				$http.get($localStorage.service+'AcademicsAPI/fetchbatchDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
				.success(function(batch_data){
					// console.log(batch_data.data,"batch");
					$scope.selectize_batchId_options=batch_data.data;
				});
			}
			
			$http.get($localStorage.service+'institutionApi/country',{headers:{'access_token':$localStorage.access_token}})
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
				console.log($scope.wizard.profileId,"proId")
				$http.get($localStorage.service+'ProfileAPI/studentSiblingDetails',{params:{batchId:id,profileId:$scope.wizard.profileId},headers:{'access_token':$localStorage.access_token}})
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
            $scope.selectize_relation_options = ["Father", "Mother", "Guardian"];
            $scope.selectize_relation_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Relation'
            };
            $scope.selectize_gurdian_options = ["Guardian"];
            $scope.selectize_gurdian_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Relation'
            };
            
            
            $scope.selectize_blood_options = ["A+ve","A-ve","B-ve","B+ve","AB+ve","AB-ve","O+ve","O-ve"];
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
            

            $scope.form_template = [
                [
                    {
                        'type': 'text',
                        'name': 'firstName',
                        'label': 'First Name'
                    },
                    {
                        'type': 'text',
                        'name': 'lastName',
                        'label': 'Last Name'
                    }
                ],
                [
                    {
                        'type': 'text',
                        'name': 'company',
                        'label': 'Company'
                    }
                ],
                [
                    {
                        'type': 'radio',
                        'label': 'Gender',
                        'name': 'gender',
                        'inputs': [
                            {
                                'label': 'Man',
                                'value': 'man'
                            },
                            {
                                'label': 'Woman',
                                'value': 'woman'
                            }
                        ]
                    },
                    {
                        'type': 'switch',
                        'label': 'Contact',
                        'inputs': [
                            {
                                'label': 'Email',
                                'name': 'switch_email'
                            },
                            {
                                'label': 'Phone',
                                'name': 'switch_phone'
                            }
                        ]
                    }
                ],
                [
                    {
                        'type': 'selectize',
                        'name': 'city',
                        'position': 'bottom',
                        'config': {
                            'valueField': 'value',
                            'labelField': 'title',
                            'placeholder': 'City...'
                        },
                        'data': [
                            {
                                "value": "city_a",
                                "title": "City A"
                            },
                            {
                                "value": "city_b",
                                "title": "City B"
                            },
                            {
                                "value": "city_c",
                                "title": "City C"
                            },
                            {
                                "value": "city_d",
                                "title": "City D"
                            },
                            {
                                "value": "city_e",
                                "title": "City E"
                            }
                        ]
                    },
                    {
                        'type': 'selectize',
                        'name': 'country',
                        'config': {
                            'valueField': 'value',
                            'labelField': 'title',
                            'create': false,
                            'maxItems': 1,
                            'placeholder': 'Country...'
                        },
                        'data': [
                            {
                                "value": "country_a",
                                "title": "Country A"
                            },
                            {
                                "value": "country_b",
                                "title": "Country B"
                            },
                            {
                                "value": "country_c",
                                "title": "Country C"
                            },
                            {
                                "value": "country_d",
                                "title": "Country D"
                            },
                            {
                                "value": "country_e",
                                "title": "Country E"
                            }
                        ]
                    }
                ]
            ];

            $scope.form_dynamic = [];
            $scope.form_dynamic.push($scope.form_template);

            $scope.form_dynamic_model = [];
            $scope.form_dynamic_model1 = [];
            $scope.form_dynamic1=[];
            $scope.form_dynamic1.push({'preEdu_id': '','institute': '','completion': '','course_name': '','total_mark': ''});
            // clone section
            $scope.cloneSection = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic.push($scope.form_template);
            };
            $scope.cloneSection1 = function($event,$index,previous) {
				if(previous.institute=="" || previous.course_name=="" || previous.completion==""){
					UIkit.notify({
						message : 'Please Fill current form',
						status  : 'warning',
						timeout : 2000,
						pos     : 'top-center'
					});
				}else{
					$event.preventDefault();
					$scope.form_dynamic1.push({'preEdu_id': '','institute': '','completion': '','course_name': '','total_mark': ''});
				}
            };

            $scope.deleteSection1 = function($event,$index,preEdu) {
				if(preEdu.preEdu_id){
					UIkit.modal.confirm('Are you sure? You want to Delete '+preEdu.institute+'  Detail', function(){
						$event.preventDefault();
						$scope.form_dynamic_model1.splice($index,1);
						$scope.form_dynamic1.splice($index,1);
						$http.delete($localStorage.service+'ProfileAPI/preEducation',{params:{id:preEdu.preEdu_id},headers:{'access_token':$localStorage.access_token}})
						.success(function(response){
							if(response.status==true){
								UIkit.notify({
									message : response.message,
									status  : 'danger',
									timeout : 3000,
									pos     : 'top-right'
								});
							}
						});
					});
				}else{
					$event.preventDefault();
					$scope.form_dynamic_model1.splice($index,1);
					$scope.form_dynamic1.splice($index,1);
				}
				
            };
            // delete section
            $scope.deleteSection = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic_model.splice($index,1);
                $scope.form_dynamic.splice($index,1);
            };

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                altair_uikit.reinitialize_grid_margin();
            });

             // autocomplete
            $('.autocomplete_template').on('click','#autocomplete_template_results .item', function(e) {
                e.preventDefault();
                var $this = $(this);
                $state.go($this.attr('href'));
                $('.autocomplete_template > input').val('');
            });
			
			
			// Admission Details
			$scope.admissionDetails=function(){
				// alert($('.admission_details').serialize());
				//$scope.values=$('.admission_details').serialize();
				//console.log($scope.wizard,"values");
				
				if($('.fileinput-preview').find('img').attr('src')==undefined){
					$scope.wizard.filename=$('.fileinput-new').find('img').attr('src');
					if($scope.wizard.filename==undefined){
						$scope.wizard.filename="";
					}
				}else{
					$scope.wizard.filename=$('.fileinput-preview').find('img').attr('src');
				}
				
				$http.get($localStorage.service+'ProfileAPI/studentAdmissionNo',{params:{admission_no:$scope.wizard.admission_no,profileId:$scope.wizard.profileId},headers:{'access_token':$localStorage.access_token}})
				.success(function(result){
					if(result.status==false){
						UIkit.notify({
							message : result.message,
							status  : 'danger',
							timeout : 2000,
							pos     : 'top-center'
						});
					}else{
						$http({
						method:'POST',
						url: $localStorage.service+'ProfileAPI/admissionDetails',
						data: {profileId:$scope.wizard.profileId,admission_no:$scope.wizard.admission_no,admission_date:$scope.wizard.admission_date,first_name:$scope.wizard.first_name,last_name:$scope.wizard.last_name,filename:$scope.wizard.filename,gender:$scope.wizard.gender,wizard_birth:$scope.wizard.wizard_birth,nationality:$scope.wizard.nationality,mother_tongue:$scope.wizard.mother_tongue,religion:$scope.wizard.religion,batchId:$scope.wizard.batchId,roll_no:$scope.wizard.roll_no},
						headers:{'access_token':$localStorage.access_token}
						}).then(function(response){
							//console.log(response.data.admission_no);
							$scope.wizard.profileId=response.data.profile[0].profile_id;
							$scope.wizard.stuPro_id=response.data.profile[0].stu_profileId;
							WizardHandler.wizard().next();
						});
					}
				});
			}
			// Academics Details
			
			$scope.academicsDetails=function(){
				//$scope.wizard.profileId=35;
				//console.log($scope.form_dynamic1,"previous");
				
				$http({
                method:'POST',
                url: $localStorage.service+'ProfileAPI/academicsDetails',
                data: {profileId:$scope.wizard.profileId,previous:$scope.form_dynamic1,sibling:$scope.sibling.studentId,bloodGroup:$scope.previous.selectize_blood,birthplace:$scope.previous.birthplace,stu_category:$scope.previous.selectize_cat,stu_type:$scope.previous.selectize_styType,student_lives:$scope.previous.student_lives},
				headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    //console.log(response.data.preEduId);
					angular.forEach(response.data.preEduId, function(value, key) {
						//console.log(key['institute'] + ': ' + value.institute);
						$scope.form_dynamic1[key].preEdu_id=value;
					});
					
                });
			}
			
			// Contact Details
			
			$scope.contactDetails=function(){
				//$scope.wizard.profileId=120;
				//console.log($scope.mailling,"mailling");
				//console.log($scope.permanent,"permanent");
				
				$http({
                method:'POST',
                url: $localStorage.service+'ProfileAPI/contactDetails',
                data: {profileId:$scope.wizard.profileId,addressId:$scope.mailling.addressId,addressId1:$scope.permanent.addressId,address:$scope.mailling.address,city:$scope.mailling.city,state:$scope.mailling.state,pincode:$scope.mailling.pincode,country:$scope.mailling.country,address1:$scope.permanent.address,city1:$scope.permanent.city,state1:$scope.permanent.state,pincode1:$scope.permanent.pincode,country1:$scope.permanent.country,phone:$scope.contact.phone,mobile_no:$scope.contact.mobile_no,email:$scope.contact.email,facebook:$scope.social.facebook,google:$scope.social.google,linkedin:$scope.social.linkedin,sameAddress:$scope.sameAddress},
				headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    //console.log(response.data);
					//console.log($scope.sameAddress);
					if($scope.sameAddress=="Yes"){
						$scope.mailling.addressId=response.data.locationId[0];
						$scope.permanent.addressId=response.data.locationId[0];
					}else{
						$scope.mailling.addressId=response.data.locationId[0];
						$scope.permanent.addressId=response.data.locationId[1];
					}
                });
			}
			
			// Parents Details
			
			// $scope.father={relationId:'',p_dob:'',p_phone:'',p_mobile_no:'',p_email:'',facebook:'',google:'',linkedin:'',pr_address:'',pr_city:'',pr_state:'',country:'',pr_pincode:'',occupation:'',p_income:'',p_education:'',first_relation:'Father',availabe:true};
			// $scope.mother={relationId:'',p_dob:'',p_phone:'',p_mobile_no:'',p_email:'',facebook:'',google:'',linkedin:'',pr_address:'',pr_city:'',pr_state:'',country:'',pr_pincode:'',occupation:'',p_income:'',p_education:'',second_relation:'Mother',availabe:true};
			$scope.guardian={relationId:'',p_first_name:'',p_dob:'',p_phone:'',p_mobile_no:'',p_email:'',facebook:'',google:'',linkedin:'',pr_address:'',pr_city:'',pr_state:'',country:'',pr_pincode:'',occupation:'',p_income:'',p_education:'',third_relation:'Guardian'};
			
			
			$scope.parentsDetails=function(){
				//$scope.wizard.profileId=35;
				//$scope.wizard.stuPro_id=33;
				
				// if($scope.father.availabe==false){
					// $scope.father.availabe='N'
				// }else{
					// $scope.father.availabe='Y'
				// }
				
				// if($scope.mother.availabe==false){
					// $scope.mother.availabe='N'
				// }else{
					// $scope.mother.availabe='Y'
				// }
				
				$http({
                method:'POST',
                url: $localStorage.service+'ProfileAPI/parentsProfile',
                data: {profileId:$scope.wizard.profileId,stuPro_id:$scope.wizard.stuPro_id,father:$scope.father,mother:$scope.mother,guardian:$scope.guardian},
				headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    $scope.father.relationId=response.data.profileIds[0].frelation_id;
					$scope.mother.relationId=response.data.profileIds[0].mrelation_id;
					$scope.guardian.relationId=response.data.profileIds[0].grelation_id;
					if(response.data.status==true){
						UIkit.notify({
							message : "Student Profile Details Updated Successfully",
							status  : 'success',
							timeout : 2000,
							pos     : 'top-center'
						});
						//$state.go('restricted.student.student_list');
					}
                });
			}
			
        }
    ]);