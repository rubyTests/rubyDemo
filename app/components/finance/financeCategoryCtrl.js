angular
    .module('rubycampusApp')
    .controller('financeCategoryCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage) {
            $timeout(function(){
                var $formValidate = $('#form_validation');
                // console.log($formValidate);
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


                var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
                $scope.titCaption="Add";
                $scope.btnStatus="Save";
                $scope.addCategory = function() {
                    $scope.clearValidation();
                    $scope.titCaption="Add";
                    $scope.btnStatus="Save";
                    $scope.category_id="";
                    $scope.category_name="";
                    $scope.description="";
                    $('.uk-modal').find('input').trigger('blur');
                    console.log($scope,"scope");
                };
                $scope.formdata={};
                $scope.editCategory= function(res){
                    $scope.clearValidation();
                    $scope.titCaption="Edit";
                    $scope.btnStatus="Update";
                    if(res){
                        $scope.category_id=res.ID;
                        $scope.category_name=res.NAME;
                        $scope.description=res.DESCRIPTION;
                    }
                }

                $scope.viewData=[];
                $scope.empList=[];
                $scope.roomList=[];
                $scope.getdata=function(){
                    $http.get($localStorage.service+'FinanceAPI/categoryDetail',{headers:{'access_token':$localStorage.access_token}})
                    .success(function(return_data){
                        console.log(return_data,'return_data');
                        $scope.viewData=[].concat(return_data.message);
                    });    
                }
                $scope.getdata();
                $scope.formdata={};
                $scope.saveCategory=function(){
                    if($scope.inputform.$valid==true){
                        $http({
                        method:'POST',
                        url: $localStorage.service+'FinanceAPI/categoryDetail',
                        data: {
                            'CATEGORY_ID' : $scope.category_id,
                            'CATEGORY_NAME' : $scope.category_name,
                            'DESCRIPTION' : $scope.description
                        },
                        headers:{'access_token':$localStorage.access_token}
                        }).then(function(return_data){
                            console.log(return_data,'sdddd');
                            if(return_data.data.message.status==true){
                                UIkit.modal("#modal_overflow").hide();
                                UIkit.notify({
                                    message : return_data.data.message.message,
                                    status  : 'success',
                                    timeout : 2000,
                                    pos     : 'top-center'
                                });
                                $scope.getdata();
                            }else {
                                UIkit.modal.alert('Category Name Already Exists');
                            }
                        });
                    }
                }

                $scope.deleteCategory=function(id,$index){
                    // $http({
                    //     method : "GET",
                    //     url : $localStorage.service+"FinanceAPI/categoryDetailCheck",
                    //     params : {id : id},
                    //     headers:{'access_token':$localStorage.access_token}
                    //     }).then(function mySucces(response) {
                    //         console.log(response,'response');
                    //         if(response.data.status==true){
                                if(id){
                                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                                        if(id){
                                            $http({
                                            method : "DELETE",
                                            url : $localStorage.service+"FinanceAPI/categoryDetail",
                                            params : {id : id},
                                            headers:{'access_token':$localStorage.access_token}
                                            }).then(function mySucces(response) {
                                                
                                                if(response.data.status==true){
                                                    UIkit.notify({
                                                        message : response.data.message,
                                                        status  : 'success',
                                                        timeout : 2000,
                                                        pos     : 'top-center'
                                                    });
                                                    $scope.viewData.splice($index, 1);
                                                    $scope.getdata();
                                                }
                                                
                                            },function myError(response) {
                                            })
                                        }
                                    },function(){
                                         console.log("false");
                                    }, {
                                        labels: {
                                            'Ok': 'Ok'
                                        }
                                    });
                                }

                        //     }
                        // },function myError(response) {
                        //     //console.log(response,'errr');
                        //     UIkit.modal.alert(response.data.message);
                        // })
                   
                }
            }
    );