angular
    .module('altairApp')
    .controller('ViewPayGroupCtrl', ['$scope','$stateParams','Pay_item','Pay_Structure','Pay_Group','$filter',
    function($scope,$stateParams,Pay_item,Pay_Structure,Pay_Group,$filter){
        alert(ViewPayGroupCtrl);
        $scope.StructureData=[{id :1,name: "asdasd"}];
        $scope.Pay_item=Pay_item;
        $scope.Pay_Group=Pay_Group;
        $scope.testData="yesy";
        $scope.UserDatas = $filter('filter')(Pay_Structure, {id : parseInt($stateParams.id) }, true);
        // $scope.StructureData.push($scope.UserDatas);
        console.log($scope.UserDatas,'$scope.UserDatas');
        $scope.testFUN=function(){
            alert();
        }
    }]);
