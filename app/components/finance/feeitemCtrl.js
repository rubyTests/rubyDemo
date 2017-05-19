angular
    .module('rubycampusApp')
    .controller('feeitemCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$localStorage,$http) {
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

           
            var modal = UIkit.modal("#modal_header_footer",{bgclose: false, keyboard:false});
            
           
            $scope.openModal = function(){
                $scope.BtnStatus='Save';
                $scope.itemID=null;
                $scope.itemname = null;
                $scope.description = null;
                $('.uk-modal').find('input').trigger('blur');
            }
            $scope.editItem = function(data){
                $scope.BtnStatus='Update';
                if(data){
                    $scope.itemID=data.ID;
                    $scope.itemname = data.NAME;
                    $scope.description = data.DESCRIPTION;
                    $('.uk-modal').find('input').trigger('blur');
                }
            }
            $scope.viewData=[];
            $scope.refreshTable=function(){
                $http({
                    url: $localStorage.service+'FinanceAPI/feeItem',
                    method : 'GET',
                    headers: { 'access_token':$localStorage.access_token},
                }).success(function(response) {
                    console.log(response,'success');
                    $scope.viewData=response.message;
                }).error(function(data){
                    console.log('error');
                });
            }
            $scope.refreshTable();
            $scope.addFeeItems=function(){
                $http({
                    url: $localStorage.service+'FinanceAPI/feeItem',
                    method : 'POST',
                    data:{
                        'itemid':$scope.itemID,
                        'itemname':$scope.itemname,
                        'description':$scope.description
                    },
                    headers: { 'access_token':$localStorage.access_token},
                }).success(function(response) {
                    console.log(response,'response');
                    if(response.message.status==true){
                        UIkit.notify({
                            message : response.message.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        UIkit.modal("#modal_header_footer").hide();
                        $scope.refreshTable();
                    }else {
                        UIkit.modal.alert('FeeItem Already Exists');
                    }
                }).error(function(response){
                    console.log('error');
                });
            }

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

            $scope.remove_item = function(id,$index) {
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"FinanceAPI/feeItem",
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
                }
            }
        }
    );