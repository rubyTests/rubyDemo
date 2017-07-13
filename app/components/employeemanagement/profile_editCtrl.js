angular
    .module('rubycampusApp')
    .controller('employeetprofile_edit', [
        '$rootScope',
        '$scope',
        'user_data',
        '$stateParams',
        '$filter',
        '$http',
        '$timeout',
        '$state',
        '$localStorage',
        function ($rootScope,$scope,user_data,$stateParams,$filter,$http,$timeout,$state,$localStorage) {
            $timeout(function(){
            var $formValidate = $('#user_edit_form');
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
            },1000);

            // console.log($stateParams.emp_id,'$stateParams');
            // var paramsData=$filter('filter')(user_data, {id : $stateParams.emp_id});
            // $scope.user_data = paramsData[0];
            // $scope.user_data_contacts = user_data[0].contact;
            // languages
            var langData = $scope.user_languages_options = [
                {id: 1, title: 'English', value: 'gb'},
                {id: 2, title: 'French', value: 'fr'},
                {id: 3, title: 'Chinese', value: 'cn'},
                {id: 4, title: 'Dutch', value: 'nl'},
                {id: 5, title: 'Italian', value: 'it'},
                {id: 6, title: 'Spanish', value: 'es'},
                {id: 7, title: 'German', value: 'de'},
                {id: 8, title: 'Polish', value: 'pl'}
            ];
            $scope.user_languages_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                render: {
                    option: function(langData, escape) {
                        return  '<div class="option">' +
                            '<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                            '<span>' + escape(langData.title) + '</span>' +
                            '</div>';
                    },
                    item: function(langData, escape) {
                        return '<div class="item"><i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' + escape(langData.title) + '</div>';
                    }
                },
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                create: false,
                placeholder: 'Select Language...'
            };

            // user role
            $scope.user_role_config = {
                valueField: 'value',
                labelField: 'title',
                create: false,
                maxItems: 1,
                placeholder: 'Select...'
            };

            $scope.user_role_options = [
                {
                    "value": "admin",
                    "title": "Admin"
                },
                {
                    "value": "super_admin",
                    "title": "Super Admin"
                },
                {
                    "value": "editor",
                    "title": "Editor"
                },
                {
                    "value": "author",
                    "title": "Author"
                },
                {
                    "value": "none",
                    "title": "None"
                }
            ];


            // submit button
            $('#user_edit_submit').on('click',function(e) {
                e.preventDefault();
                var data = JSON.stringify($scope.user_data, null, 2),
                    user_name = user_data[0].name;

                UIkit.modal.alert('<p>Data for ' + user_name + ':</p><pre>' + data + '</pre>');
            })

            $http({
              method : "GET",
              url : $localStorage.service+"EmployeemgmntAPI/fetchEmployeeData",
              params :{id : $stateParams.emp_id},
              headers:{'access_token':$localStorage.access_token}
            }).then(function mySucces(response) {
                $timeout(function(){
                    $scope.user_data = response.data.data[0];
                    // $scope.user_data.MARITAL_ID=[response.data.data[0].MARITAL_ID];
                    // $scope.user_data.NATION_ID=[response.data.data[0].NATION_ID];
                    $scope.getMailingContactDetails(response.data.data[0].MAILING_ADDRESS);
                    $scope.getPermanantContactDetails(response.data.data[0].PERMANANT_ADDRESS);
                },500);
            },function myError(response){
                console.log(response);
            });


            $scope.getMailingContactDetails=function(mailling_id){
                $http({
                  method : "GET",
                  url : $localStorage.service+"EmployeemgmntAPI/mailingAddress",
                  params :{id : mailling_id},
                  headers:{'access_token':$localStorage.access_token}
                }).then(function mySucces(response) {
                    $timeout(function(){
                        $scope.mailing = response.data.data[0];
                    },700);
                },function myError(response){
                    console.log(response);
                });
            }
            $scope.getPermanantContactDetails=function(perm_id){
                $http({
                  method : "GET",
                  url : $localStorage.service+"EmployeemgmntAPI/mailingAddress",
                  params :{id : perm_id},
                  headers:{'access_token':$localStorage.access_token}
                }).then(function mySucces(response) {
                    $timeout(function(){
                        $scope.permanant = response.data.data[0];
                    },800);
                },function myError(response){
                    console.log(response);
                });
            }

            // Previous Institute Details
            $http({
              method : "GET",
              url : $localStorage.service+"EmployeemgmntAPI/previousInstitute",
              params :{id : $stateParams.emp_id},
              headers:{'access_token':$localStorage.access_token}
            }).then(function mySucces(response) {
                $timeout(function(){
                    // console.log(response.data,'response.data');
                    // $scope.previous_Inst = response.data.data;
                    $scope.form_dynamic=response.data.data;
                },2000); 
            },function myError(response){
                console.log(response);
            });

            $scope.CategoryList=[];
            $scope.CountryLIST=[];
            $scope.postionList=[];
            $scope.maritalList=[];
            $scope.NationalityLIST=[];
            $scope.Mailing=[];
            $scope.Permanant=[];
            $http.get($localStorage.service+'SettingAPI/maritalstatus',{headers:{'access_token':$localStorage.access_token}})
            .success(function(marital_list){
                $scope.maritalList.push(marital_list.data);
            });
            $http.get($localStorage.service+'EmployeemgmntAPI/categoryDetail',{headers:{'access_token':$localStorage.access_token}})
            .success(function(category_data){
                $scope.CategoryList.push(category_data.data);
            });
            $http.get($localStorage.service+'InstitutionAPI/country',{headers:{'access_token':$localStorage.access_token}})
            .success(function(country_list){
                $scope.CountryLIST.push(country_list.data);
            });
            $http.get($localStorage.service+'SettingAPI/Nationality',{headers:{'access_token':$localStorage.access_token}})
            .success(function(nationality_list){
                $scope.NationalityLIST.push(nationality_list.data);
            });

            $scope.selectize_marital_options = $scope.maritalList;
            $scope.selectize_marital_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Marital Status',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };
            $scope.selectize_nation_options = $scope.NationalityLIST;
            $scope.selectize_nation_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Nationality',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
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
                placeholder: 'Country *',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };
            $scope.selectize_prevcountry_options = $scope.CountryLIST;
            $scope.selectize_prevcountry_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Country',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };
            $scope.selectize_cat_options = $scope.CategoryList;
            $scope.selectize_cat_config = {
                create: false,
                    maxItems: 1,
                    placeholder: 'Category',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        
                    }
            };

            $scope.updateEmployeeDetails=function(){
                console.log($scope.user_data,'user_data');
                // console.log($scope.mailing,'mailing');
                // console.log($scope.permanant,'permanant');
                // console.log($scope.previous_Inst,'previous_Inst');

                // if (angular.isArray($scope.user_data.MARITAL_ID)) {
                //     var MARITAL_ID=$scope.user_data.MARITAL_ID[0];
                // }else{
                //     var MARITAL_ID=$scope.user_data.MARITAL_ID;
                // }
                // if (angular.isArray($scope.user_data.NATION_ID)) {
                //     var NATION_ID=$scope.user_data.NATION_ID[0];
                // }else{
                //     var NATION_ID=$scope.user_data.NATION_ID;
                // }
                var data=$('.fileinput-preview').find('img').attr('src');
                if(data){
                    var img_file=$('.fileinput-preview').find('img').attr('src');
                }else {
                    var img_file=$('.user_heading_avatar img:last').attr('src');
                }

                $http({
                    method:'POST',
                    url: $localStorage.service+'EmployeemgmntAPI/updateEmployeeAdmission',
                    data: {
                        'EMP_PROF_ID' :$scope.user_data.ID,
                        'Profile_id' :$scope.user_data.PROFILE_ID,
                        'dob' :$scope.user_data.DOB,
                        'image_file' :img_file,
                        'natoinality' :$scope.user_data.NATIONALITY,
                        'marital' :$scope.user_data.MARITAL_STATUS,
                        'facebook' :$scope.user_data.FACEBOOK_LINK,
                        'google' :$scope.user_data.GOOGLE_LINK,
                        'linkedin' :$scope.user_data.LINKEDIN_LINK,
                        'qualification' :$scope.user_data.QUALIFICATION,
                        'category' :$scope.user_data.EMP_CATEGORY_ID,
                        'phone' :$scope.user_data.PHONE_NO_1,
                        'mobile' :$scope.user_data.PHONE_NO_2,
                        'email' : $scope.user_data.EMAIL,  
                        'account_name':$scope.user_data.ACCOUNT_NAME,
                        'account_num':$scope.user_data.ACCOUNT_NO,
                        'bank_name':$scope.user_data.BANK_NAME,
                        'branch_name':$scope.user_data.BRANCH_NO,
                        'passport_num':$scope.user_data.PASSPORT_NO,
                        'work_permit':$scope.user_data.WORK_PERMIT,
                        'perm_add_id':$scope.user_data.PERMANANT_ADDRESS,
                        'mail_add_id':$scope.user_data.MAILING_ADDRESS,
                        'm_address':$scope.mailing.ADDRESS,
                        'm_city':$scope.mailing.CITY,
                        'm_state':$scope.mailing.STATE,
                        'm_pincode':$scope.mailing.ZIP_CODE,
                        'm_country':$scope.mailing.COUNTRY,
                        'p_address':$scope.permanant.ADDRESS,
                        'p_city':$scope.permanant.CITY,
                        'p_state':$scope.permanant.STATE,
                        'p_pincode':$scope.permanant.ZIP_CODE,
                        'p_country':$scope.permanant.COUNTRY,
                        'prvious_work':$scope.form_dynamic,
                        'Profile_extra_id' :$scope.user_data.PROFILE_EXTRA_ID,
                        'bank_id' :$scope.user_data.BANK_ID
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'update');
                    if(return_data.data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $state.go('restricted.employeemanagement.employee_profile_tableview');
                        if(return_data.data.data.check=='New'){
                            $timeout(function(){
                                $scope.backGroundEmail($scope.user_data.EMAIL);
                            },1000);
                        }

                    }else{
                        UIkit.notify({
                            message : 'Email already exists',
                            status  : 'danger',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                    }
                });
            }

            $scope.backGroundEmail=function(emailID){
                $http({
                    method:'POST',
                    url: $localStorage.service+'EmployeemgmntAPI/sendEmail',
                    data:{
                        'mail_id':emailID,
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    console.log(response,'response');
                });
            }

            $scope.form_dynamic = [];
            $scope.form_dynamic.push({'ID':'','DESIGNATION':'','INST_NAME':'','ADDRESS': '','CITY': '','STATE':'','ZIP_CODE': '','COUNTRY': '','PERIOD_FROM': '','PERIOD_TO':''});

            $scope.form_dynamic_model = [];

            // clone section
            $scope.cloneSection = function($event,$index,CurrForm) {
                if(CurrForm.DESIGNATION =='' || CurrForm.PERIOD_FROM=='' || CurrForm.PERIOD_TO==''){
                    UIkit.notify({
                        message : 'Please Fill current form',
                        status  : 'warning',
                        timeout : 2000,
                        pos     : 'top-center'
                    });
                }else {
                    console.log('Not Empty');
                    $event.preventDefault();
                    $scope.form_dynamic.push({'ID':'','DESIGNATION':'','INST_NAME':'','ADDRESS': '','CITY': '','STATE':'','ZIP_CODE': '','COUNTRY': '','PERIOD_FROM': '','PERIOD_TO':''});
                }
                // $event.preventDefault();
                // $scope.form_dynamic.push({'ID':'','DESIGNATION':'','INST_NAME':'','ADDRESS': '','CITY': '','STATE':'','ZIP_CODE': '','COUNTRY': '','PERIOD_FROM': '','PERIOD_TO':''});
            };

            // delete section
            $scope.deleteSection = function($event,$index,CurrForm) {
                console.log(CurrForm,'CurrForm');
                var id=CurrForm.ID;
                var Loc_id=CurrForm.LOCATION_ID;
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"EmployeemgmntAPI/previousInstitute",
                            params : {id : id,Loc_id:Loc_id},
                            // headers:{'access_token':$localStorage.access_token}
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
            };

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                altair_uikit.reinitialize_grid_margin();
            });

            // $scope.addNewWorkINfo=function(){
            //     // $event.preventDefault();
            //     $scope.form_dynamic.push({'ID':'','DESIGNATION':'','INST_NAME':'','ADDRESS': '','CITY': '','STATE':'','ZIP_CODE': '','COUNTRY': '','PERIOD_FROM': '','PERIOD_TO':''});
            // }
        }
    ])
;