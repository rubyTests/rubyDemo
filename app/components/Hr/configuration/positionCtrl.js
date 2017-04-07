angular
    .module('rubycampusApp')
    .controller('positionCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage) {
            var vm = this;
            vm.dt_data = [];
            $scope.category_data=[];
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
        
                var modal = UIkit.modal("#open_category",{bgclose: false, keyboard:false});
                
                $scope.addPosition=function(){
                    $scope.tit_caption="Add";
                    $scope.status="Save";
                    $scope.position_id='';
                    $scope.position_name='';
                    $scope.category_id='';
                    $('.uk-modal').find('input').trigger('blur');
                }
                $scope.editPosition=function(data){
                    $scope.tit_caption="Edit";
                    $scope.status="update";
                    if (data) {
                        $scope.position_id=data.ID;
                        $scope.position_name=data.NAME;
                        $scope.category_id=data.CATEGORY_ID;
                    }
                }
                $scope.viewData=[];
                $scope.CategoryList=[];
                $http.get('http://localhost/smartedu/test/EmployeemgmntAPI/positionViewDetail')
                .success(function(position_data){
                    $scope.viewData=position_data.data;
                });
                $http.get('http://localhost/smartedu/test/EmployeemgmntAPI/categoryDetail')
                .success(function(category_data){
                    $scope.CategoryDataList=category_data.data;
                    $scope.CategoryList.push(category_data.data);
                });

                $scope.selectize_category_options =$scope.CategoryList;
                $scope.selectize_category_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Category...',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(selectize){
                        
                    }
                };

                $scope.savePosition=function(){
                    $http({
                        method:'POST',
                        url: 'http://localhost/smartedu/test/EmployeemgmntAPI/positionDetail',
                        data: {
                            'id' : $scope.position_id,
                            'name' : $scope.position_name,
                            'category_id' : $scope.category_id
                        },
                        // headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data.data.data.message);
                        var categoryData=$filter('filter')($scope.CategoryDataList,{ID:$scope.category_id},true);
                        if($scope.position_id){
                            var data1=$filter('filter')($scope.viewData,{ID:$scope.position_id},true);
                            data1[0].NAME=$scope.position_name;
                            data1[0].CATEGORY_ID=$scope.category_id;
                            data1[0].CATEGORY_NAME=categoryData[0].NAME;
                        }else{
                            $scope.viewData.push({ID:return_data.data.data.POSITION_ID,NAME:$scope.position_name,CATEGORY_ID:$scope.category_id,CATEGORY_NAME:categoryData[0].NAME});
                        }
                    });
                }

                $scope.deletePosition=function(id,$index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : "http://localhost/smartedu/test/EmployeemgmntAPI/positionDetail",
                            params : {id : id},
                            // headers:{'access_token':$localStorage.access_token}
                            }).then(function mySucces(response) {
                                var data=response.data.message.message;
                                $scope.viewData.splice($index, 1);
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