angular
    .module('rubycampusApp')
    .controller('ViewPayGroupCtrl', ['$scope','$stateParams','Pay_item','Pay_Structure','Pay_Group','$filter',
    function($scope,$stateParams,Pay_item,Pay_Structure,Pay_Group,$filter){
        $scope.EarningsDiv=true;
        $scope.DeductionDiv=true;
        $scope.hrtagLine=true;
        $scope.UserDatas = $filter('filter')(Pay_Structure, {id : parseInt($stateParams.id) }, true);
        $scope.getEarning = $filter('filter')(Pay_Group ,  {PayStructure_id : parseInt($stateParams.id) }, true);
        $scope.getItemNameFun = function(id){
            $scope.payItemStructure = $filter('filter')(Pay_item,{id : id} ,true);
            if($scope.payItemStructure[0]) {
               return $scope.payItemStructure[0];
            }
        };
        $scope.EarningsData=[];
        $scope.DeductionData=[];
        angular.forEach($scope.getEarning, function(value, key){
            var PayitemData=$scope.getItemNameFun(value.Pay_item_id);
            // console.log(PayitemData.len,'PayitemData');
            if (PayitemData.Type=="Earnings") {
                $scope.EarningsData.push({Name : PayitemData.Name, Type : "Earnings",Amount : value.Amount});
            }else if (PayitemData.Type=="Deduction"){
                $scope.DeductionData.push({Name : PayitemData.Name, Type : "Deduction",Amount : value.Amount});
            }
        });
        if($scope.EarningsData.length==0){
            $scope.EarningsDiv=false;
        }
        if($scope.DeductionData.length==0){
            $scope.DeductionDiv=false;
        }
        if( $scope.EarningsDiv && $scope.DeductionDiv == false){
            $scope.hrtagLine=false;
            // alert();
        }
        // console.log($scope.EarningsData.length,'$scope.EarningsData');
        //  console.log($scope.DeductionData.length,'$scope.DeductionData');
    }]);