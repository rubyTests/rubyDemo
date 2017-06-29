angular
    .module('rubycampusApp')
    .controller('materialRequestAddCtrl', [
        '$scope',
        '$window',
        '$timeout',
        '$filter',
        '$http',
        '$state',
        '$rootScope',
        '$localStorage',
        function ($scope, $window, $timeout, $filter, $http, $state, $rootScope, $localStorage) {

            var $formValidate = $('#inputForm');
            $formValidate.parsley().on('form:validated',function() {
                    // $scope.$apply();
            }).on('field:validated',function(parsleyField) {
                if($(parsleyField.$element).hasClass('md-input')) {
                    // $scope.$apply();
                }
            });

            $scope.store_name = [];
            $http.get($localStorage.service+'inventoryApi/store',{headers:{'access_token':$localStorage.access_token}})
            .success(function(store_data){
                console.log(store_data,'store_data');
                $scope.store_name.push(store_data.data);
            });
            
            $scope.selectize_store_options = $scope.store_name;
            $scope.selectize_store_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Store',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $scope.storeItem_options = [];
                        $scope.getItems(value);
                    });
                }
            };
            $scope.reInitializeAutoComplete=function(){
                var tempdata=$scope.storeItem_options.length;
                console.log(tempdata,'tempdata');
                angular.forEach($scope.storeItem_options, function(values, keys){
                    values.value=values.ITEM_NAME;
                });
                for (var i = 0; i < tempdata; i++) {
                    console.log($scope.storeItem_options,"values");
                    UIkit.on('domready.uk.dom', function(){
                        UIkit.autocomplete($('#autocomplete_'+i), {
                          source: $scope.storeItem_options,
                          minLength:1,
                          flipDropdown:true
                        }).on('selectitem.uk.autocomplete', function (e, data, ac) {
                            var index = e.target.id.split("_")[1];
                            $scope.items[index]['item_id']=data.id;
                            var id = data.id;
                            $http({
                                method : 'GET',
                                url : $localStorage.service+'inventoryApi/getItemCode',
                                params : {'id' : id},
                                headers:{'access_token':$localStorage.access_token}
                            }).then(function(item_code){
                                $scope.items[index]['item_code'] = item_code.data.data[0]["CODE"];
                            });
                        });
                    });   
                }
                 
                
            }
            $scope.getItems = function(id){

                $http({
                    method : 'GET',
                    url : $localStorage.service+'inventoryApi/storeIdData',
                    params : {'id' : id},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    $scope.storeItem_options = return_data.data.data;
                    $scope.reInitializeAutoComplete();
                });               
            }

            
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth()+1;
            var day = d.getDate();
            if (month < 10){
                monthNew = "0" + month;
            }else{
                monthNew = month;
            };
            if (day<10){
                dayNew = "0" + day;
            }else{
                dayNew = day;
            };
            
            $scope.request_date=dayNew + "." + monthNew + "." + year;
            //$scope.forms_advanced.datepicker = $scope.date;
           

            var $maskedInput = $('.masked_input');
            if($maskedInput.length) {
                $maskedInput.inputmask();
            }

            $scope.newRowObj = {
                item_name : '',
                item_code : '',
                item_quantity : ''
            };
            $scope.items=[];
            $scope.items.push($scope.newRowObj);
            $scope.addRow = function(event,index,arrayVal){
                if(arrayVal.item_name != "" && arrayVal.item_quantity != ""){
                    $scope.items.push({ 'item_name': '', 'item_code' : '', 'item_quantity' : '' });
                    setTimeout(function(){
                        $scope.reInitializeAutoComplete();    
                    },500);
                }else{
                    fillForm();
                }
            }

            function fillForm(){
                UIkit.notify({
                    message : 'Please Fill current form',
                    status  : 'warning',
                    timeout : 1000,
                    pos     : 'top-center'
                });
            }

            $scope.removeRow = function(index){
                $scope.items.splice(index,1);
            }

            $scope.backBtn = function(){
                window.history.back();
            }

            $scope.saveMaterialRequest = function(){
                $http({
                    method : 'POST',
                    url : $localStorage.service+'inventoryApi/materialRequest',
                    data : {
                        'materialReq_id' : $scope.materialReq_id,
                        'request_no' : $scope.request_no,
                        'request_date' : $scope.request_date,
                        'store_id' : $scope.selectize_store,
                        'notesData' : $scope.notesData,
                        'itemData' : $scope.items
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_data');
                    if(return_data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $timeout(function(){
                            $state.go('restricted.inventory.materialRequestView');
                        },200);
                    }else {
                        UIkit.modal.alert('Already Exists');
                    }
                })
            }

            $scope.clearSelectData = function(value){
                // console.log(value,'valuevaluevaluevaluevalue');
                // var index = $scope.items.indexOf({item_name:value.item_name});
                // var index = $filter('filter')($scope.items, { item_name: value.item_name  }, true);
                setTimeout(function(){
                    console.log(value.item_name, "value.item_name");
                    var data = $scope.storeItem_options || []; 
                    // console.log(data, "data")
                    var index = data.findIndex(x => x.ITEM_NAME == value.item_name);
                    if (index==-1) {
                        console.log(index, "index");    
                        value.item_name="";
                        value.item_code="";
                    }
                },100);
            }

        }
    ]);