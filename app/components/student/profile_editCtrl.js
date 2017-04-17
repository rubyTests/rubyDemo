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
        // 'groups_data',
        function ($rootScope,$scope,user_data,$stateParams,$filter,$http,$localStorage) {
            // console.log($stateParams,'stateParams');
			//console.log($stateParams.stu_id,"ID");
            
			$http.get($localStorage.service+'ProfileAPI/parentsDetails',{params:{id:$stateParams.stu_id},headers: {'access_token':$localStorage.access_token} })
			.success(function(data){
				// console.log(data.result,"data");
				$scope.user_data=data.result[0].user_detail;
				console.log($scope.user_data,"data")
				$scope.profileId=$scope.user_data.id;
				$scope.parents_data=data.result[0].user_parents;
				$scope.pre_edu=data.result[0].pre_edu;
				//console.log($scope.parents_data,"parents_data")
			}).error(function(err){
			});
			
			// var paramsData=$filter('filter')(user_data, {id : $stateParams.stu_id});
            // $scope.user_data = paramsData[0];

            // $scope.user_data = user_data[0];
            // $scope.user_data_contacts = user_data[0].contact;
            // languages
            var langData = $scope.user_languages_options = [
                {id: 1, title: 'English', value: 'gb'},
                {id: 2, title: 'French', value: 'fr'},
                {id: 3, title: 'Chinese', value: 'cn'},
                {id: 4, title: 'Dutch', value: 'nl'},
                {id: 5, title: 'Italian', value: 'it'},
                {id: 6, title: 'Spanish', value: 'es'},
                {id: 7, title: 'German', value: 'de'},
                {id: 8, title: 'Polish', value: 'pl'}
            ];
			
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
			
			$scope.selectize_d_options = ["CSE", "EEE", "ECE ","MECH"];
            $scope.selectize_d_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select'
            };
			
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
			
			$scope.selectize_country_options = ["India", "Sri Langa", "America"];
            $scope.selectize_country_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Country'
            };
			
			$scope.selectize_n_options = ["India", "Sri Langa", "America"];
            $scope.selectize_n_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select natioanality'
            };
			
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
			
            $scope.user_languages_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                render: {
                    option: function(langData, escape) {
                        return  '<div class="option">' +
                            '<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                            '<span>' + escape(langData.title) + '</span>' +
                            '</div>';
                    },
                    item: function(langData, escape) {
                        return '<div class="item"><i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' + escape(langData.title) + '</div>';
                    }
                },
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                create: false,
                placeholder: 'Select Language...'
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
				
				$http({
                method:'POST',
                url: $localStorage.service+'ProfileAPI/profileEdit',
                data: {profile:$scope.user_data,pre_edu:$scope.pre_edu,parents:$scope.parents_data},
				headers:{'Content-Type':'application/json; charset=UTF-8','access_token':$localStorage.access_token}
                }).then(function(response){
                    console.log(response,"student");
                });
				
				
				
				//Student Details
				
				// $http({
                // method:'POST',
                // url: $localStorage.service+'ProfileAPI/profileDetails',
                // data: $scope.user_data,
				// headers:{'Content-Type':'application/json; charset=UTF-8','access_token':$localStorage.access_token}
                // }).then(function(response){
                    // console.log(response,"student");
                // });
				
				//$scope.parVal.push($scope.parents_data);
				//console.log($scope.parVal,"push");
				
				// Parents Details
				
				// $http({
                // method:'POST',
                // url: $localStorage.service+'ProfileAPI/editParentsDetails',
                // data: $scope.parVal,
				// headers:{'access_token':$localStorage.access_token}
                // }).then(function(response){
                    // console.log(response,"parents");
                // });
			}

        }
    ])
;