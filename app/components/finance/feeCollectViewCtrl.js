angular
    .module('rubycampusApp')
    .controller('feeCollectViewCtrl', [
        '$scope',
        '$window',
        '$timeout',
        '$filter','$localStorage','$http','$state','$stateParams',
        function ($scope,$window,$timeout,$filter,$localStorage,$http,$state,$stateParams) {
            // console.log($stateParams.student_feeid,'stateParams');
            $scope.feesItem=[];
            $scope.totalAmount = 0;
            $scope.newData = [];
            var $formValidate = $('#form_validation');
                $formValidate
                .parsley()
                .on('form:validated',function() {
                    // $scope.$apply();
                })
                .on('field:validated',function(parsleyField) {
                    if($(parsleyField.$element).hasClass('md-input')) {
                        // $scope.$apply();
                    }
                });

            $http({
                url: $localStorage.service+'FinanceAPI/fetchStudentBasicDetails',
                method : 'GET',
                params:{'stud_fee_id':$stateParams.student_feeid},
                headers: { 'access_token':$localStorage.access_token},
            }).success(function(response) {
                console.log(response.message,'stud');
                $scope.BasicDetails=response.message[0];
                $scope.student_feeID=response.message[0].ID;
                $scope.student_profileID=response.message[0].STUDENT_PROFILE_ID;
                $timeout(function(){
                    $scope.sendStudentProfileid(response.message[0].STUDENT_PROFILE_ID);
                },500);
            }).error(function(data){
                console.log('error');
            });
            

            $scope.selectize_paymode_options = ["Cash", "Cheque", "DD","Others"];
            $scope.selectize_paymode_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Payment Mode'
            };

            $scope.selectize_fine_options = ["Tution Fee Fine", "Book Fee Fine", "Hostel Fine"];
            $scope.selectize_fine_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Fine'
            };

            $scope.structureList=[];
            $scope.sendStudentProfileid=function(profileid){
                console.log(profileid,'profileid');
                $http({
                    url: $localStorage.service+'FinanceAPI/feeStructure',
                    method : 'GET',
                    params:{'profileID':profileid},
                    headers: { 'access_token':$localStorage.access_token},
                }).success(function(response) {
                    console.log(response.message,'fee structure');
                    $scope.structureList.push(response.message);
                }).error(function(data){
                    console.log('error');
                });
            }


            $scope.struct_data = $scope.structureList;

            var feeStruct_data = $scope.selectize_feeStruct_options = $scope.structureList;

            $scope.selectize_feeStruct_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                maxItems: null,
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                create: false,
                placeholder: 'Fee Structure',
                render: {
                    option: function(feeStruct_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(feeStruct_data.NAME) + '</span><br>' +
                            '</div>';
                    }
                },
                onDelete:function(values){
                    var data = $filter('filter')($scope.struct_data, {id : values[0]}, true);
                    var Dataindex=$scope.newData.indexOf(data[0]);
                    $scope.newData.splice(Dataindex,1);
                    $scope.feesItem.splice(Dataindex,1);
                    $scope.changePaid();
                    $scope.getFineAmount();
                },
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        // $scope.changePaid(); 
                        $scope.payFees(value,$scope.student_profileID);
                        $scope.getfeeFine(value,$scope.student_profileID);
                        // if(selectize){
                        //     var splitVal = selectize.split(',');
                        //     var total = 0;
                        //     var selectizeData = $filter('filter')($scope.struct_data, {id : splitVal.pop()});
                        //     var temparray=[];
                        //     angular.forEach(selectizeData[0].FeeItemCount, function(value,keys){
                        //         temparray[keys]={fees:value.Amount, id:selectizeData[0].id, fixedFee:value.Amount};
                        //         total+=parseInt(value.Amount);
                        //     });
                        //     if ($scope.newData.indexOf(selectizeData[0])==-1){
                        //         $scope.newData.push(selectizeData[0]);
                        //         $scope.feesItem.push(temparray);
                        //     }
                        //     $scope.changePaid(); 
                        // }
                    });
                }
            };

            $scope.structureItems=[];
            $scope.payFees=function(value,profileId){
                $http({
                    url: $localStorage.service+'FinanceAPI/feePayment',
                    method : 'GET',
                    params:{'structure_id':value,'profileId':profileId},
                    headers: { 'access_token':$localStorage.access_token},
                }).success(function(response) {
                    console.log(response,'fee structure');
                    $scope.structureItems=[];
                    if(response.status==true){
                        $scope.structureItems=response.message;
                    }
                    $scope.changePaid();
                }).error(function(data){
                    console.log('error');
                    $scope.structureItems=[];
                    $scope.changePaid();
                });
            }
            
            $scope.feefineItems=[];
            $scope.getfeeFine=function(value,profileId){
                $http({
                    url: $localStorage.service+'FinanceAPI/fetchFeefineItem',
                    method : 'GET',
                    params:{'structure_id':value,'profileId':profileId},
                    headers: { 'access_token':$localStorage.access_token},
                }).success(function(response) {
                    console.log(response,'fee FINEITEM');
                    $scope.feefineItems=[].concat(response.message);
                    $scope.getFineAmount();
                }).error(function(data){
                    console.log('error');
                    $scope.feefineItems=[];
                    $scope.getFineAmount();
                });
            }

            var d=new Date();
            var year=d.getFullYear();
            var month=d.getMonth()+1;
            var day=d.getDate();
            if (month<10){
            month="0" + month;
            }else{
                month= month;
            };
            if (day<10){
            dayNew="0" + day;
            }else{
                dayNew = day;
            };
            
            $scope.date=dayNew + "." + month + "." + year;
            $scope.payment_date = $scope.date;
           

            var $maskedInput = $('.masked_input');
            if($maskedInput.length) {
                $maskedInput.inputmask();
            }

            $scope.changePaid = function () {
                var Paidtotal = 0;
                var Fixedtotal = 0;
                var dueAmount=0;
                angular.forEach($scope.structureItems, function(value,keys){
                    // console.log(value,"value");
                    angular.forEach(value.list, function(value1,keys1){
                        // console.log(value1,"value1");
                        Paidtotal+=parseInt(value1.AMOUNT);
                        Fixedtotal+=parseInt(value1.AMOUNT);
                        dueAmount+=parseInt(value1.TOTAL_PAID_AMOUNT || 0);
                    });
                });
                // console.log(dueAmount,'dueAmountdueAmount');
                // $scope.totalPaid=Paidtotal;
                $scope.totalDueAmount=dueAmount;
                $scope.totalAmount = Fixedtotal;
            };

            $scope.getFineAmount = function () {
                var PaidFinetotal = 0;
                var FixedFinetotal = 0;
                var dueFineAmount=0;
                angular.forEach($scope.feefineItems, function(value1,keys){
                    // FixedFinetotal+=parseInt(value1.VALUE);
                    // dueFineAmount+=parseInt(value1.TOTAL_PAID_FINE_AMOUNT);

                    angular.forEach(value1.finelist, function(value,keys1){
                        console.log(value,"value11111");
                        if(value.FINE_AMOUNT!=0){
                            FixedFinetotal+=parseInt(value.FINE_AMOUNT);
                            PaidFinetotal+=parseInt(value.TOTAL_PAID_FINE_AMOUNT || 0);
                        }
                        // Paidtotal+=parseInt(value1.AMOUNT);
                        // Fixedtotal+=parseInt(value1.AMOUNT);
                        // dueAmount+=parseInt(value1.TOTAL_PAID_AMOUNT || 0);
                    });

                });
                $scope.totalFINEAmount = FixedFinetotal;
                $scope.totalFINEPaid=PaidFinetotal;
                // console.log($scope.totalFINEAmount,$scope.totalFINEPaid,'$scope.totalFINEAmount-$scope.totalFINEPaid');
                $scope.totalFINEDueAmount=$scope.totalFINEAmount-$scope.totalFINEPaid;
                // console.log($scope.totalFINEDueAmount,'$scope.totalFINEDueAmount');
            };

            $scope.feeBtn=false;
            $scope.changePayamount=function(Amount){
                var Paidtotal = 0;
                angular.forEach($scope.structureItems, function(value,keys){
                    // Paidtotal+=parseInt(value1.AMOUNT1 || 0);
                    angular.forEach(value.list, function(value1,keys1){
                        Paidtotal+=parseInt(value1.AMOUNT1 || 0);
                    });
                });
                angular.forEach($scope.feefineItems, function(value,keys){
                    // console.log(value1,"value1");
                    // Paidtotal+=parseInt(value1.AMOUNT1 || 0);
                    angular.forEach(value.finelist, function(value1,keys1){
                        Paidtotal+=parseInt(value1.AMOUNT1 || 0);
                    });
                });
                $scope.totalPaid=Paidtotal;
                if (Paidtotal=='0') {
                    $scope.feeBtn=false;
                }else{
                    $scope.feeBtn=true;
                }
            }
            $scope.sendpayFeesDetail=function(){
                console.log('$scope.feeItem',$scope.feefineItems);
                $http({
                    url: $localStorage.service+'FinanceAPI/saveFeePayment',
                    method : 'POST',
                    data:{
                        'student_feeID':$scope.student_feeID,
                        'payment_date':$scope.payment_date,
                        'payment_mode':$scope.selectize_paymode,
                        'refence_no':$scope.refence_no,
                        'cheque_no':$scope.cheque_no,
                        'dd_no':$scope.dd_no,
                        'bankname':$scope.bankname,
                        'totalpay':$scope.totalPaid,
                        'item_data':$scope.structureItems,
                        'fineItem':$scope.feefineItems,
                        'profileid':$scope.student_profileID
                    },
                    headers: { 'access_token':$localStorage.access_token},
                }).success(function(response) {
                    console.log(response,'responseeeeeeeeeee');
                    if(response.message.status==true){
                        UIkit.notify({
                            message : response.message.message,
                            status  : 'success',
                            timeout : 1000,
                            pos     : 'top-center'
                        });
                        $timeout(function(){
                            // $state.go('restricted.finance.fee.feeCollectionDetails');
                             $state.go('restricted.finance.fee.receiptView',{feepaymentid:response.message.FEEPAYMENT_ID});
                        },100);
                    }
                }).error(function(data){
                    console.log('error');
                });
            }
        }
    ]);