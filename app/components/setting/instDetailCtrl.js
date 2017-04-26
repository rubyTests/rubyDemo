angular
    .module('rubycampusApp')
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
            $http.get($localStorage.service+'institutionApi/institutetype',{headers:{'access_token':$localStorage.access_token}})
            .success(function(inst_type){
                $scope.IinstLIST.push(inst_type.data);
            });
            $http.get($localStorage.service+'institutionApi/country',{headers:{'access_token':$localStorage.access_token}})
            .success(function(country_list){
                $scope.CountryLIST.push(country_list.data);
            });
            $http.get($localStorage.service+'institutionApi/currency',{headers:{'access_token':$localStorage.access_token}})
            .success(function(currency_data){
                $scope.CurrncyLIST.push(currency_data.data);
            });
            $http.get($localStorage.service+'institutionApi/timezone',{headers:{'access_token':$localStorage.access_token}})
            .success(function(timeZone){
                $scope.TimeLIST.push(timeZone.data);
            });

            $http.get($localStorage.service+'SettingAPI/employeeList',{headers:{'access_token':$localStorage.access_token}})
            .success(function(profileData){
                $scope.returnProfile.push(profileData.data);
            });

            $scope.selectize_contact_options = $scope.returnProfile;
            $scope.selectize_contact_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Admin In-Charge',
                valueField: 'ID',
                labelField: 'FULLNAME',
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
                placeholder: 'Institute Type',
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
                        
                    });
                }
            };
            $scope.selectize_currency_options = $scope.CurrncyLIST;
            $scope.selectize_currency_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Currency',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
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
				searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        
                    });
                }
            };


            $scope.saveInstitutionData=function(){
                var data=$('.fileinput-preview').find('img').attr('src');
                if(data){
                    var data=$('.fileinput-preview').find('img').attr('src');
                }else {
                    var data=$('.user_heading_avatar img:last').attr('src');
                }
                $http({
                    method:'POST',
                    url: $localStorage.service+'institutionApi/institutionDetails',
                    data: {
                        'file_image' : data,
                        'institute_name' : $scope.Basic.institute_name,
                        'code' : $scope.Basic.institute_code,
                        'type' : $scope.Basic.institute_type,
                        'time_zone' : $scope.Basic.time_zone,
                        'currency' : $scope.Basic.currency,
                        'profile_id' : $scope.contact.prof_id,
                        'institution_id' : $scope.Basic.institution_id
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.data.message);
                    $scope.contact.prof_id=return_data.data.data.PROFILE_ID;
                    $scope.Basic.institution_id=return_data.data.data.INSTITUTION_ID;
                    if(return_data.data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                    }
                });
            };

            $scope.saveInstitutionContact=function(){
                var data=$('.fileinput-preview').find('img').attr('src');
                // $scope.Basic.ddd=data;
                $http({
                    method:'POST',
                    url: $localStorage.service+'institutionApi/institutionContactDetails',
                    data: {
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
                        'profile_id' : $scope.contact.prof_id,
                        'location_id' : $scope.contact.locationId,
                        'lnstut_id' : $scope.Basic.institution_id
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.data.message);
                    $scope.contact.prof_id=return_data.data.data.PROFILE_ID;
                    $scope.contact.locationId=return_data.data.data.LOCATION_ID;
                    if(return_data.data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                    }
                });
            };


            $http({
              method : "GET",
              url : $localStorage.service+"institutionApi/institutionDetails",
              headers:{'access_token':$localStorage.access_token}
            }).then(function mySucces(response) {
                console.log(response.data,'response');
                $timeout(function(){
                    $scope.Basic.institute_name=response.data.data[0].INST_NAME;
                    $scope.Basic.institute_code=response.data.data[0].CODE;
                    $scope.Basic.institute_type=response.data.data[0].TYPE;
                    $scope.Basic.time_zone=response.data.data[0].TIME_ZONE;
                    $scope.Basic.currency=response.data.data[0].CURRENCY;
                    $scope.Basic.institution_id=response.data.data[0].ID;
                    $scope.contact.prof_id=response.data.data[0].PROF_ID;
                    $scope.LOGO=response.data.data[0].LOGO;
                    $scope.contact.address=response.data.data[0].ADDRESS;
                    $scope.contact.contact_name=response.data.data[0].CONTACT_PERSON;
                    $scope.contact.city=response.data.data[0].CITY;
                    $scope.contact.state=response.data.data[0].STATE;
                    $scope.contact.pincode=response.data.data[0].ZIP_CODE;
                    $scope.contact.country=response.data.data[0].COUNTRY_ID;
                    $scope.contact.phone=response.data.data[0].PHONE_NO_1;
                    $scope.contact.mobile_no=response.data.data[0].PHONE_NO_2;
                    $scope.contact.email=response.data.data[0].EMAIL;
                    $scope.contact.facebook=response.data.data[0].FACEBOOK_LINK;
                    $scope.contact.google=response.data.data[0].GOOGLE_LINK;
                    $scope.contact.locationId=response.data.data[0].LOCATION_ID;
                },200);
              }, function myError(response) {
                console.log(response,'error');
            });


            // form_validation
            $timeout(function(){
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

                var $formValidate = $('#contactValidation');
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
            },500);

            $scope.exitValidation = function(){
                if($scope.Basic.institute_name==undefined){
                    return false;
                }else{
                    return true;
                }
            }

            $scope.exitValidation1 = function(){
                if($scope.contact.address==undefined || $scope.contact.city==undefined || $scope.contact.state==undefined || $scope.contact.phone==undefined || $scope.contact.mobile_no==undefined || $scope.contact.email==undefined){
                    return false;
                }else{
                    return true;
                }
            }
        }
    ]);