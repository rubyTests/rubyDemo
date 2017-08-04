angular
    .module('rubycampusApp')
    .controller('institution_setting', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$stateParams',
        '$filter',
        '$compile',
        '$location',
        '$window',
        '$http',
        '$localStorage',
        '$state',
        function ($scope,$rootScope,$timeout,$resource,$stateParams,$filter,$compile,$location,$window,$http,$localStorage,$state) {
            $scope.student='N';
            $scope.employee='N';
            $scope.material='N';
            $scope.purchase='N';
            $scope.invoice='N';
            $scope.goodsreceipt='N';

            var $formValidate = $('#formdata');
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
            $scope.checkData=function(status,name){
                if(status=='N' && name=='stu'){
                    $scope.student_prefix='';
                    $scope.student_admissionno='';
                }else if(status=='N' && name=='emp'){
                    $scope.employee_prefix='';
                    $scope.employee_admissionno='';
                }else if(status=='N' && name=='material'){
                    $scope.material_prefix='';
                    $scope.m_request_no='';
                }else if(status=='N' && name=='purchase'){
                    $scope.purchase_prefix='';
                    $scope.order_no='';
                }else if(status=='N' && name=='invoice'){
                    $scope.invoice_prefix='';
                    $scope.invoice_no='';
                }else if(status=='N' && name=='goods'){
                    $scope.goods_prefix='';
                    $scope.grn_no='';
                }
                $('.uk-grid').find('input').trigger('blur');
            }

            $http({
                method:'GET',
                url: $localStorage.service+'InstitutionAPI/institutionSettingData',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(response_data){
                console.log(response_data,'response_data111');
                $scope.setting_id=response_data.data.data[0].ID;
                $scope.employee=response_data.data.data[0].EMPLOYEE_ADM_NO;
                $scope.student=response_data.data.data[0].STUDENT_ADM_NO;
                $scope.material=response_data.data.data[0].MATERIAL_REQUEST;
                $scope.purchase=response_data.data.data[0].PURCHASE_ORDER;
                $scope.invoice=response_data.data.data[0].INVOICE;
                $scope.goodsreceipt=response_data.data.data[0].GOODS_RECEIPT;
                $scope.student_prefix=response_data.data.data[0].STUDENT_PREFIX;
                $scope.employee_prefix=response_data.data.data[0].EMPLOYEE_PREFIX;
                $scope.material_prefix=response_data.data.data[0].MATERIAL_REQUEST_PREFIX;
                $scope.purchase_prefix=response_data.data.data[0].PURCHASE_ORDER_PREFIX;
                $scope.invoice_prefix=response_data.data.data[0].INVOICE_PREFIX;
                $scope.goods_prefix=response_data.data.data[0].GOODS_RECEIPT_PREFIX;
                $scope.student_admissionno=response_data.data.data[0].STU_ADM_NO;
                $scope.employee_admissionno=response_data.data.data[0].EMP_ADM_NO;
                $scope.m_request_no=response_data.data.data[0].MATERIAL_NO;
                $scope.order_no=response_data.data.data[0].ORDER_NO;
                $scope.invoice_no=response_data.data.data[0].INVOICE_NO;
                $scope.grn_no=response_data.data.data[0].GRN_NO;
            });


            $scope.saveData=function(){
                $http({
                    method:'POST',
                    url: $localStorage.service+'InstitutionAPI/institutionSettingData',
                    data:{
                        'setting_id':$scope.setting_id,
                        'student_status':$scope.student,
                        'employee_status':$scope.employee,
                        'material_status':$scope.material,
                        'purchase_status':$scope.purchase,
                        'invoice_status':$scope.invoice,
                        'goods_status':$scope.goodsreceipt,                        
                        'student_prefix':$scope.student_prefix,
                        'employee_prefix':$scope.employee_prefix,
                        'material_prefix':$scope.material_prefix,
                        'purchase_prefix':$scope.purchase_prefix,
                        'invoice_prefix':$scope.invoice_prefix,
                        'goods_prefix':$scope.goods_prefix,
                        'studentAdm_No':$scope.student_admissionno,
                        'employeeAdm_no':$scope.employee_admissionno,
                        'material_No':$scope.m_request_no,
                        'order_no':$scope.order_no,
                        'invoice_no':$scope.invoice_no,
                        'grn_no':$scope.grn_no
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(response_data){
                    console.log(response_data,'response_data');
                    if(response_data.data.data.status==true){
                         UIkit.notify({
                            message : 'Record updated successfully',
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $state.go('restricted.dashboard');
                    }
                });
            }
        }
    ]);