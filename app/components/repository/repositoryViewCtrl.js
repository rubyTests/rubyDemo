angular
    .module('altairApp')
    .controller('repositoryViewCtrl', [
        '$stateParams',
        '$scope',
        'utils',
        'repository_articles',
        function ($stateParams,$scope,utils,repository_articles) {

            $scope.repository_articles = repository_articles;

            $scope.article = utils.findByItemId($scope.repository_articles, $stateParams.articleId);

            $scope.getYTSrc = function(src) {
                return 'https://www.youtube.com/embed/' + src + '?rel=0';
            };

            $scope.getSoundCloudSrc = function(src) {
                return 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + src + '&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true';
            };

            var categoryData = $scope.repository_articles;
            var categoryDataNames = categoryData.map(function(item){return item.Repository_Category;});

            $scope.selectize_category_options = categoryDataNames;
            $scope.selectize_category_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Find Catecory'
            };

        }
    ]);