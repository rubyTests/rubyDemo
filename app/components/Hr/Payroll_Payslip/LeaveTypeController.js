angular
    .module('altairApp')
    .controller('tables_examplesCtrl', [
        '$scope',
        '$timeout',
        'editableOptions',
        'editableThemes',
        'Leave_Type',
        function ($scope,$timeout,editableOptions, editableThemes,Leave_Type) {
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
            $scope.Leave_Type=Leave_Type;
            $scope.PayItemRepeatData =[].concat($scope.Leave_Type);
            $scope.itemsByPage=5;
            // $scope.rowCollection = [
            //     {empCateName: "Vijaraj",empCatePrefix:"empCatePrefix",empCateActive:"Y"},
            //     {empCateName: "Karthik",empCatePrefix:"empCatePrefix",empCateActive:"N"},
            //     {empCateName: "Senthil",empCatePrefix:"empCatePrefix",empCateActive:"Y"},
            //     {empCateName: "Manikandan",empCatePrefix:"empCatePrefix",empCateActive:"N"},
            //     {empCateName: "Guru",empCatePrefix:"empCatePrefix",empCateActive:"Y"},
            //     {empCateName: "empCateName",empCatePrefix:"empCatePrefix",empCateActive:"N"},
            //     {empCateName: "empCateName",empCatePrefix:"empCatePrefix",empCateActive:"Y"},
            //     {empCateName: "empCateName",empCatePrefix:"empCatePrefix",empCateActive:"N"}
            // ];
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