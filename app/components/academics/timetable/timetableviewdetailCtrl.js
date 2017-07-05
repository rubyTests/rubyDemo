angular
    .module('rubycampusApp')
    .controller('timetableviewdetailCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage) {
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
                    null
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

            $scope.viewData=[];
            
            $scope.getdata=function(){
                $http.get($localStorage.service+'TimetableAPI/fetchTimetableList',{headers:{'access_token':$localStorage.access_token}})
                .success(function(return_data){
                    $scope.viewData=return_data.result;
                });    
            }
            $scope.getdata();
            $scope.deleteTimetable=function(courseid,batchid,$index){
                if(courseid && batchid){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(courseid && batchid){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"TimetableAPI/timetableDetails",
                            params : {'course_id' : courseid,'batch_id':batchid},
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
            }
        }
    );