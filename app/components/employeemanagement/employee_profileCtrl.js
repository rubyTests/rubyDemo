angular
    .module('rubycampusApp')
    .controller('employee_profileCtrl', [
        '$rootScope',
        '$scope',
        'user_data',
        '$stateParams',
        '$filter',
        function ($rootScope,$scope,user_data,$stateParams,$filter) {    
            console.log($stateParams,'stateParams');
            var paramsData=$filter('filter')(user_data, {id : $stateParams.emp_id});
            $scope.user_data = paramsData[0];
            //$scope.user_data_contacts = user_data[0].contact;
        }
    ])
;