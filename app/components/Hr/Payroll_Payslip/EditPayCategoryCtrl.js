angular
    .module('rubycampusApp')
    .controller('EditPayCategoryCtrl',
        function($scope,$http,$localStorage,$timeout,$stateParams,$state,$filter) {
            $scope.itemType_array=[];
            $scope.checkValid=function(value){
                if(typeof value.PAYITEM_ID!="undefined"){
                    value.errorMessage=false;
                    var data=$filter('filter')($scope.itemType_array,{PAYITEM_ID:value.PAYITEM_ID},true);
                    if (data.length != 1) {
                        value.PAYITEM_ID="";
                        value.errorMessage=true;
                    }
                    // console.log(value,"defined")
                }else{
                    // console.log(value,"undefined")
                    value.PAYITEM_ID={};
                    value.errorMessage=true;
                }
            }

            $scope.stru_id=$stateParams.id;
            $scope.itemLIST=[];
            var $formValidate = $('#inputForm');
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
            $scope.PayFrequency_options = ["Monthly", "Weekly", "Daily"];
            $scope.PayFrequency_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Frequency'
            };
            
            $http({
                method:'GET',
                url: $localStorage.service+'PayrollPayslipAPI/PayItem',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.itemLIST.push(return_data.data.message);
            });

            $scope.itemType_options = $scope.itemLIST;
            $scope.itemType_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Item Type',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                render: {
                    option: function(planets_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(planets_data.NAME) + '</span><br>' +
                            '<span class="title Addition uk-text-muted uk-text-small">' + escape(planets_data.TYPE) + '</span>' +
                            '</div>';
                    }
                },
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                        $timeout(function(){
                            $('#inputForm').parsley().validate();
                        },200);
                    });
                }
            };

            $scope.form_dynamic = [];
            $scope.form_dynamic.push({'PAYITEM_ID':'','AMOUNT':''});

            $scope.form_dynamic_model = [];

            // clone section
            $scope.cloneSection = function($event,$index,currentE,ITemArray) {
                var ArrayD=$scope.itemType_array[$index];
                console.log(ArrayD,'ArrayD');
                if (typeof ArrayD!="undefined") {
                    ArrayD.PAYITEM_ID=ArrayD.PAYITEM_ID || {};
                    if (ArrayD.PAYITEM_ID!="" && Object.keys(ArrayD.PAYITEM_ID).length!=0 && typeof ArrayD.AMOUNT!="undefined" && ArrayD.AMOUNT!="") {
                        $event.preventDefault();
                        $scope.form_dynamic.push({'PAYITEM_ID':'','AMOUNT':''});
                    }else{
                        fillform();
                    }
                }else {
                    fillform();      
                }
            };
            function fillform(){
                UIkit.notify({
                    message : 'Please Fill current form',
                    status  : 'warning',
                    timeout : 1000,
                    pos     : 'top-center'
                });
            }
            // $scope.cloneSection = function($event,$index,currRow) {
            //     console.log('currRow',currRow);
            //     if(currRow){
            //         if(currRow.PAYITEM_ID =='' || currRow.AMOUNT==''){
            //             UIkit.notify({
            //                 message : 'Please Fill current form',
            //                 status  : 'warning',
            //                 timeout : 700,
            //                 pos     : 'top-center'
            //             });
            //         }else {
            //             $event.preventDefault();
            //             $scope.form_dynamic.push({'PAYITEM_ID':'','AMOUNT':''});
            //         }
            //     }else {
            //         $event.preventDefault();
            //         $scope.form_dynamic.push({'PAYITEM_ID':'','AMOUNT':''});
            //     }
            // };

            // delete section
            $scope.deleteSection = function($event,$index,CurrId,paystruc_id) {
                var id=CurrId.ID;
                var itemId=CurrId.PAYITEM_ID;
                if(id){
                    $http({
                        method : "GET",
                        url : $localStorage.service+"PayrollPayslipAPI/checkPayItemId",
                        params : {
                            'id' : itemId,
                            'payStrID':paystruc_id
                        },
                        headers:{'access_token':$localStorage.access_token}
                    }).then(function mySucces(response) {
                        var payStructure=response.data.message[0].STRUCTURE_ID;
                        if(payStructure){
                            console.log('yes');
                            UIkit.modal.confirm('This payitem is already added to employees, deleting it will effect in employees, are you sure you to delete?', function(e) {
                                if(id){
                                    $http({
                                    method : "DELETE",
                                    url : $localStorage.service+"PayrollPayslipAPI/payStructureDetail",
                                    params : {id : id},
                                    headers:{'access_token':$localStorage.access_token}
                                    }).then(function mySucces(response) {
                                        console.log(response,'response');
                                        if(response.data.status==true){
                                            UIkit.notify({
                                                message : response.data.message,
                                                status  : 'success',
                                                timeout : 2000,
                                                pos     : 'top-center'
                                            });
                                            $event.preventDefault();
                                            $scope.form_dynamic_model.splice($index,1);
                                            $scope.form_dynamic.splice($index,1);
                                        }
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
                        }else {
                            UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                                if(id){
                                    $http({
                                    method : "DELETE",
                                    url : $localStorage.service+"PayrollPayslipAPI/payStructureDetail",
                                    params : {id : id},
                                    headers:{'access_token':$localStorage.access_token}
                                    }).then(function mySucces(response) {
                                        console.log(response,'response');
                                        if(response.data.status==true){
                                            UIkit.notify({
                                                message : response.data.message,
                                                status  : 'success',
                                                timeout : 2000,
                                                pos     : 'top-center'
                                            });
                                            $event.preventDefault();
                                            $scope.form_dynamic_model.splice($index,1);
                                            $scope.form_dynamic.splice($index,1);
                                        }
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
                    },function myError(response) {
                        console.log(response,'error');
                    })
                }else {
                    $event.preventDefault();
                    $scope.form_dynamic_model.splice($index,1);
                    $scope.form_dynamic.splice($index,1);
                }
            };

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                altair_uikit.reinitialize_grid_margin();
            })

            $http({
                method:'GET',
                url: $localStorage.service+'PayrollPayslipAPI/payStructureDetail',
                params:{
                    id:$stateParams.id
                },
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.paystru_id=return_data.data.message.ID;
                $scope.paystruc_name=return_data.data.message.NAME;
                $scope.PayFrequency=return_data.data.message.FREQUENCY;
                $timeout(function() {
                    $scope.form_dynamic=return_data.data.message.item;
                    angular.forEach($scope.form_dynamic, function(value, keys){
                        $scope.itemType_array.push(value);
                    });
                }, 200);
            });

            $scope.updatePayStructure=function(){
                $http({
                    method:'POST',
                    url: $localStorage.service+'PayrollPayslipAPI/payStructureDetail',
                    data: {
                        'id':$scope.paystru_id,
                        'structure_name' : $scope.paystruc_name,
                        'frequency' : $scope.PayFrequency,
                        'paydata' : $scope.form_dynamic
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'ss');
                    if(return_data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 1000,
                            pos     : 'top-center'
                        });
                        $timeout(function(){
                            $state.go('restricted.hr.StructureGroup');
                        },200);
                    }else {
                        UIkit.modal.alert('Paystructure Name Already Exists');
                    }
                    
                });
            };
            
            $scope.deletePayStructureDetails=function(id){
                console.log(id,'test');
                UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                    if(id){
                        $http({
                        method : "DELETE",
                        url : $localStorage.service+"PayrollPayslipAPI/paystructureDelete",
                        params : {id : id},
                        headers:{'access_token':$localStorage.access_token}
                        }).then(function mySucces(response) {
                            console.log('delete',response);
                            UIkit.notify({
                                message : response.data.message,
                                status  : 'success',
                                timeout : 1000,
                                pos     : 'top-center'
                            });
                            $state.go('restricted.hr.StructureGroup');
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
    );
