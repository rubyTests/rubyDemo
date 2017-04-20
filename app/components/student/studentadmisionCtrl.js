angular
    .module('rubycampusApp')
    .controller('studentadmisionCtrl', [
        '$scope',
        'utils',
		'$localStorage',
		'$http',
		'$filter',
		'$location',
        function ($scope,utils,$localStorage,$http,$filter,$location) {
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
			
			$scope.wizard.admission_date=$filter('date')(new Date(),'MM.dd.yyyy');
			
			$scope.exitValidation = function(){
				if($scope.wizard.admission_no==undefined || $scope.wizard.admission_date==undefined || $scope.wizard.first_name==undefined || $scope.wizard.last_name==undefined || $scope.wizard.gender==undefined || $scope.wizard.w1_birth_date==undefined || $scope.wizard.batchId==undefined){
					return false;
				}else{
					return true;
				}
				
			}
			
			$scope.exitValidation1 = function(){
				if($scope.previous.selectize_styType==undefined || $scope.previous.student_lives==undefined ){
					return false;
				}else{
					return true;
				}
				
			}
			
			$scope.exitValidation2 = function(){
				if($scope.mailling.address==undefined || $scope.mailling.city==undefined || $scope.mailling.state==undefined || $scope.mailling.pincode==undefined || $scope.mailling.country==undefined || $scope.permanent.address==undefined || $scope.permanent.city==undefined || $scope.permanent.state==undefined || $scope.permanent.pincode==undefined || $scope.permanent.country==undefined){
					return false;
				}else{
					return true;
				}
				
			}
			
			$scope.exitValidation3 = function(){
				if($scope.father.p_first_name==undefined || $scope.father.p_last_name==undefined || $scope.father.first_relation==undefined || $scope.mother.p_first_name==undefined || $scope.mother.p_last_name==undefined || $scope.mother.second_relation==undefined || $scope.guardian.p_first_name==undefined || $scope.guardian.p_last_name==undefined || $scope.guardian.third_relation==undefined){
					return false;
				}else{
					return true;
				}
				
			}
			
			setTimeout(function(){
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
				
			},500)
			
            $scope.checkbox_demo_11=true;
            $scope.checkbox_demo_2=true;
            $scope.checkStatusParents=function(check){
                if(check==true){
                    $('.first_details').show();
                }else {
                    $('.first_details').hide();
                }
            }
            $scope.checkStatusParents1=function(check){
                if(check==true){
                    $('.second_details').show();
                }else {
                    $('.second_details').hide();
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
				placeholder: 'Select Department',
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
				placeholder: 'Select Course',
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
				placeholder: 'Select Batch',
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
                placeholder: 'Select Country',
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
                placeholder: 'Select Nationality',
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
				placeholder: 'Select Course',
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
				placeholder: 'Select Batch',
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
				placeholder: 'Select Sibling',
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
                placeholder: 'Select Student Type'
            };

            $scope.selectize_studentLive_options = ["Parents", "Father", "Mother","Guardian"];
            $scope.selectize_studentLive_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select'
            };
            $scope.selectize_relation_options = ["Father", "Mother", "Guardian"];
            $scope.selectize_relation_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select'
            };
            $scope.selectize_gurdian_options = ["Guardian"];
            $scope.selectize_gurdian_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select'
            };
            
            
            $scope.selectize_blood_options = ["A+ve","A-ve","B-ve","B+ve","AB+ve","AB-ve","O+ve","O-ve"];
            $scope.selectize_blood_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Blood Group'
            };
            $scope.selectize_cat_options = ["Category 1", "Category 2","Category 3"];
            $scope.selectize_cat_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Category'
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
            $scope.form_dynamic1.push({'preEduId': '','institute': '','year': '','course_name': '','total_mark': ''});
            // clone section
            $scope.cloneSection = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic.push($scope.form_template);
            };
            $scope.cloneSection1 = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic1.push({'preEduId': '','institute': '','year': '','course_name': '','total_mark': ''});
            };

            $scope.deleteSection1 = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic_model1.splice($index,1);
                $scope.form_dynamic1.splice($index,1);
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
				
				$http({
                method:'POST',
                url: $localStorage.service+'ProfileAPI/admissionDetails',
                data: {profileId:$scope.wizard.profileId,admission_no:$scope.wizard.admission_no,admission_date:$scope.wizard.admission_date,first_name:$scope.wizard.first_name,last_name:$scope.wizard.last_name,filename:$('.fileinput-filename').val(),wizard_gender:$scope.wizard.gender,wizard_birth:$scope.wizard.w1_birth_date,nationality:$scope.wizard.nationality,mother_tongue:$scope.wizard.mother_tongue,religion:$scope.wizard.religion,batchId:$scope.wizard.batchId,roll_no:$scope.wizard.roll_no},
				headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    //console.log(response.data.admission_no);
					$scope.wizard.profileId=response.data.profile[0].profile_id;
					$scope.wizard.stuProfileId=response.data.profile[0].stu_profileId;
                });
			}
			// Academics Details
			
			$scope.academicsDetails=function(){
				//$scope.wizard.profileId=35;
				//console.log($scope.form_dynamic1,"previous");
				
				$http({
                method:'POST',
                url: $localStorage.service+'ProfileAPI/academicsDetails',
                data: {profileId:$scope.wizard.profileId,previous:$scope.form_dynamic1,sibling:$scope.sibling.studentId,bloodGroup:$scope.previous.selectize_blood,birthplace:$scope.previous.birthplace,stu_category:$scope.previous.selectize_cat,stu_type:$scope.previous.selectize_styType},
				headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    console.log(response.data.preEduId);
					angular.forEach(response.data.preEduId, function(value, key) {
						//console.log(key['institute'] + ': ' + value.institute);
						$scope.form_dynamic1[key].preEduId=value;
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
			
			$scope.father.relationId=0;
			$scope.mother.relationId=0;
			$scope.guardian.relationId=0;
			// $scope.father.facebook="";
			// $scope.father.google="";
			// $scope.father.linkedin="";
			// $scope.mother.facebook="";
			// $scope.mother.google="";
			// $scope.mother.linkedin="";
			// $scope.guardian.facebook="";
			// $scope.guardian.google="";
			// $scope.guardian.linkedin="";	
			$scope.father={relationId:'',p_dob:'',p_phone:'',p_mobile_no:'',p_email:'',facebook:'',google:'',linkedin:'',pr_address:'',pr_city:'',pr_state:'',country:'',pr_pincode:'',occupation:'',p_income:'',p_education:''};
			$scope.mother={relationId:'',p_dob:'',p_phone:'',p_mobile_no:'',p_email:'',facebook:'',google:'',linkedin:'',pr_address:'',pr_city:'',pr_state:'',country:'',pr_pincode:'',occupation:'',p_income:'',p_education:''};
			$scope.guardian={relationId:'',p_first_name:'',p_dob:'',p_phone:'',p_mobile_no:'',p_email:'',facebook:'',google:'',linkedin:'',pr_address:'',pr_city:'',pr_state:'',country:'',pr_pincode:'',occupation:'',p_income:'',p_education:''};
			
			
			$scope.parentsDetails=function(){
				//$scope.wizard.profileId=35;
				//$scope.wizard.stuProfileId=33;
				$http({
                method:'POST',
                url: $localStorage.service+'ProfileAPI/parentsProfile',
                data: {profileId:$scope.wizard.profileId,stuProfileId:$scope.wizard.stuProfileId,father:$scope.father,mother:$scope.mother,guardian:$scope.guardian},
				headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    //console.log(response,"response");
					//console.log(response.data.profileIds[0].fprofile_id,"fprofileId");
					//console.log(response.data.profileIds[0]['fprofile_id'],"fprofileId-1");
					$scope.father.relationId=response.data.profileIds[0].frelation_id;
					$scope.mother.relationId=response.data.profileIds[0].mrelation_id;
					$scope.guardian.relationId=response.data.profileIds[0].grelation_id;
					if(response.data.status==true){
						UIkit.notify({
							message : response.data.message,
							status  : 'success',
							timeout : 2000,
							pos     : 'top-center'
						});
						$location.path('student/student_list');
					}
                });
			}
			
			
            var planets_data = $scope.selectize_planets_options = [
                {id: 1, title: 'Rafeeq', url: '444'},
                {id: 2, title: 'Saravanan', url: '222'},
                {id: 3, title: 'Gopi', url: '222'},
                {id: 4, title: 'Senthil', url: '222'},
                {id: 5, title: 'Mani', url: '222'},
                {id: 6, title: 'Vijay', url: '222'},
                {id: 7, title: 'Karthil', url: '222'},
                {id: 8, title: 'Selva', url: '222'}
            ];

            $scope.selectize_planets_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                maxItems: 1,
                valueField: 'id',
                labelField: 'title',
                searchField: ['title','url'],
                // searchField: 'url',
                create: false,
                placeholder: 'Student Name / Admission No',
                render: {
                    option: function(planets_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(planets_data.title) + '</span><br>' +
                            '<span class="title Addition uk-text-muted uk-text-small">' + escape(planets_data.url) + '</span>' +
                            '</div>';
                    }
                    // item: function(planets_data, escape) {
                    //     return '<div class="item"><a href="' + escape(planets_data.url) + '" target="_blank">' + escape(planets_data.title) + '</a></div>';
                    // }
                }
            };
        }
    ]);