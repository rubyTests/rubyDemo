angular
    .module('rubycampusApp')
    .controller('payItemCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$localStorage) {
            var vm = this;
            vm.dt_data = [];
            vm.dtOptions = DTOptionsBuilder
                .newOptions()
                .withDOM("<'dt-uikit-header'<'uk-grid'<'uk-width-medium-2-3'l><'uk-width-medium-1-3'f>>>" +
                    "<'uk-overflow-container'tr>" +
                    "<'dt-uikit-footer'<'uk-grid'<'uk-width-medium-3-10'i><'uk-width-medium-7-10'p>>>")
                .withOption('createdRow', function(row, data, dataIndex) {
                    // Recompiling so we can bind Angular directive to the DT
                    $compile(angular.element(row).contents())($scope);
                })
                .withOption('headerCallback', function(header) {
                    if (!vm.headerCompiled) {
                        // Use this headerCompiled field to only compile header once
                        vm.headerCompiled = true;
                        $compile(angular.element(header).contents())($scope);
                    }
                })
                .withPaginationType('full_numbers')
                // Active Buttons extension
                .withColumnFilter({
                    aoColumns: [
                        null,
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        }
                    ]
                })
                 .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });

                var modal = UIkit.modal("#open_payitem",{bgclose: false, keyboard:false});

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

                $scope.addItem=function(){
                    $scope.clearValidation();
                    $scope.tit_caption="Add";
                    $scope.status="Save";
                    $scope.item_id='';
                    $scope.item_name='';
                    $scope.item_type='';
                    $('.uk-modal').find('input').trigger('blur');
                }
                $scope.editPayItem=function(data){
                    $scope.clearValidation();
                    $scope.tit_caption="Edit";
                    $scope.status="update";
                    if (data) {
                        $scope.item_id=data.ID;
                        $scope.item_name=data.NAME;
                        $scope.item_type=data.TYPE;
                    }
                }

                $scope.viewData=[];
                $scope.refreshTable=function(){
                    $http({
                        method:'GET',
                        url: $localStorage.service+'PayrollPayslipAPI/PayItem',
                        headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        $scope.viewData=return_data.data.message;
                    });
                }

                $scope.refreshTable();

                $scope.selectize_item_options = ['Earnings','Deductions'];
                $scope.selectize_item_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Type *',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            console.log(value);
                            if(value){
                                $timeout(function(){
                                    $('#form_validation').parsley().validate();
                                },200);
                            }
                        });
                    }
                };

                $scope.savePayItem=function(){
                    $http({
                        method:'POST',
                        url: $localStorage.service+'PayrollPayslipAPI/PayItem',
                        data: {
                            'id' : $scope.item_id,
                            'name' : $scope.item_name,
                            'type' : $scope.item_type
                        },
                        headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data,'rrrrrr');
                        if(return_data.data.status==true){
                            UIkit.modal("#open_payitem").hide();
                            UIkit.notify({
                                message : return_data.data.message.message,
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });
                            $scope.refreshTable();
                        }else {
                            UIkit.modal.alert('PayItem Already Exists');
                        }
                    });
                }

                $scope.deletePayItem=function(id,$index){
                    if(id){
                        $http({
                        method : "GET",
                        url: $localStorage.service+'PayrollPayslipAPI/checkPayItem',
                        params : {id : id},
                        headers:{'access_token':$localStorage.access_token}
                        }).then(function mySucces(response) {
                            console.log('delete',response);
                            UIkit.modal.alert('This pay item assigned to a pay structure, remove the paystructure to continue removing this pay item');
                        },function myError(response) {
                            console.log(response,'error');
                            UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                                if(id){
                                    $http({
                                    method : "DELETE",
                                    url : $localStorage.service+"PayrollPayslipAPI/PayItem",
                                    params : {id : id},
                                    headers:{'access_token':$localStorage.access_token}
                                    }).then(function mySucces(response) {
                                        console.log('delete',response);
                                        $scope.viewData.splice($index, 1);
                                        UIkit.notify({
                                            message : response.data.message,
                                            status  : 'success',
                                            timeout : 2000,
                                            pos     : 'top-center'
                                        });
                                        $scope.refreshTable();
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
                }
        }
    );