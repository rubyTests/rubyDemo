angular
.module('rubycampusApp')
.controller('fineEditCtrl', [
    '$scope',
    '$rootScope',
    '$window',
    '$timeout',
    '$stateParams',
    '$resource',
    '$filter','$localStorage','$http','$state',
    function ($scope,$rootScope,$window,$timeout,$stateParams,$resource,$filter,$localStorage,$http,$state) {
        $scope.defaultDueDays = 30;
        $scope.backBtn = function(){
            window.history.back();
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

        $http({
            url: $localStorage.service+'FinanceAPI/feeFine',
            method : 'GET',
            params:{
                'id':$stateParams.Row_Id
            },
            headers: { 'access_token':$localStorage.access_token},
        }).success(function(response) {
            console.log(response.message[0].fine_slobs,'success');
            $scope.fine_name=response.message[0].NAME;
            $scope.fineID=response.message[0].ID;
            $scope.form_dynamic=response.message[0].fine_slobs;
        }).error(function(data){
            console.log('error');
        });

        // $scope.getFineDetails=function(fineId){
        //     $http({
        //         url: $localStorage.service+'FinanceAPI/feeFineItems',
        //         method : 'GET',
        //         params:{
        //             'id':fineId
        //         },
        //         headers: { 'access_token':$localStorage.access_token},
        //     }).success(function(response) {
        //         console.log(response.message,'success');
        //         $scope.tableData=response.message[0];
        //     }).error(function(data){
        //         console.log('error');
        //     });
        // }
        $scope.form_dynamic = [];
            $scope.form_dynamic.push({'Days_After':'','Fine_Value':''});
            $scope.form_dynamic_model = [];

            // clone section
            $scope.cloneSection = function($event,$index,CurrRow) {
                console.log(CurrRow,'CurrRow');
                if(CurrRow.DUE_DATE=='' || CurrRow.VALUE==''){
                    UIkit.notify({
                        message : 'Please Fill current form',
                        status  : 'warning',
                        timeout : 1000,
                        pos     : 'top-center'
                    });
                }else {
                    $event.preventDefault();
                    $scope.form_dynamic.push({'DUE_DATE':'','VALUE':''});
                }
            };

            // delete section
            $scope.deleteSection = function($event,$index,currID) {
                if(currID){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(currID){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"FinanceAPI/feeFineItem",
                            params : {id : currID},
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
                    $event.preventDefault();
                    $scope.form_dynamic_model.splice($index,1);
                    $scope.form_dynamic.splice($index,1);
                }
                // $event.preventDefault();
                // $scope.form_dynamic_model.splice($index,1);
                // $scope.form_dynamic.splice($index,1);
            };

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                altair_uikit.reinitialize_grid_margin();
            });

            $scope.updateFineDetails=function(){
                console.log($scope.form_dynamic);
                $http({
                    method:'POST',
                    url: $localStorage.service+'FinanceAPI/feeFine',
                    data: {
                        'id':$scope.fineID,
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
            $scope.addNewRow=function(){
                $scope.form_dynamic.push({'DUE_DATE':'','VALUE':'','MODE':''});
                $scope.checkBTN=false;
            }
    }
]);