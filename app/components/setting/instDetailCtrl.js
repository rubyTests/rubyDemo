angular
    .module('altairApp')
    .controller('instDetailCtrl', [
        '$scope',
        'utils',
        '$http','$rootScope', '$filter','$compile', '$scope', '$timeout','$state','$localStorage',
        function ($scope,utils,$http,$rootScope, $filter,$compile, $scope, $timeout,$state,$localStorage) {

            var $wizard_advanced_form = $('#wizard_advanced_form');
            $scope.IinstLIST=[];
            $scope.CountryLIST=[];
            $scope.CurrncyLIST=[];
            $scope.TimeLIST=[];
            $scope.Basic=[];
            $scope.contact=[];
            $scope.returnProfile=[];
            $http.get($localStorage.service+'institutionApi/institutetype')
            .success(function(inst_type){
                $scope.IinstLIST.push(inst_type.data);
            });
            $http.get($localStorage.service+'institutionApi/country',headers:{'access_token':$localStorage.access_token})
            .success(function(country_list){
                $scope.CountryLIST.push(country_list.data);
            });
            $http.get($localStorage.service+'institutionApi/currency',headers:{'access_token':$localStorage.access_token})
            .success(function(currency_data){
                $scope.CurrncyLIST.push(currency_data.data);
            });
            $http.get($localStorage.service+'institutionApi/timezone',headers:{'access_token':$localStorage.access_token})
            .success(function(timeZone){
                $scope.TimeLIST.push(timeZone.data);
            });

            $http.get($localStorage.service+'institutionApi/profile',headers:{'access_token':$localStorage.access_token})
            .success(function(profileData){
                $scope.returnProfile.push(profileData.data);
            });

            $scope.selectize_contact_options = $scope.returnProfile;
            $scope.selectize_contact_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Person',
                valueField: 'ID',
                labelField: 'FIRSTNAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };

            $scope.selectize_instType_options = $scope.IinstLIST;
            $scope.selectize_instType_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Type',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };
            $scope.selectize_timezone_options = $scope.TimeLIST;
            $scope.selectize_timezone_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Timezone',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };
            $scope.selectize_currency_options = $scope.CurrncyLIST;
            $scope.selectize_currency_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Type',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };
            $scope.selectize_country_options = $scope.CountryLIST;
            $scope.selectize_country_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Country',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };

            $scope.saveInstitutionData=function(){
                var data=$('.fileinput-preview').find('img').attr('src');
                // $scope.Basic.ddd=data;
                $http({
                    method:'POST',
                    url: $localStorage.service+'institutionApi/institution',
                    data: {
                        'file_image' : data,
                        'institute_name' : $scope.Basic.institute_name,
                        'code' : $scope.Basic.institute_code,
                        'type' : $scope.Basic.institute_type,
                        'time_zone' : $scope.Basic.time_zone,
                        'currency' : $scope.Basic.currency,
                        'fax' : $scope.Basic.fax,
                        'address' : $scope.contact.address,
                        'contact_name' : $scope.contact.contact_name,
                        'city' : $scope.contact.city,
                        'state' : $scope.contact.state,
                        'pincode' : $scope.contact.pincode,
                        'country' : $scope.contact.country,
                        'phone' : $scope.contact.phone,
                        'mobile_no' : $scope.contact.mobile_no,
                        'email' : $scope.contact.email,
                        'facebook' : $scope.contact.facebook,
                        'google' : $scope.contact.google,
                        'profile_id' : $scope.contact.prof_id
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.data.message,'dddddd');
                    $scope.contact.prof_id=return_data.data.data.PROFILE_ID;
                    // if(return_data.data.data.checkStatus==true){
                    //     $state.go('restricted.setting.institution_view');
                    // }
                });
            };
            $scope.reLoadView=function(){
                $timeout(function(){
                    $state.go('restricted.setting.institution_view');
                },200)
            }
        }
    ]);