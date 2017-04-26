angular
    .module('rubycampusApp')
    .controller('studentlistCtrl', [
        '$rootScope',
        '$scope',
        '$window',
        'contact_list',
        '$http',
        '$localStorage',
        function ($rootScope,$scope,$window,contact_list,$http,$localStorage) {

            $rootScope.toBarActive = true;
            $scope.$on('$destroy', function() {
                $rootScope.toBarActive = false;
            });

            //$scope.contact_list = contact_list;
			
			$scope.default_image='assets/img/man.png'
			
			$http.get($localStorage.service+'ProfileAPI/studentProfileDetails',{headers: {'access_token':$localStorage.access_token} })
			.success(function(data){
				// console.log(data.result,"data");
				$scope.contact_list=data.result;
			}).error(function(err){
			});

            // get all companies from array
            var all_companies = contact_list.map(function(a) {

                a.fullname=a.firstname+" "+a.lastname;
                // console.log(a.fullname,'aaaaaaaa');
                return a.company;
            });

            // remove duplicate companies
            function eliminateDuplicates(arr) {
                var i,
                    len=arr.length,
                    out=[],
                    obj={};

                for (i=0;i<len;i++) {
                    obj[arr[i]]=0;
                }
                for (i in obj) {
                    out.push(i);
                }
                return out;
            }

            $scope.contact_list_companies = eliminateDuplicates(all_companies);

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $scope.$apply(function () {
                    UIkit.grid($('#contact_list'),{
                        controls: '#contact_list_filter',
                        gutter: 20
                    });
                });
            })

        }
    ]);