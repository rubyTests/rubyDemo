angular
    .module('rubycampusApp')
    .controller('studentprofileCtrl', [
        '$rootScope',
        '$scope',
        'user_data',
        '$stateParams',
        '$filter',
        function ($rootScope,$scope,user_data,$stateParams,$filter) {    
            console.log($stateParams,'stateParams');
            var paramsData=$filter('filter')(user_data, {id : $stateParams.stu_id});
            $scope.user_data = paramsData[0];
        }
    ])
;