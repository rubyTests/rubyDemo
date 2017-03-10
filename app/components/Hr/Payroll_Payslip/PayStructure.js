angular
    .module('altairApp')
    .controller('PayStructure', [
        '$scope',
        '$timeout',
        'editableOptions',
        'editableThemes',
        'Pay_item',
        function ($scope,$timeout,editableOptions, editableThemes,Pay_item) {
            editableThemes.bs3.inputClass = 'md-input';
            editableThemes.bs3.buttonsClass = 'btn-sm';
            editableOptions.theme = 'bs3';
            $scope.selectize_c_options = ['5','10','15','20','50'];
            $scope.selectize_c_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select...'
            };
            //array data//
            $scope.Pay_item=Pay_item;
            $scope.PayItemRepeatData =[].concat($scope.Pay_item);
            // console.log($scope.PayItemRepeatData.length,'$scope.PayItemRepeatData');
            //array data//
            $scope.itemsByPage=5;
            $scope.table = {
                'row4': true
            };

            $scope.table2 = {
                'row1': true
            }
            $scope.addNewrow=function(){
                // alert();           
                var newid  =$scope.PayItemRepeatData.length + 1;
                var newid1  =$scope.Pay_item.length + 1;
                console.log(newid,'newid');
                $scope.emptyData={id:newid,Name:""};
                var data=$scope.Pay_item.push($scope.emptyData);
                console.log(data,"data");
                console.log($scope.Pay_item,"$scope.Pay_item");
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