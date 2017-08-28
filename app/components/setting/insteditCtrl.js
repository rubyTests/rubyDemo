angular
    .module('rubycampusApp')
    .controller('insteditCtrl', [
        '$scope',
        'utils',
        '$http','$rootScope', '$filter','$compile','$timeout','$stateParams','$state','$localStorage',
        function ($scope,utils,$http,$rootScope, $filter,$compile,$timeout,$stateParams,$state,$localStorage) {

            // var data=$filter('filter')(ts_data, {id : parseInt($stateParams.id)},true);

            var $wizard_advanced_form = $('#wizard_advanced_form');
            $scope.IinstLIST=[];
            $scope.CountryLIST=[];
            $scope.CurrncyLIST=[];
            $scope.TimeLIST=[];
            $scope.Basic=[];
            $scope.contact=[];
            // $scope.returnLocation=[];
            $scope.returnProfile1=[];

            $http.get($localStorage.service+'InstitutionAPI/profile',{headers:{'access_token':$localStorage.access_token}})
            .success(function(profileData){
                // console.log(profileData,'profileData');
                $scope.returnProfile=profileData.data;
                $scope.returnProfile1.push(profileData.data);
            });

            $http.get($localStorage.service+'InstitutionAPI/location',{headers:{'access_token':$localStorage.access_token}})
            .success(function(locationData){
                // console.log(locationData.data[0],'locationData');
                $scope.returnLocation=locationData.data;
            });

             $http({
              method : "GET",
              url : $localStorage.service+"InstitutionAPI/institution",
              params : {id : $stateParams.id},
              headers:{'access_token':$localStorage.access_token}
            }).then(function mySucces(response) {
                $timeout(function(){
                    console.log($scope.returnProfile,'$scope.returnProfile');
                    var profileData=$filter('filter')($scope.returnProfile, {ID : response.data.data[0].PROF_ID},true);
                    console.log(profileData,'profileData');
                    var locationListData=$filter('filter')($scope.returnLocation, {ID : profileData[0].LOCATION_ID},true);
                    $scope.Basic.institute_name=profileData[0].FIRSTNAME;
                    $scope.Basic.code=response.data.data[0].CODE;
                    $scope.Basic.institute_type=response.data.data[0].TYPE;
                    $scope.Basic.time_zone=response.data.data[0].TIME_ZONE;
                    $scope.Basic.currency=response.data.data[0].CURRENCY;
                    $scope.Basic.fax=response.data.data[0].FAX;
                    $scope.Basic.inst_image=response.data.data[0].LOGO;
                    $scope.contact.contact_name=profileData[0].ID;
                    $scope.contact.address=locationListData[0].ADDRESS;
                    $scope.contact.city=locationListData[0].CITY;
                    $scope.contact.state=locationListData[0].STATE;
                    $scope.contact.pincode=locationListData[0].ZIP_CODE;
                    $scope.contact.country=locationListData[0].COUNTRY;
                    $scope.contact.phone=profileData[0].PHONE_NO_1;
                    $scope.contact.mobile_no=profileData[0].PHONE_NO_2;
                    $scope.contact.email=profileData[0].EMAIL;
                    $scope.contact.facebook=profileData[0].FACEBOOK_LINK;
                    $scope.contact.google=profileData[0].GOOGLE_LINK;
                    $scope.Basic.instID=response.data.data[0].ID;
                    $scope.Basic.profileID=profileData[0].ID;
                    $scope.contact.locationID=locationListData[0].ID;
                    $scope.imageSet=response.data.data[0].LOGO;
                    console.log(response.data.data[0].LOGO,'response.data.data[0].LOGO');
                    $('.fileinput-preview').find('img').attr('src',response.data.data[0].LOGO);
                },300);
              }, function myError(response) {
                console.log(response,'error');
            });


            $http.get($localStorage.service+'InstitutionAPI/institutetype',{headers:{'access_token':$localStorage.access_token}})
            .success(function(inst_type){
                $scope.IinstLIST.push(inst_type.data);
            });
            $http.get($localStorage.service+'InstitutionAPI/country',{headers:{'access_token':$localStorage.access_token}})
            .success(function(country_list){
                $scope.CountryLIST.push(country_list.data);
            });
            $http.get($localStorage.service+'InstitutionAPI/currency',{headers:{'access_token':$localStorage.access_token}})
            .success(function(currency_data){
                $scope.CurrncyLIST.push(currency_data.data);
            });
            $http.get($localStorage.service+'InstitutionAPI/timezone',{headers:{'access_token':$localStorage.access_token}})
            .success(function(timeZone){
                $scope.TimeLIST.push(timeZone.data);
            });


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
            $scope.selectize_contact_options = $scope.returnProfile1;
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
            $scope.updateInstitutionData=function(){
                var images=$('.user_heading_avatar img:last').attr('src');
                console.log(images[0],'images');
                $http({
                    method:'POST',
                    url: $localStorage.service+'InstitutionAPI/institution',
                    data: {
                        'file_image' : images,
                        'institute_name' : $scope.Basic.institute_name,
                        'code' : $scope.Basic.code,
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
                        'profile_id' : $scope.contact.prof_id,
                        'instID' : $scope.Basic.instID,
                        'profileID' : $scope.Basic.profileID,
                        'locationID' : $scope.contact.locationID
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_data');
                    // $scope.contact.prof_id=return_data.data.data.PROFILE_ID;
                });
            };

            $scope.reLoadView=function(){
                $timeout(function(){
                    $state.go('restricted.setting.institution_view');
                },200)
            }
        }
    ]);