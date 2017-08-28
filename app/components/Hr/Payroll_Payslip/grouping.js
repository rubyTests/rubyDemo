angular
    .module('rubycampusApp')
    .controller('tables_examplesCtrl', [
        '$scope',
        '$timeout',
        'editableOptions',
        'editableThemes',
        '$filter',
        'Pay_item',
        'Pay_Structure',
        'pay_Group',
        function ($scope,$timeout,editableOptions, editableThemes,$filter,Pay_item,Pay_Structure,pay_Group) {
            editableThemes.bs3.inputClass = 'md-input';
            editableThemes.bs3.buttonsClass = 'btn-sm';
            editableOptions.theme = 'bs3';
            $scope.groupProperty="PayStructure_id";
            $scope.Pay_item=Pay_item;
            $scope.Pay_Structure=Pay_Structure;
            $scope.pay_Group=pay_Group;
            $scope.users=[].concat($scope.pay_Group);
            // console.log($scope.Pay_item,'$scope.Pay_item');
            // console.log($scope.Pay_Structure,'$scope.Pay_Structure');
            // console.log($scope.pay_Group,'$scope.pay_Group');
            $scope.getItemName=function(Item_id){
              $scope.ItemName = $filter('filter')($scope.Pay_item, {id: Item_id});
              console.log($scope.ItemName[0].Name,'item data here');
              return $scope.ItemName[0].Name;
            }
            $scope.getStructureName=function(payStr_id){
              console.log(payStr_id,'payStr_id');
              $scope.getName=$filter('filter')($scope.Pay_Structure,{id : payStr_id });
              return $scope.getName[0].Name;
            }
            $scope.statuses = [
                {id: 1, Freq: 'Monthly'},
                {id: 2, Freq: 'Weekly'},
                {id: 3, Freq: 'Daily'},
              ]; 
            $scope.getStrFrequence=function(payStr_id){
              console.log(payStr_id,'payStr_id');
              $scope.getName=$filter('filter')($scope.Pay_Structure,{id : payStr_id });
              var Resultdata=$filter('filter')($scope.statuses,{id : $scope.getName[0].Frequency});
              // console.log(Resultdata[0].Freq,'Resultdata');
              return Resultdata[0].Freq;
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
            // Frequency
              // $scope.users = [
              //   {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
              //   {id: 2, name: 'awesome user2', status: 2, group: 3, groupName: 'vip'},
              //   {id: 3, name: 'awesome user3', status: 1, group: 3, groupName: 'vip'},
              //   {id: 4, name: 'awesome user4', status: 1, group: 3, groupName: 'vip'},
              //   {id: 5, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
              //   {id: 6, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
              //   {id: 7, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
              //   {id: 8, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
              //   {id: 9, name: 'awesome user3', status: 2, group: null}
              // ]; 

              // $scope.statuses = [
              //   {value: 1, text: 'status1'},
              //   {value: 2, text: 'status2'},
              //   {value: 3, text: 'status3'},
              //   {value: 4, text: 'status4'}
              // ]; 

              // $scope.groups = [];
              // $scope.loadGroups = function() {
              // };

              // $scope.showGroup = function(user) {
              //   if(user.group && $scope.groups.length) {
              //     var selected = $filter('filter')($scope.groups, {id: user.group});
              //     return selected.length ? selected[0].text : 'Not set';
              //   } else {
              //     return user.groupName || 'Not set';
              //   }
              // };

              // $scope.showStatus = function(user) {
              //   var selected = [];
              //   if(user.status) {
              //     selected = $filter('filter')($scope.statuses, {value: user.status});
              //   }
              //   return selected.length ? selected[0].text : 'Not set';
              // };

              // $scope.checkName = function(data, id) {
              //   if (id === 2 && data !== 'awesome') {
              //     return "Username 2 should be `awesome`";
              //   }
              // };

              // $scope.saveUser = function(data, id) {
              //   //$scope.user not updated yet
              //   angular.extend(data, {id: id});
              //   // return $http.post('/saveUser', data);
              // };

              // // remove user
              // $scope.removeUser = function(index) {
              //   $scope.users.splice(index, 1);
              // };

              // add user
            //   $scope.addUser = function() {
            //     $scope.inserted = {
            //       id: $scope.users.length+1,
            //       name: '',
            //       status: null,
            //       group: null 
            //     };
            //     $scope.users.push($scope.inserted);
            //   };
            // $scope.table = {
            //     'row4': true
            // };

            // $scope.table2 = {
            //     'row1': true
            // }
        }
    ]);
    angular
    .module('rubycampusApp')
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