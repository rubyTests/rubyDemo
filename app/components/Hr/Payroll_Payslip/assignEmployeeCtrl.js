angular
    .module('altairApp')
    .controller('assignEmployeeCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        function ($scope,$rootScope,$timeout) {
            $scope.deptArray=[];
            // $resource('app/components/academics/courseBatch/department.json')
            // .query()
            // .$promise
            // .then(function(return_data) {
            //     console.log(return_data,'return_data');
            //     $scope.deptArray.push(return_data);
            // });

            $scope.selectize_dept_data = $scope.deptArray;
            $scope.selectize_dept_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department...',
                valueField: 'value',
                labelField: 'title',
                onInitialize: function(selectize){
                    selectize.on('change', function() {
                        console.log('on "change" event fired');
                    });
                }
            };
        }
    ]);