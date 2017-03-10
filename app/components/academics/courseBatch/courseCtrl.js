angular
    .module('altairApp')
    .controller('courseCtrl', [
        '$scope',
        '$timeout',
        'editableOptions',
        'editableThemes',
        '$filter',
        'cour_data',
        function ($scope,$timeout,editableOptions, editableThemes,$filter,cour_data) {
            editableThemes.bs3.inputClass = 'md-input';
            editableThemes.bs3.buttonsClass = 'btn-sm';
            editableOptions.theme = 'bs3';
            $scope.cour_data=cour_data;
            $scope.users=[].concat($scope.cour_data);

              $scope.statuses = [
                {value: 1, text: 'status1'},
                {value: 2, text: 'status2'},
                {value: 3, text: 'status3'},
                {value: 4, text: 'status4'}
              ]; 

              $scope.groups = [];
              $scope.loadGroups = function() {
                // return $scope.groups.length ? null : $http.get('/groups').success(function(data) {
                //   $scope.groups = data;
                // });
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
                if(user.status) {
                  selected = $filter('filter')($scope.statuses, {value: user.status});
                }
                return selected.length ? selected[0].text : 'Not set';
              };

              $scope.checkName = function(data, id) {
                if (id === 2 && data !== 'awesome') {
                  return "Username 2 should be `awesome`";
                }
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
            $scope.addRow=function(){
                console.log("in");
                $scope.rowCollection.push({empCateName: "",empCatePrefix:"",empCateActive:"Y"});
                console.log($scope.rowCollection,"in");
            }
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