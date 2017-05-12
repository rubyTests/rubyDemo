angular
    .module('rubycampusApp')
    .controller('ViewPayGroupCtrl',
    function($scope,$stateParams,$http,$localStorage,$timeout,$state){
        $scope.stru_id=$stateParams.id;
        $scope.viewData=[];
        $http({
            method:'GET',
            url: $localStorage.service+'PayrollPayslipAPI/payStructureDetail',
            params:{
                id:$stateParams.id
            },
            headers:{'access_token':$localStorage.access_token}
        }).then(function(return_data){
            console.log(return_data.data.message,'edit');
            $scope.viewData=return_data.data.message;
        });

        $scope.deletepayStructure=function(id){
            $http({
                method:'GET',
                url: $localStorage.service+'PayrollPayslipAPI/checkpayitemAvailableorNot',
                params:{
                    id:id
                },
                headers:{'access_token':$localStorage.access_token}
            }).then(function mySucces(response) {
                console.log(response,'response');
                if(response.data.status==true){
                    UIkit.modal.alert('There are payitems assigned to this pay structure, remove the pay item first to continue deleting pay structure');
                }
            },function myError(response) {
                console.log(response,'error');
                UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                    if(id){
                        $http({
                        method : "DELETE",
                        url : $localStorage.service+"PayrollPayslipAPI/paystructureDelete",
                        params : {id : id},
                        headers:{'access_token':$localStorage.access_token}
                        }).then(function mySucces(response) {
                            console.log('delete',response);
                            UIkit.notify({
                                message : response.data.message,
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });
                            $state.go('restricted.hr.StructureGroup');
                        },function myError(response) {
                        })
                    }
                },function(){
                    // console.log("false");
                }, {
                    labels: {
                        'Ok': 'Ok'
                    }
                });
            })
        }
    });