angular
    .module('rubycampusApp')
    .controller('payslipreject_to_revertCtrl', [
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

            var $formValidate = $('#form_validation');
            $formValidate
            .parsley()
            .on('form:validated',function() {
                $scope.$apply();
            })
            .on('field:validated',function(parsleyField) {
                if($(parsleyField.$element).hasClass('md-input')) {
                    $scope.$apply();
                }
            });

            $scope.clearValidation=function(){
                $('#form_validation').parsley().reset();
            }

            $scope.viewData=[];
            $scope.payslipList=[];
            $http({
                method:'GET',
                url: $localStorage.service+'PayrollPayslipAPI/fetchEmployeePayDetails',
                params:{id:$stateParams.id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.viewData=return_data.data.message[0];
                $scope.employeeID=return_data.data.message[0].ID;
                $scope.structureID=return_data.data.message[0].PAY_STRUCTURE_ID;
                $scope.getPayslipDetail(return_data.data.message[0].ID,return_data.data.message[0].PAY_STRUCTURE_ID,return_data.data.message[0].BASIC_PAY);
            });

            $scope.getPayslipDetail=function(emp_id,stru_id,basicPay){
                $http({
                    method:'GET',
                    url: $localStorage.service+'PayrollPayslipAPI/fetchPaySlipAddonDetails',
                    params:{
                        'empId':emp_id,
                        'pay_struc_ID':stru_id,
                        'genDate':$localStorage.generationDate
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    $scope.checkStatus=return_data.data.message;
                    $scope.basicAMount=return_data.data.message.BASIC_PAY_AMOUNT;
                    $scope.genDates=return_data.data.message.GEN_DATE;
                    $scope.PAYSLIP_ID=return_data.data.message.PAYSLIP_ID;
                    $scope.payslipList=return_data.data.message.addon;
                    var TotalEarns=0;
                    var TotalDeduc=0;
                    angular.forEach(return_data.data.message.addon, function(value , key) {
                        if(value.TYPE=='Earnings'){
                            value.changedAmount=value.AMOUNT || 0;
                            TotalEarns+=parseFloat(value.changedAmount);
                        }else if(value.TYPE=='Deductions'){
                            value.changedAmount= value.AMOUNT || 0;
                            TotalDeduc+=parseFloat(value.changedAmount);
                        }
                    })
                    $scope.Total_Earning=(parseFloat(basicPay)+parseFloat(TotalEarns)).toFixed(2);
                    $scope.toatl_deduction=parseFloat(TotalDeduc).toFixed(2);
                    $scope.TotalNetPay=parseFloat($scope.Total_Earning-$scope.toatl_deduction).toFixed(2);
                });
            }

            $scope.addEarning=function(){
                $scope.tit_caption="Add Earning";
                $scope.pay_type='Earnings';
                $scope.pay_name='';
                $scope.pay_amount='';
                $('.uk-modal').find('input').trigger('blur');
            }
            $scope.addDeduction=function(){
                $scope.tit_caption="Add Deduction";
                $scope.pay_type='Deductions';
                $scope.pay_name='';
                $scope.pay_amount='';
                $('.uk-modal').find('input').trigger('blur');
            }

            $scope.getCalculation=function(){ 
                var totalEarn=0;
                var totalDeduct=0;
                var basicVal=$scope.basicAMount;
                angular.forEach($scope.payslipList,function(value, keys){
                     if (value.TYPE=='Earnings') {
                        console.log(value.ITEM_AMOUNT,'ITEM_AMOUNT');
                        // value.AMOUNT= value.AMOUNT || 0;
                        if(value.ITEM_AMOUNT==null){
                            value.AMOUNT= value.AMOUNT || 0;
                            value.changedAmount=parseFloat(value.AMOUNT);
                            totalEarn+=parseFloat(value.changedAmount);
                        }else {
                            value.changedAmount=((value.ITEM_AMOUNT/100)*basicVal).toFixed(2);
                            totalEarn+=parseFloat(value.changedAmount);
                        }

                    }else if (value.TYPE=='Deductions'){

                        if(value.ITEM_AMOUNT==null){
                            value.AMOUNT= value.AMOUNT || 0;
                            value.changedAmount=parseFloat(value.AMOUNT);
                            totalDeduct+=parseFloat(value.changedAmount);
                        }else {
                            value.changedAmount=((value.ITEM_AMOUNT/100)*basicVal).toFixed(2);
                            totalDeduct+=parseFloat(value.changedAmount);
                        }
                    }
                    
                });

                var totalADDEarn=0;
                var totalADDDeduct=0;
                angular.forEach($scope.PaySrtuctureData1,function(value, keys){
                    if (value.TYPE=='Earnings') {
                        value.AMOUNT= value.AMOUNT || 0;
                        totalADDEarn+=parseFloat(value.AMOUNT);
                    }else if (value.TYPE=='Deductions'){
                        value.AMOUNT= value.AMOUNT || 0;
                        totalADDDeduct+=parseFloat(value.AMOUNT);
                    }
                    
                });
                var TotalNumberE=(parseFloat(basicVal)+parseFloat(totalEarn)+parseFloat(totalADDEarn)).toFixed(2);
                $scope.Total_Earning=(angular.isNumber(TotalNumberE)? 0.00:TotalNumberE);
                var TotalNumberD=parseFloat(totalDeduct)+parseFloat(totalADDDeduct);
                $scope.total_deduction=(angular.isNumber(TotalNumberD)? TotalNumberD:0.00).toFixed(2);
                var totalNetpay=parseFloat($scope.Total_Earning) - parseFloat($scope.total_deduction);
                $scope.TotalNetPay = totalNetpay.toFixed(2);
            }


            $scope.generatePdf = function(id) {
              $http({
                // url : 'http://localhost/ruby/Rubyctrl/index',
                url: $localStorage.service+'PayrollPayslipAPI/index',
                method : 'POST',
                data : { 'id':id,'genDate':$localStorage.generationDate},
                responseType : 'arraybuffer',
                headers: {
                 'Content-type' : 'application/pdf'
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
                        $state.go('restricted.hr.rejectpayslip');
                    }
                });
            }
            console.log($localStorage.generationDate,'$localStorage.generationDate');
            $scope.deletePayslipDetails=function(payslipID){
                if(payslipID){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(payslipID){
                           $http({
                                url: $localStorage.service+'PayrollPayslipAPI/payslipDelete',
                                method : 'DELETE',
                                params : { 'id':payslipID},
                                headers:{'access_token':$localStorage.access_token}
                            }).success(function(data) {
                                console.log(data,'success');
                                $state.go('restricted.hr.rejectpayslip');
                            }).error(function(data){
                                console.log(data,'error');
                            });
                        }
                    },function(){
                        // console.log("false");
                    }, {
                        labels: {
                            'Ok': 'Ok'
                        }
                    });
                }
            }
            $scope.genBtn=false;
            $scope.editBTN=true;
            $scope.addonData=false;
            $scope.editPayslip=function(){
               $('#basicpay') .attr('disabled',false);
               $scope.genBtn=true;
               $scope.editBTN=false;
               $scope.addonData=true;
            }
            $scope.GeneratePayslip=function(){

                // var date=moment($scope.genDates,["YYYY-MM-DD"])._d;
                // console.log(date,'dateee');
                // var y = date.getFullYear(), m = date.getMonth();
                // var firstDay = moment([y, m, 1]);
                // var lastDay = moment(firstDay).endOf('month');
                // var locale = "en-us";
                // var currMonth=firstDay._d.getMonth()+1;
                // var currMonth1=lastDay._d.getMonth()+1;
                // var firstDate= firstDay._d.getDate() < 10 ? '0' + firstDay._d.getDate() : '' + firstDay._d.getDate();
                // var firstmonth= currMonth < 10 ? '0' + currMonth : '' + currMonth;
                // var lastDataofmonth= currMonth1 < 10 ? '0' + currMonth1 : '' + currMonth1;
                // var fromDate=y+"-"+firstmonth+"-"+firstDate;
                // var toDate=y+"-"+lastDataofmonth+"-"+lastDay._d.getDate();
                // console.log(fromDate,'fromDate',toDate);


                $http({
                    url: $localStorage.service+'PayrollPayslipAPI/updatePayslipGeneration',
                    // url: $localStorage.service+'PayrollPayslipAPI/generateRejectedPayslip',
                    method : 'POST',
                    data : { 
                        'payslipid':$scope.PAYSLIP_ID,
                        'netpay':$scope.TotalNetPay,
                        'basicpay':$scope.basicAMount,
                        'addonDetails':$scope.PaySrtuctureData1,
                        'basicDetail':$scope.payslipList,
                        'empid' : $scope.employeeID,
                        'struc_id' : $scope.structureID,
                        'generatoin_date' : $scope.genDates,
                    },

                    // data: {
                    //     'empid' : $scope.employeeID,
                    //     'struc_id' : $scope.structureID,
                    //     'payslipId':$scope.payslipId,
                    //     'generatoin_date' : $scope.genDates,
                    //     'default_data' : $scope.payslipList,
                    //     'addon_data' : $scope.PaySrtuctureData1,
                    //     'Net_pay' : $scope.TotalNetPay,
                    //     'fromdate' : fromDate,
                    //     'enddate' : toDate,
                    //     'basicPay' : $scope.basicAMount
                    // },

                    headers:{'access_token':$localStorage.access_token}
                }).success(function(result) {
                    console.log(result,'success');
                     UIkit.notify({
                        message : result.message.message,
                        status  : 'success',
                        timeout : 2000,
                        pos     : 'top-center'
                    });
                    $state.go('restricted.hr.rejectpayslip');
                }).error(function(result){
                    console.log(result,'error');
                });
            }
            $scope.earningCalculation=function(basicVal){
                console.log(basicVal,'basicVal');
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
                // console.log($scope.NetpayAmount,'$scope.NetpayAmount');
            }

            $scope.PaySrtuctureData1=[];
            $scope.saveAddonData=function(){
                if($scope.pay_type=='Earnings'){
                    $scope.PaySrtuctureData1.push({'NAME':$scope.pay_name,'AMOUNT':$scope.pay_amount,'TYPE':'Earnings'});
                }else if($scope.pay_type=='Deductions'){
                    $scope.PaySrtuctureData1.push({'NAME':$scope.pay_name,'AMOUNT':$scope.pay_amount,'TYPE':'Deductions'});
                }
                $timeout(function(){
                    $scope.getCalculation();
                },200);
                UIkit.modal("#open_Model").hide();
            }

            $scope.removeEarningItem=function($index){
                $scope.PaySrtuctureData1.splice($index, 1);
                $timeout(function(){
                    $scope.getCalculation();
                },200);
            }
            $scope.removeDeductionItem=function($index){
                $scope.PaySrtuctureData1.splice($index, 1);
                $timeout(function(){
                    $scope.getCalculation();
                },200);
            }

        }
    ]);