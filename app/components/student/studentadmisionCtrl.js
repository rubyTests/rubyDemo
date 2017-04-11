angular
    .module('rubycampusApp')
    .controller('studentadmisionCtrl', [
        '$scope',
        'utils',
		'$localStorage',
		'$http',
        function ($scope,utils,$localStorage,$http) {
            var $wizard_advanced_form = $('#wizard_advanced_form');
            $scope.father=[];
            $scope.Mother=[];
            $scope.guardian=false;
            $scope.removeGuardian=false;
            $scope.addGuardian=true;
            $scope.showGuardianFrom=function(){
                $scope.guardian=true;
                $scope.removeGuardian=true;
                $scope.addGuardian=false;
            }
            $scope.hideGuardianFrom=function(){
                $scope.guardian=false;
                $scope.removeGuardian=false;
                $scope.addGuardian=true;
            }
			$scope.sameAddress="No";
            $scope.checkStatus=function(res){
                console.log(res);
                if(res==true){
					$scope.sameAddress="Yes";
                    console.log($scope.father,'trueeee');
                    $scope.Mother.address=$scope.father.address;
                    $scope.Mother.city=$scope.father.city;
                    $scope.Mother.state=$scope.father.state;
                    $scope.Mother.pincode=$scope.father.pincode;
                    $scope.Mother.country=$scope.father.country;
                    $('.motherDetails').find('input').attr('disabled',true);
                }else {
					$scope.sameAddress="No";
                    console.log('false');
                    $scope.Mother.address='';
                    $scope.Mother.city='';
                    $scope.Mother.state='';
                    $scope.Mother.pincode='';
                    $scope.Mother.country='';
                    $('.motherDetails').find('input').attr('disabled',false);
                    $('.motherDetails').find('input').trigger('blur');
                }
            }
            $scope.selectize_a_data = {
                options: [
                    {
                        id: 1,
                        title: "Batch A",
                        value: "a1",
                        parent_id: 1
                    },
                    {
                        id: 2,
                        title: "Batch B",
                        value: "b1",
                        parent_id: 1
                    },
                    {
                        id: 3,
                        title: "Batch C",
                        value: "c1",
                        parent_id: 1
                    }
                ]
            };

            $scope.selectize_a_config = {
                // plugins: {
                //     'disable_options': {
                //         disableOptions: ["c1","c2"]
                //     }
                // },
                create: false,
                maxItems: 1,
                placeholder: 'Select Batch...',
                optgroupField: 'parent_id',
                optgroupLabelField: 'title',
                optgroupValueField: 'ogid',
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                onInitialize: function(selectize){
                    selectize.on('change', function() {
                        console.log('on "change" event fired');
                    });
                    selectize.on('focus', function() {
                        console.log('on "focus" event fired');
                    });
                    selectize.on('dropdown_open', function() {
                        console.log('on "dropdown_open" event fired');
                    });
                }
            };

            $scope.selectize_stuType_data =['Day-scholar','Hostel']
            $scope.selectize_styType_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Student Type'
            };

            $scope.selectize_c_options = ["Course A", "Course B", "Course C"];
            $scope.selectize_c_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Course'
            };

            $scope.selectize_b_options = ["Hinduism", "Buddhism", "Jainism ","Sikhism"];
            $scope.selectize_b_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Religion'
            };
            $scope.selectize_d_options = ["CSE", "EEE", "ECE ","MECH"];
            $scope.selectize_d_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select'
            };
            $scope.selectize_n_options = ["India", "Sri Langa", "America"];
            $scope.selectize_n_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select natioanality'
            };
            $scope.selectize_m_options = ["Tamil", "English"];
            $scope.selectize_m_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select mother tongue'
            };
            $scope.selectize_country_options = ["India", "Sri Langa", "America"];
            $scope.selectize_country_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Country'
            };
            $scope.selectize_blood_options = ["O+ve", "A+ve","A+ve","B-ve","B+ve","O-ve"];
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
            $scope.selectize_city_options = ["Cuddalore", "Villupuram","Puducherry","Chennai"];
            $scope.selectize_city_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select City'
            };
            $scope.selectize_state_options = ["Tamilnadu", "Andhra Pradesh","Assam","Bihar"];
            $scope.selectize_state_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select State...'
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


             $scope.countryNames = [
                "Albania",
                "Andorra",
                "Armenia",
                "Austria",
                "Azerbaijan",
                "Belarus",
                "Belgium",
                "Bosnia & Herzegovina",
                "Bulgaria",
                "Croatia",
                "Cyprus",
                "Czech Republic",
                "Denmark",
                "Estonia",
                "Finland",
                "France",
                "Georgia",
                "Germany",
                "Greece",
                "Hungary",
                "Iceland",
                "Ireland",
                "Italy",
                "Kosovo",
                "Latvia",
                "Liechtenstein",
                "Lithuania",
                "Luxembourg",
                "Macedonia",
                "Malta",
                "Moldova",
                "Monaco",
                "Montenegro",
                "Netherlands",
                "Norway",
                "Poland",
                "Portugal",
                "Romania",
                "Russia",
                "San Marino",
                "Serbia",
                "Slovakia",
                "Slovenia",
                "Spain",
                "Sweden",
                "Switzerland",
                "Turkey",
                "Ukraine",
                "United Kingdom",
                "Vatican City"
            ];
			
			$scope.save=function(){
				//alert("done")
				$scope.imgValue=$('.fileinput-preview').find('img').attr('src');
				console.log($scope.imgValue,"data");
			}
			$scope.wizard=[];
			$scope.saveContiune=function(){
				alert($('#admission_details').serialize());
				// $scope.values = $('#wizard_advanced_form').serialize();
				// console.log($scope.values)
				// $http({
                // method:'POST',
                // url: $localStorage.service+'ProfileAPI/profileDetails',
                // data: $scope.values,
				// headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','access_token':$localStorage.access_token}
                // }).then(function(response){
                    // //console.log(response.data.admission_no);
					// $scope.profileId=response.data.admission_no;
					// $scope.Pwizard={p_first_name:'',p_last_name:'',p_relation:'',p_dob:'',p_education:'',occupation:'',p_income:'',pr_address:'',pr_city:'',pr_state:'',pr_pincode:'',pr_country:'',p_phone:'',p_mobile_no:'',p_email:'',profileId:$scope.profileId};
                // });
			}
			//$scope.profileId=2;
			$scope.parentsDetails=function(){
				// console.log($scope.profileId)
				// console.log($scope.Pwizard)
				// $http({
                // method:'POST',
                // url: $localStorage.service+'ProfileAPI/parentsDetails',
                // data: $scope.Pwizard,
				// headers:{'access_token':$localStorage.access_token}
                // }).then(function(response){
                    // console.log(response,"response");
					// $scope.Pwizard.parentProfileId=response.data.message;
                // });
			}
			$scope.stu={profileId:''};
			// Admission Details
			$scope.wizard=[];
			$scope.admission_details=function(){
				// alert($('.admission_details').serialize());
				$scope.values=$('.admission_details').serialize();
				//console.log($scope.wizard,"values");
				
				$http({
                method:'POST',
                url: $localStorage.service+'ProfileAPI/admissionDetails',
                data: {profileId:$scope.wizard.profileId,admission_no:$scope.wizard.admission_no,admission_date:$scope.wizard.admission_date,first_name:$scope.wizard.first_name,last_name:$scope.wizard.last_name,filename:$('.fileinput-filename').val(),wizard_gender:$scope.wizard.wizard_gender,wizard_birth:$scope.wizard.wizard_birth,selectize_n:$scope.selectize_n,mother_tongue:$scope.wizard.mother_tongue,religion:$scope.wizard.religion,selectize_a:$scope.selectize_a,roll_no:$scope.wizard.roll_no},
				headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    //console.log(response.data.admission_no);
					$scope.wizard.profileId=response.data.admission_no;
                });
			}
			// Academics Details
			$scope.previous=[];
			$scope.academics_details=function(){
				//$scope.wizard.profileId=35;
				//console.log($scope.form_dynamic1,"previous");
				
				$http({
                method:'POST',
                url: $localStorage.service+'ProfileAPI/academicsDetails',
                data: {profileId:$scope.wizard.profileId,previous:$scope.form_dynamic1,sibling:$scope.previous.selectize_planets,bloodGroup:$scope.previous.selectize_blood,birthplace:$scope.previous.birthplace,stu_category:$scope.previous.selectize_cat,stu_type:$scope.previous.selectize_styType},
				headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    console.log(response.data.preEduId);
					angular.forEach(response.data.preEduId, function(value, key) {
						console.log(key['institute'] + ': ' + value.institute);
						$scope.form_dynamic1[key].preEduId=value;
					});
					
                });
			}
			
			// Contact Details
			$scope.social=[];
			$scope.contact=[];
			$scope.contact_details=function(){
				$scope.wizard.profileId=35;
				$http({
                method:'POST',
                url: $localStorage.service+'ProfileAPI/contactDetails',
                data: {profileId:$scope.wizard.profileId,address:$scope.father.address,city:$scope.father.city,state:$scope.father.state,pincode:$scope.father.pincode,country:$scope.father.country,address1:$scope.Mother.address,city1:$scope.Mother.city,state1:$scope.Mother.state,pincode1:$scope.Mother.pincode,country1:$scope.Mother.country,phone:$scope.contact.phone,mobile_no:$scope.contact.mobile_no,email:$scope.contact.email,facebook:$scope.social.facebook,google:$scope.social.google,linkedin:$scope.social.linkedin,sameAddress:$scope.sameAddress},
				headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    console.log(response.data);
					// if($scope.sameAddress=="Yes"){
						
					// }
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