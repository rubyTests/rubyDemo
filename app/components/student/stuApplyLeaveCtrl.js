angular
    .module('rubycampusApp')
    .controller('stuApplyLeaveCtrl',
        function($rootScope,$compile, $scope, $timeout) {
            $scope.backBtn = function(){
                window.history.back();
            }
        }
    );