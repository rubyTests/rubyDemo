angular
    .module('rubycampusApp')
    .controller('fineAddCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$localStorage,$http,$state) {
            $scope.defaultDueDays = 30;
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
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'number',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'number',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'number',
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

                // Clone functionality

            $scope.form_dynamic = [];
            $scope.form_dynamic.push({'Days_After':'','Fine_Value':''});
            $scope.form_dynamic_model = [];

            // clone section

            $scope.cloneSection1=function(){
                $scope.form_dynamic.push({'Days_After':'','Fine_Value':''});
            }

            $scope.cloneSection = function($event,$index,CurrRow) {
                console.log(CurrRow,'CurrRow');
                if(CurrRow.Days_After=='' || CurrRow.Fine_Value==''){
                    UIkit.notify({
                        message : 'Please Fill current form',
                        status  : 'warning',
                        timeout : 1000,
                        pos     : 'top-center'
                    });
                }else {
                    $event.preventDefault();
                    $scope.form_dynamic.push({'Days_After':'','Fine_Value':''});
                }
            };

            // delete section
            $scope.deleteSection = function($event,$index) {
                UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        $event.preventDefault();
                        $scope.form_dynamic_model.splice($index,1);
                        $scope.form_dynamic.splice($index,1);
                },function(){
                    // console.log("false");
                }, {
                    labels: {
                        'Ok': 'Ok'
                    }
                });
            };

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                altair_uikit.reinitialize_grid_margin();
            });

            $scope.backBtn = function(){
                window.history.back();
            }
            $scope.saveFineDetails=function(){
                console.log($scope.form_dynamic);
                $http({
                    method:'POST',
                    url: $localStorage.service+'FinanceAPI/feeFine',
                    data: {
                        'id':$scope.fine_id,
                        'name':$scope.fine_name,
                        'fineItem' : $scope.form_dynamic
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){  
                    console.log(return_data,'success');
                    if(return_data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 1000,
                            pos     : 'top-center'
                        });
                        $timeout(function(){
                            $state.go('restricted.finance.fee.fineDetails');
                        },100);
                    }else {
                        UIkit.notify({
                            message : 'Failed',
                            status  : 'danger',
                            timeout : 1000,
                            pos     : 'top-center'
                        });
                        // UIkit.modal.alert('Paystructure Name Already Exists');
                    }
                });
            }
        }
    );