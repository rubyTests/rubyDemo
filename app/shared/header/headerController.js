angular
    .module('rubycampusApp')
    .controller('main_headerCtrl', [
        '$timeout',
        '$scope',
        '$window',
        '$state',
		'$location',
		'$localStorage',
		'$http',
        '$resource',
        '$rootScope',
        function ($timeout,$scope,$window,$state,$location,$localStorage,$http,$resource,$rootScope) {
            $scope.userProfile_id = $localStorage.userProfile_id;
            var vm = this;
            vm.dt_data = [];
            //$scope.messageData = [];
            $resource('data/mailbox_datanew.json')
            .query()
            .$promise
            .then(function(dt_data) {
                vm.dt_data = dt_data;
               // $scope.messageData.push(vm.dt_data);
            });

            $scope.messageHeader=[];
            $http({
                method:'GET',
                url: $localStorage.service+'messageAPI/messageHeaderList',
                params : { id : $localStorage.userProfile_id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                console.log(return_data.data,'returnss_data1231231');
                $scope.meesageNotification=[];
                angular.forEach(return_data.data.message, function(value1, keys1){
                    angular.forEach(value1.messages, function(value2, keys2){
                        if (value2.STATUS=='CTD' && value2.NEW=='1' && $scope.userProfile_id!= value2.CRT_USER_ID) {
                            $scope.meesageNotification.push(value1);
                        }
                    })
                })
                console.log($scope.meesageNotification, "$scope.meesageNotification");
                $scope.messageHeader = return_data.data.message;
                $scope.Id = $scope.messageHeader[0].ID;
                $scope.Fname = $scope.messageHeader[0].FNAME;
                $scope.msgList = $scope.messageHeader.MESSAGE;
                console.log($scope.messageHeader,'$scope.messageHeader');
                console.log($scope.Fname,'$scope.Fname');
                console.log($scope.messageHeader.MESSAGE,'$scope.msgList');
            });
            
            
            $scope.user_data = {
                name: "Lue Feest",
                avatar: "assets/img/avatars/avatar_11_tn.png",
                alerts: [
                    {
                        "title": "Hic expedita eaque.",
                        "content": "Nemo nemo voluptatem officia voluptatum minus.",
                        "type": "warning"
                    },
                    {
                        "title": "Voluptatibus sed eveniet.",
                        "content": "Tempora magnam aut ea.",
                        "type": "success"
                    },
                    {
                        "title": "Perferendis voluptatem explicabo.",
                        "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                        "type": "danger"
                    },
                    {
                        "title": "Perferendis voluptatem explicabo.",
                        "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                        "type": "danger"
                    },
                    {
                        "title": "Perferendis voluptatem explicabo.",
                        "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                        "type": "danger"
                    },
                    {
                        "title": "Perferendis voluptatem explicabo.",
                        "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                        "type": "danger"
                    },
                    {
                        "title": "Quod minima ipsa.",
                        "content": "Vel dignissimos neque enim ad praesentium optio.",
                        "type": "primary"
                    },
                    {
                        "title": "Hic expedita eaque.",
                        "content": "Nemo nemo voluptatem officia voluptatum minus.",
                        "type": "warning"
                    },
                    {
                        "title": "Voluptatibus sed eveniet.",
                        "content": "Tempora magnam aut ea.",
                        "type": "success"
                    },
                    {
                        "title": "Perferendis voluptatem explicabo.",
                        "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                        "type": "danger"
                    },
                    {
                        "title": "Perferendis voluptatem explicabo.",
                        "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                        "type": "danger"
                    },
                    {
                        "title": "Perferendis voluptatem explicabo.",
                        "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                        "type": "danger"
                    },
                    {
                        "title": "Perferendis voluptatem explicabo.",
                        "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                        "type": "danger"
                    },
                    {
                        "title": "Quod minima ipsa.",
                        "content": "Vel dignissimos neque enim ad praesentium optio.",
                        "type": "primary"
                    },
                    {
                        "title": "Hic expedita eaque.",
                        "content": "Nemo nemo voluptatem officia voluptatum minus.",
                        "type": "warning"
                    },
                    {
                        "title": "Voluptatibus sed eveniet.",
                        "content": "Tempora magnam aut ea.",
                        "type": "success"
                    },
                    {
                        "title": "Perferendis voluptatem explicabo.",
                        "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                        "type": "danger"
                    },
                    {
                        "title": "Perferendis voluptatem explicabo.",
                        "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                        "type": "danger"
                    },
                    {
                        "title": "Perferendis voluptatem explicabo.",
                        "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                        "type": "danger"
                    },
                    {
                        "title": "Perferendis voluptatem explicabo.",
                        "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                        "type": "danger"
                    },
                    {
                        "title": "Quod minima ipsa.",
                        "content": "Vel dignissimos neque enim ad praesentium optio.",
                        "type": "primary"
                    }
                ],
                messages: [
                    {
                        "title": "Reiciendis aut rerum.",
                        "content": "In adipisci amet nostrum natus recusandae animi fugit consequatur.",
                        "sender": "Korbin Doyle",
                        "color": "cyan"
                    },
                    {
                        "title": "Tenetur commodi animi.",
                        "content": "Voluptate aut quis rerum laborum expedita qui eaque doloremque a corporis.",
                        "sender": "Alia Walter",
                        "color": "indigo",
                        "avatar": "assets/img/avatars/avatar_07_tn.png"
                    },
                    {
                        "title": "At quia quis.",
                        "content": "Fugiat rerum aperiam et deleniti fugiat corporis incidunt aut enim et distinctio.",
                        "sender": "William Block",
                        "color": "light-green"
                    },
                    {
                        "title": "Incidunt sunt.",
                        "content": "Accusamus necessitatibus officia porro nisi consectetur dolorem.",
                        "sender": "Delilah Littel",
                        "color": "blue",
                        "avatar": "assets/img/avatars/avatar_02_tn.png"
                    },
                    {
                        "title": "Porro ut.",
                        "content": "Est vitae magni eum expedita odit quisquam natus vel maiores.",
                        "sender": "Amira Hagenes",
                        "color": "amber",
                        "avatar": "assets/img/avatars/avatar_09_tn.png"
                    }
                ]
            };
            $scope.myProfile=function(){
                //alert();
				if($localStorage.role_id==2){
					$state.go("restricted.employeemanagement.profile"); 
				}else{
					$localStorage.myProfile="myProfile";
					$state.go("restricted.student.student_profile"); 
				}
            }
			// $scope.user_prof=$localStorage.userProfile_id;
            // console.log($scope.user_prof,'user_prof');
            // $scope.user_logo = [];
            $http.get($localStorage.service+'ProfileAPI/profileDetails',{params:{id:$localStorage.userProfile_id},headers: {'access_token':$localStorage.access_token} })
            .success(function(data){
                //console.log(data,"data");
				if(data.status==true){
					$scope.user_logo=data.result[0].IMAGE1;
				}else{
					if(data.message=='Invalid User Access Token'){
						$localStorage.access_token='';
						$state.go("login");
					}
				}
            }).error(function(err){
            });

			// LogOut function
			$scope.logOut=function(){
				$http.get($localStorage.service+"GeneralAPI/logout",{headers: {'access_token':$scope.access_token}})
				.success(function(data){
					if(data.status==true){
						$localStorage.user_id='';
						$localStorage.access_token='';
						$location.path('/');
					}
				})
			}

            $scope.alerts_length = $scope.user_data.alerts.length;
            $scope.messages_length = $scope.user_data.messages.length;
            $scope.dropNotofication = function(message){
                var index = $scope.meesageNotification.indexOf(message);
                $scope.meesageNotification.splice(index,1);
                $state.go("restricted.mails",{mailId:message.C_ID});
                // ui-sref="restricted.mails({ mailId:message.C_ID})"
            }

            $('#menu_top').children('[data-uk-dropdown]').on('show.uk.dropdown', function(){
                $timeout(function() {
                    $($window).resize();
                },280)
            });

            // autocomplete
            $('.header_main_search_form').on('click','#autocomplete_results .item', function(e) {
                e.preventDefault();
                var $this = $(this);
                $state.go($this.attr('href'));
                $('.header_main_search_input').val('');
            });


        }
    ])
;