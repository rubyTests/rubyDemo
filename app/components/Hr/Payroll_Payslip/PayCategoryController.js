angular
    .module('rubycampusApp')
    .controller('paycategoryCtrl',
        function($scope,$http,$localStorage,$timeout,$state,$filter) {
            
            $scope.itemLIST=[];
            $scope.PayFrequency_options = ["Monthly", "Weekly", "Daily"];
            $scope.PayFrequency_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Frequency',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $('#inputForm').parsley().validate();
                    });
                }
            };

            $scope.itemType_array=[];
            $scope.checkValid=function(value){
                if(typeof value.itemType!="undefined"){
                    value.errorMessage=false;
                    var data=$filter('filter')($scope.itemType_array,{itemType:value.itemType},true);
                    if (data.length != 1) {
                        value.itemType="";
                        value.errorMessage=true;
                    }
                    // console.log(value,"defined")
                }else{
                    // console.log(value,"undefined")
                    value.itemType={};
                    value.errorMessage=true;
                }
            }

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
                        // console.log(value);
                        $('#inputForm').parsley().validate();
                    });
                }
            };

            $scope.form_dynamic = [];
            $scope.form_dynamic.push({'itemType':'','percentage':''});
            $scope.form_dynamic_model = [];

            // clone section
            $scope.cloneSection = function($event,$index,currentE,ITemArray) {
                var ArrayD=$scope.itemType_array[$index];
                console.log(ArrayD,'ArrayD');
                if (typeof ArrayD!="undefined") {
                    ArrayD.itemType=ArrayD.itemType || {};
                    if (ArrayD.itemType!="" && Object.keys(ArrayD.itemType).length!=0 && typeof ArrayD.percentage!="undefined" && ArrayD.percentage!="") {
                        $event.preventDefault();
                        $scope.form_dynamic.push({'itemType':'','percentage':''});
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

            // delete section
            $scope.deleteSection = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic_model.splice($index,1);
                $scope.form_dynamic.splice($index,1);
                $scope.itemType_array.splice($index,1);
            };

            $scope.cloneSection1=function($event,$index,currentE,ITemArray) {
                $event.preventDefault();
                $scope.form_dynamic.push({'itemType':'','percentage':''});
            }
            
            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                altair_uikit.reinitialize_grid_margin();
            })

            // $timeout(function(){
                var $formValidate = $('#inputForm');
                $formValidate
                    .parsley()
                    .on('form:validated',function() {
                        // $scope.$apply();
                    })
                    .on('field:validated',function(parsleyField) {
                        if($(parsleyField.$element).hasClass('md-input')) {
                            // $scope.$apply();
                        }
                    });
            // },1000);

            $scope.savePayStructure=function(){
                // console.log($scope.itemType_array.length,'$scope.itemType_array');
                $http({
                    method:'POST',
                    url: $localStorage.service+'PayrollPayslipAPI/payStructureDetail',
                    data: {
                        'id':$scope.paystru_id,
                        'structure_name' : $scope.paystruc_name,
                        'frequency' : $scope.PayFrequency,
                        // 'paydata' : $scope.form_dynamic
                        'paydata' : $scope.itemType_array
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.message.message);
                    if(return_data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 2000,
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
        }
    );
