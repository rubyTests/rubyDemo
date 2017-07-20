angular
    .module('rubycampusApp')
    .controller('repositoryViewCtrl', [
        '$stateParams',
        '$scope',
        '$rootScope',
        'utils',
        'repository_articles',
        '$localStorage',
        '$http',
        function ($stateParams,$scope,$rootScope,utils,repository_articles,$localStorage,$http) {
            $rootScope.toBarActive = true;
            $scope.$on('$destroy', function() {
                $rootScope.toBarActive = false;
            });
			
			$scope.uploadUrl=$localStorage.uploadUrl;
			
			if($localStorage.role_id==3 || $localStorage.role_id==4){
				$scope.userRole=false;
			}else{
				$scope.userRole=true;
			}
			
            $scope.repository_articles = repository_articles;

            $scope.viewData=[];
            $http({
                method:'GET',
                url: $localStorage.service+'RepositoryAPI/mGetCourseBased',
				params:{profileId:$localStorage.userProfile_id,roleId:$localStorage.role_id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.viewData=return_data.data.message;
                console.log($scope.viewData,'$scope.viewData');
            });

            $scope.article = utils.findByItemId($scope.repository_articles, $stateParams.articleId);

            $scope.getYTSrc = function(src) {
                return 'https://www.youtube.com/embed/' + src + '?rel=0';
            };

            $scope.getSoundCloudSrc = function(src) {
                return 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + src + '&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true';
            };

            // var categoryData = $scope.repository_articles;
            // var categoryDataNames = categoryData.map(function(item){return item.Repository_Category;});

            // $scope.selectize_category_options = categoryDataNames;
            // $scope.selectize_category_config = {
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Find Catecory'
            // };

            $scope.CategoryData=[];
            $http({
                method : 'GET',
                url : $localStorage.service+'RepositoryAPI/Rep_Category',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.CategoryData.push(return_data.data.message);
            })

            $scope.selectize_category_options =$scope.CategoryData;
            $scope.selectize_category_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Category',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };

        }
    ]);