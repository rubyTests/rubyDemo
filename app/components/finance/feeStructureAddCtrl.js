angular
    .module('altairApp')
    .controller('feeStructureAddCtrl', [
        '$scope',
        '$window',
        '$timeout',
        function ($scope,$window,$timeout) {

        	$scope.backBtn = function(){
	            window.history.back();
	        }

        }
    ]);