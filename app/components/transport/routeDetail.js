angular
    .module('rubycampusApp')
    .controller('routeDetailCtrl',
        function($compile, $scope, $rootScope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, $filter, $localStorage, $http) {
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

                $scope.viewData=[];
                $scope.refreshTable=function(){
                    $http({
                        method:'GET',
                        url: $localStorage.service+'TransportAPI/route',
                        headers:{'access_token':$localStorage.access_token}
                    }).then(function(view_data){
                        $scope.viewData=view_data.data.message;
                    });
                }
                $scope.refreshTable();
                $scope.vehicleName=[];
                $http.get($localStorage.service+'TransportAPI/vehicle',{headers:{'access_token':$localStorage.access_token}})
                .success(function(return_data){
                    $scope.vehicleName.push(return_data.message);
                });
                $scope.selectize_vehicleName_options = $scope.vehicleName;
                $scope.selectize_vehicleName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Vehicle Name',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(val){
                        //console.log(val);
                    }
                };
                
                $scope.openModel = function() {
                    $scope.clearValidation();
                    $scope.buttonStatus='Save';
                    $scope.routedata={
                        route_name:"",
                        destination:"",
                        via:"",
                        selectize_vehicleName:""
                    };
                    $('.uk-modal').find('input').trigger('blur');
                };
                $scope.edit_data= function(res){
                    if (typeof res=="undefined") return false;
                    //console.log(res,"messsssssssssss");
                    $scope.buttonStatus='Update';
                    $scope.routedata={
                        id:res.ID,
                        route_name:res.NAME,
                        destination:res.DESTINATION,
                        via:res.VIA,
                        selectize_vehicleName:res.VEHICLE_NAME
                    };
                       
                }

                $scope.routedata={}
                $scope.saveRoute=function(){
                    $http({
                    method:'POST',
                    url: $localStorage.service+'TransportAPI/route',
                    data: {
                        'id' : $scope.routedata.id,
                        'name' : $scope.routedata.route_name,
                        'destination' : $scope.routedata.destination,
                        'routeVia' : $scope.routedata.via,
                        'vehicleName' : $scope.routedata.selectize_vehicleName
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data,'return_datareturn_data');
                        if(return_data.data.status==true){
                            UIkit.modal("#modal_overflow").hide();
                            UIkit.notify({
                                message : return_data.data.message,
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });
                            $scope.refreshTable();
                        }else {
                            // // UIkit.notify('Course Name Already Exists','danger');
                            // UIkit.modal.alert('Course Name Already Exists');
                        }
                    });
                }
                 $scope.deleteRoute=function(id,$index){
                    $http({
                        method : "get",
                        url : $localStorage.service+"TransportAPI/checkRoutedetails",
                        params : {id : id},
                        headers:{'access_token':$localStorage.access_token}
                        }).then(function mySucces(response) {
                            console.log(response,'responseresponse');
                            if(response.data.status==true){
                                if(id){
                                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                                        if(id){
                                            $http({
                                            method : "DELETE",
                                            url : $localStorage.service+"TransportAPI/route",
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
                        },function myError(response) {
                            //console.log(response,'errr');
                            UIkit.modal.alert(response.data.message);
                        })
                }

                // $scope.deleteRoute=function(id,$index){
                //     if(id){
                //         UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                //             if(id){
                //                 $http({
                //                 method : "DELETE",
                //                 url : $localStorage.service+"TransportAPI/route",
                //                 params : {id : id},
                //                 headers:{'access_token':$localStorage.access_token}
                //                 }).then(function mySucces(response) {
                //                     //console.log(response.data.message.message,'delete');
                //                     UIkit.notify({
                //                         message : response.data.message,
                //                         status  : 'success',
                //                         timeout : 2000,
                //                         pos     : 'top-center'
                //                     });
                //                     $scope.viewData.splice($index, 1);
                //                     $scope.refreshTable();
                //                 },function myError(response) {
                //                 })
                //             }
                //         },function(){
                //         }, {
                //             labels: {
                //                 'Ok': 'Ok'
                //             }
                //         });
                //     }
                // }
               
        }
    );