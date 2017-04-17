angular
    .module('rubycampusApp')
    .controller('employeecategoryCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage) {
            
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

            $scope.addCategory=function(){
                $scope.clearValidation();
                $scope.tit_caption="Add";
                $scope.status="Save";
                $scope.category_name='';
                $scope.category_desc='';
                $('.uk-modal').find('input').trigger('blur');
            }
            $scope.editcategory=function(data){
                $scope.clearValidation();
                $scope.tit_caption="Edit";
                $scope.status="update";
                if (data) {
                    $scope.category_id=data.ID;
                    $scope.category_name=data.NAME;
                    $scope.category_desc=data.DESCRIPTION;
                }
            }
            $scope.viewData=[];
            
            $scope.refreshTable=function(){
                $http.get($localStorage.service+'EmployeemgmntAPI/categoryDetail',{headers:{'access_token':$localStorage.access_token}})
                .success(function(category_data){
                    $scope.viewData=category_data.data;
                });
            }
            $scope.refreshTable();
            $scope.saveCategory=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'EmployeemgmntAPI/categoryDetail',
                data: {
                    'id' : $scope.category_id,
                    'name' : $scope.category_name,
                    'description' : $scope.category_desc
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.data.message);
                    if(return_data.data.data.status==true){
                        UIkit.modal("#open_category").hide();
                        UIkit.notify({
                            message : return_data.data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $scope.refreshTable();
                    }
                    // if($scope.category_id){
                    //     var data1=$filter('filter')($scope.viewData,{ID:$scope.category_id},true);
                    //     data1[0].NAME=$scope.category_name;
                    //     data1[0].DESCRIPTION=$scope.category_desc;
                    // }else{
                    //     $scope.viewData.push({ID:return_data.data.data.CAT_ID,NAME:$scope.category_name,DESCRIPTION:$scope.category_desc});
                    // }
                });
            }

            $scope.deleteCategory=function(id,$index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"EmployeemgmntAPI/categoryDetail",
                            params : {id : id},
                            headers:{'access_token':$localStorage.access_token}
                            }).then(function mySucces(response) {
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