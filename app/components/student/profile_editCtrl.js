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
			$scope.updateValue=function(){
				//console.log($scope.user_data,"savedData");
				// console.log($scope.parents_data,"data1");
				//Student Details
				
				$http({
                method:'POST',
                url: $localStorage.service+'ProfileAPI/profileDetails',
                data: $scope.user_data,
				headers:{'Content-Type':'application/json; charset=UTF-8','access_token':$localStorage.access_token}
                }).then(function(response){
                    console.log(response,"student");
                });
				
				//$scope.parVal.push($scope.parents_data);
				//console.log($scope.parVal,"push");
				
				// Parents Details
				$http({
                method:'POST',
                url: $localStorage.service+'ProfileAPI/editParentsDetails',
                data: $scope.parVal,
				headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    console.log(response,"parents");
                });
			}

        }
    ])
;