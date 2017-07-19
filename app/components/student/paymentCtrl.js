angular
    .module('rubycampusApp')
    .controller('paymentCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$stateParams',
        '$filter',
        '$compile',
        '$location',
        '$window',
        '$http',
        '$localStorage','$state',
        function ($scope,$rootScope,$timeout,$resource,$stateParams,$filter,$compile,$location,$window,$http,$localStorage,$state) {
            console.log($localStorage.PayAMounts,'$localStorage');
            $scope.PayAMounts=$localStorage.PayAMounts;
        }
    ]);