angular
    .module('rubycampusApp')
    .controller('payslipview_reportCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$stateParams',
        '$filter',
        '$location',
        '$http',
        '$window',
        '$localStorage',
        '$state',
        function ($scope,$rootScope,$timeout,$resource,$stateParams,$filter,$location,$http,$window,$localStorage,$state) {
          

                var path=$location.path().split( '/' );
                $scope.urlname=path[1];

            

            $scope.viewData=[];
            $scope.payslipList=[];
            $http({
                method:'GET',
                url: $localStorage.service+'PayrollPayslipAPI/fetchEmployeePayDetails',
                params:{id:$stateParams.id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.viewData=return_data.data.message[0];
                $scope.getPayslipDetail(return_data.data.message[0].ID,return_data.data.message[0].PAY_STRUCTURE_ID,return_data.data.message[0].BASIC_PAY);
            });

            $scope.getPayslipDetail=function(emp_id,stru_id,basicPay){
                $http({
                    method:'GET',
                    url: $localStorage.service+'PayrollPayslipAPI/fetchPaySlipAddonDetails',
                    params:{
                        'empId':emp_id,
                        'pay_struc_ID':stru_id,
                        'genDate':$localStorage.GenDate
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    $scope.checkStatus=return_data.data.message;
                    $scope.payslipList=return_data.data.message.addon;
                        var TotalEarns=0;
                        var TotalDeduc=0;
                        angular.forEach(return_data.data.message.addon, function(value , key) {
                            if(value.TYPE=='Earnings'){
                                value.AMOUNT=value.AMOUNT || 0;
                                TotalEarns+=parseFloat(value.AMOUNT);
                            }else if(value.TYPE=='Deductions'){
                                value.AMOUNT= value.AMOUNT || 0;
                                TotalDeduc+=parseFloat(value.AMOUNT);
                            }
                        })
                        $scope.Total_Earning=(parseFloat(basicPay)+parseFloat(TotalEarns)).toFixed(2);
                        $scope.toatl_deduction=parseFloat(TotalDeduc).toFixed(2);
                        $scope.TotalNetPay=parseFloat($scope.Total_Earning-$scope.toatl_deduction).toFixed(2);
                });
            }

            $scope.generatePdf = function(id) {
              $http({
                // url : 'http://localhost/ruby/Rubyctrl/index',
                url: $localStorage.service+'PayrollPayslipAPI/index',
                method : 'POST',
                data : { 'id':id,'genDate':$localStorage.GenDate},
                responseType : 'arraybuffer',
                headers: {
                'Content-type' : 'application/pdf',
                // 'access_token':$localStorage.access_token
                },
                cache: true,
               }).success(function(data) {
                var blob = new Blob([data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(blob);
                var fileName = "1099.pdf";
                var contentFile = blob;
                $window.open(fileURL, "_blank");
               }).error(function(data){
                console.log('error');
               });
            }
            $scope.changeStatus=function(payslip_id,pay_status){
                console.log(payslip_id,pay_status,'dsds');
                $http({
                    method:'POST',
                    url: $localStorage.service+'PayrollPayslipAPI/updatePayslipStatus',
                    data:{
                        'payslipID':payslip_id,
                        'status':pay_status
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.status,'return_data.data');
                    if(return_data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $state.go('restricted.finance.payslipGenaration_view');
                    }
                });
            }
            console.log($localStorage.GenDate,'$localStorage.GenDate');
        }
    ]);