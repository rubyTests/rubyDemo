angular
    .module('rubycampusApp')
    .controller('LeaveCategoryCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter,$http) {
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
                .withButtons([
                    {
                        extend:    'print',
                        text:      '<i class="uk-icon-print"></i> Print',
                        titleAttr: 'Print'
                    },
                    {
                        extend:    'excelHtml5',
                        text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
                        titleAttr: ''
                    },
                    {
                        extend:    'pdfHtml5',
                        text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
                        titleAttr: 'PDF'
                    }
                ])
                 .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });

                var modal = UIkit.modal("#open_leavecategory",{bgclose: false, keyboard:false});
                
                $scope.addleavecategory=function(){
                    $scope.clearValidation();
                    $scope.tit_caption="Add";
                    $scope.status="Save";
                    $scope.leave_category='';
                    $scope.leave_code='';
                    $scope.leavecat_id='';
                    $('.uk-modal').find('input').trigger('blur');
                }
                $scope.editLeaveCategory=function(data){
                    $scope.clearValidation();
                    $scope.tit_caption="Edit";
                    $scope.status="update";
                    if(data) {
                        $scope.leavecat_id=data.ID;
                        $scope.leave_category=data.NAME;
                        $scope.leave_code=data.CODE;
                    }
                }

                $scope.viewData=[];
                $scope.refreshTable=function(){
                    $http.get('http://localhost/smartedu/test/LeavemgmntAPI/leaveCategory')
                    .success(function(return_data){
                        $scope.viewData=return_data.data;
                    });
                }
                $scope.refreshTable();
                $scope.saveLeaveCategory=function(){
                    $http({
                        method:'POST',
                        url: 'http://localhost/smartedu/test/LeavemgmntAPI/leaveCategory',
                        data: {
                            'id' : $scope.leavecat_id,
                            'cat_name' : $scope.leave_category,
                            'cat_code' : $scope.leave_code
                        },
                        // headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data.data.data.message);
                        if(return_data.data.data.status==true){
                            UIkit.notify({
                                message : return_data.data.data.message,
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });

                            UIkit.modal("#open_leavecategory").hide();
                            $scope.refreshTable();
                        }else {
                            UIkit.modal.alert('Category Name Already Exists');
                        }
                    });
                }

                $scope.deleteLeavecategory=function(id){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : "http://localhost/smartedu/test/LeavemgmntAPI/leaveCategory",
                            params : {id : id},
                            // headers:{'access_token':$localStorage.access_token}
                            }).then(function mySucces(response) {
                                console.log(response.data.message,'response');
                                if(response.data.status==true){
                                    UIkit.notify({
                                        message : response.data.message,
                                        status  : 'success',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                }
                                $scope.refreshTable();
                            },function myError(response) {
                                UIkit.notify({
                                    message : 'Failed',
                                    status  : 'danger',
                                    timeout : 2000,
                                    pos     : 'top-center'
                                });
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