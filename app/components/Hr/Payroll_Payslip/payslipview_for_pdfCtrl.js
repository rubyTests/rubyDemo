angular
    .module('rubycampusApp')
    .controller('payslipview_for_pdfCtrl', [
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
            $scope.editBTN=true;
            $scope.editPayDetails=function(){
                $('#basicpay').attr('disabled',false);
                $scope.btnStatus=true;
                $scope.editBTN=false;
            }
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
                    $scope.PAYSLIP_ID=return_data.data.message.PAYSLIP_ID;
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

            $scope.earningCalculation=function(basicVal){
                var perOfTotalEarn=0;
                var perOfTotalDeduc=0;
                $('[name="earningAmount"]').each(function(){
                    perOfTotalEarn+=parseFloat($(this).val());
                })

                 $('[name="deductionAmount"]').each(function(){
                    perOfTotalDeduc+=parseFloat($(this).val());
                })
                // console.log(perOfTotalEarn,'-',perOfTotalDeduc);
                var SUMTotal_Earning=parseFloat(basicVal) + parseFloat(perOfTotalEarn);
                $scope.Total_Earning=SUMTotal_Earning.toFixed(2);
                $scope.total_deduction=parseFloat(perOfTotalDeduc).toFixed(2);
                $scope.showTotalNetpay=parseFloat($scope.Total_Earning-$scope.total_deduction).toFixed(2);
                $scope.NetpayAmount=parseFloat($scope.Total_Earning-$scope.total_deduction).toFixed(2);
                $scope.TotalNetPay=$scope.NetpayAmount;
            }
            $scope.assignPayroll=function(){
                // console.log('test');
                // console.log($scope.payslipList,'payslipList',$scope.PAYSLIP_ID);
                // console.log($scope.PAYSLIP_ID,'basic');
                // console.log($scope.TotalNetPay,'netpay');
                $http({
                    url: $localStorage.service+'PayrollPayslipAPI/updatePayslipGeneration',
                    method : 'POST',
                    data : { 
                        'payslipid':$scope.PAYSLIP_ID,
                        'netpay':$scope.TotalNetPay
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).success(function(result) {
                    console.log(result,'success');
                     UIkit.notify({
                        message : result.message.message,
                        status  : 'success',
                        timeout : 2000,
                        pos     : 'top-center'
                    });
                    $state.go('restricted.hr.payslipGenaration_view');
                }).error(function(result){
                    console.log(result,'error');
                });
            }
            $scope.generatePdf = function(id) {
              $http({
                // url : 'http://localhost/ruby/Rubyctrl/index',
                //url: $localStorage.service+'PayrollPayslipAPI/index',
                url: 'http://localhost/PDF_Generate/mpdf-codeigniter/',
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