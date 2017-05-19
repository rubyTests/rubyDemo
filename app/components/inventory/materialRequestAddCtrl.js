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

            $scope.store_name = [];
            $http.get($localStorage.service+'inventoryApi/store',{headers:{'access_token':$localStorage.access_token}})
            .success(function(store_data){
                console.log(store_data,'store_data');
                $scope.store_name.push(store_data.data);
            });
            
            // $scope.selectize_store_options = $scope.store_name;
            // $scope.selectize_store_config = {
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Store',
            //     valueField: 'ID',
            //     labelField: 'NAME',
            //     onInitialize: function(val){
            //         console.log(val);
            //     }
            // };

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

            $scope.getItems = function(id){

                $http({
                    method : 'GET',
                    url : $localStorage.service+'inventoryApi/storeIdData',
                    params : {'id' : id},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    $scope.storeItem_options = return_data.data.data;
                    angular.forEach($scope.storeItem_options, function(values, keys){
                        values.value=values.ITEM_NAME;
                        console.log(values,"values");
                    });
                    UIkit.on('domready.uk.dom', function(){
                        UIkit.autocomplete($('#autocomplete'), {
                          source: $scope.storeItem_options,
                          minLength:0,
                          flipDropdown:true
                        }).on('selectitem.uk.autocomplete', function (e, data, ac) {
                            var id = data.value;
                            $http({
                                method : 'GET',
                                url : $localStorage.service+'inventoryApi/getItemCode',
                                params : {'id' : id},
                                headers:{'access_token':$localStorage.access_token}
                            }).then(function(item_code){
                                $scope.items[0]['item_code'] = item_code.data.data[0]["CODE"];
                            });
                        });
                    });
                });               
            }


            // $scope.storeItem_options = [];
            // function getAutocompleteData (release){
            //     $resource('data/search_data.json')
            //     .query()
            //     .$promise
            //     .then(function(dt_data) {
            //         var data = filterFilter($scope.search_data, $scope.test);
            //         release(data);
            //         $("#message").html(data);
            //     });
            // }
            // UIkit.on('domready.uk.dom', function(){
            //     UIkit.autocomplete($('#autocomplete'), {
            //       source: $scope.storeItem_options,
            //       minLength:0,
            //       flipDropdown:true
            //     });
            // });
            // $scope.filterName=function(){
            //     // var data = filterFilter($scope.countryNames, $scope.country);
            //     // console.log("data");
            //     return $scope.search_data;
            // }

            // $scope.selectize_storeItem_config = {
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Select Item',
            //     valueField: 'ID',
            //     labelField: 'ITEM_NAME',
            //     onInitialize: function(selectize){
            //         selectize.on('change', function(val){

            //         })
            //     }
            // };
            
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
            $scope.addRow = function(){
                $scope.items.push({ 'item_name': '', 'item_code' : '', 'item_quantity' : '' });
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
                            message : return_data.data.message.message,
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

        }
    ]);