angular
    .module('altairApp')
    .controller('assignleaveCategoryCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$filter',
        '$resource',
        function ($scope,$rootScope,$timeout,$filter,$resource) {
            $scope.employeeData=[];
            $scope.categoryArray=[];
            $scope.positionData=[];
            $resource('app/components/employeemanagement/employee_list.json')
            .query()
            .$promise
            .then(function(employee_data) {
                $scope.employeeData.push(employee_data);
            });

            $resource('app/components/Hr/configuration/category.json')
            .query()
            .$promise
            .then(function(category_data) {
                $scope.categoryArray.push(category_data);
            });

            $resource('app/components/Hr/configuration/position.json')
            .query()
            .$promise
            .then(function(position_data) {
                $scope.positionData.push(position_data);
            });
            $scope.selectize_employee_option = $scope.employeeData;
            $scope.selectize_employee_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Employee...',
                valueField: 'id',
                labelField: 'firstname',
                onInitialize: function(selectize){
                    selectize.on('change', function() {
                        console.log('on "change" event fired');
                    });
                }
            };

            $scope.selectize_position_option = $scope.positionData;
            $scope.selectize_position_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Position...',
                valueField: 'id',
                labelField: 'name',
                onInitialize: function(selectize){
                    selectize.on('change', function() {
                        console.log('on "change" event fired');
                    });
                }
            };

            $scope.selectize_category_option = $scope.categoryArray;
            $scope.selectize_category_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Category...',
                valueField: 'id',
                labelField: 'name',
                onInitialize: function(selectize){
                    selectize.on('change', function() {
                        console.log('on "change" event fired');
                    });
                }
            };

            $scope.select_option="employee";
        }
    ]);