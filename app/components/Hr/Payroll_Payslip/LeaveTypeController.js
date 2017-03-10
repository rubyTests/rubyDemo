angular
    .module('altairApp')
    .controller('tables_examplesCtrl', [
        '$scope',
        '$timeout',
        'editableOptions',
        'editableThemes',
        '$filter',
        'Leave_Type',
        function ($scope,$timeout,editableOptions, editableThemes,$filter,Leave_Type) {
            editableThemes.bs3.inputClass = 'form-control md-input md-input-processed selectized';
            editableThemes.bs3.buttonsClass = 'btn-sm';
            editableOptions.theme = 'bs3';
            $scope.groupProperty="name";
            $scope.Leave_Type=Leave_Type;
            $scope.users=[].concat($scope.Leave_Type);
            console.log($scope.users,'$scope.users');

              $scope.groups = [
              ];
              $scope.loadGroups = function() {

              };

              $scope.showGroup = function(user) {
                if(user.group && $scope.groups.length) {
                  var selected = $filter('filter')($scope.groups, {id: user.group});
                  return selected.length ? selected[0].text : 'Not set';
                } else {
                  return user.groupName || 'Not set';
                }
              };

              $scope.showStatus = function(user) {
                var selected = [];
                if(user.Frequency) {
                  selected = $filter('filter')($scope.statuses, {value: user.Frequency});
                  // console.log(selected,'selected');
                }
                return selected.length ? selected[0].text : 'Not set';
              };

              $scope.checkName = function(data, id) {
                // if (id === 2 && data !== 'awesome') {
                //   return "Username 2 should be `awesome`";
                // }
              };

              $scope.saveUser = function(data, id) {
                //$scope.user not updated yet
                angular.extend(data, {id: id});
                // return $http.post('/saveUser', data);
              };

              // remove user
              $scope.removeUser = function(index) {
                $scope.users.splice(index, 1);
              };

              // add user
              $scope.addUser = function() {
                $scope.inserted = {
                  id: $scope.users.length+1,
                  name: '',
                  status: null,
                  group: null 
                };
                $scope.users.push($scope.inserted);
              };
                $scope.selectize_c_options = ['5','10','15','20','50'];
                $scope.selectize_c_config = {
                    plugins: {
                        'tooltip': ''
                    },
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select...'
                };
            $scope.itemsByPage=5;
           
            $scope.table = {
                'row4': true
            };

            $scope.table2 = {
                'row1': true
            }
        }
    ]);
    angular
    .module('altairApp')
    .directive('pageSelect', function() {
      return {
        restrict: 'E',
        template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
        link: function(scope, element, attrs) {
          scope.$watch('currentPage', function(c) {
            scope.inputPage = c;
          });
        }
      }
    });