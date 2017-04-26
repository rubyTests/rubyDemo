angular
    .module('rubycampusApp')
    .controller('empAdmCtrl', [
        '$scope',
        'utils',
        '$http','$rootScope', '$filter','$localStorage','$state','$timeout','WizardHandler',
        function ($scope,utils,$http,$rootScope, $filter,$localStorage,$state,$timeout,WizardHandler) {

            // var $wizard_advanced_form = $('#wizard_advanced_form');
            $scope.EMP_ADM=[];
            $scope.CONTACT=[];
            $scope.PREVOIUS=[];
            $scope.ADDITIONAl=[];
            $scope.deptData=[];
            $scope.CategoryList=[];
            $scope.CountryLIST=[];
            $scope.PostionLISTS=[];
            $scope.maritalList=[];
            $scope.NationalityLIST=[];
            $scope.Mailing=[];
            $scope.Permanant=[];
            $scope.checkStatus=function(res){
                console.log(res);
                if(res==true){
                    console.log($scope.Mailing,'trueeee');
                    $scope.Permanant.address=$scope.Mailing.address;
                    $scope.Permanant.city=$scope.Mailing.city;
                    $scope.Permanant.state=$scope.Mailing.state;
                    $scope.Permanant.pincode=$scope.Mailing.pincode;
                    $scope.Permanant.country=$scope.Mailing.country;
                    $scope.Permanant.phone=$scope.Mailing.phone;
                    $scope.Permanant.mobile_no=$scope.Mailing.mobile_no;
                    $scope.Permanant.email=$scope.Mailing.email;
                    $('.PermanantDetails').find('input').attr('disabled',true);
                }else {
                    console.log('false');
                    $scope.Permanant.address='';
                    $scope.Permanant.city='';
                    $scope.Permanant.state='';
                    $scope.Permanant.pincode='';
                    $scope.Permanant.country='';
                    $scope.Permanant.phone='';
                    $scope.Permanant.mobile_no='';
                    $scope.Permanant.email='';
                    $('.PermanantDetails').find('input').attr('disabled',false);
                    $('.PermanantDetails').find('input').trigger('blur');
                }
            }

            $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
            .success(function(dept_data){
                $scope.deptData.push(dept_data.message);
            });
            $http.get($localStorage.service+'EmployeemgmntAPI/categoryDetail',{headers:{'access_token':$localStorage.access_token}})
            .success(function(category_data){
                $scope.CategoryList.push(category_data.data);
            });
            $http.get($localStorage.service+'institutionApi/country',{headers:{'access_token':$localStorage.access_token}})
            .success(function(country_list){
                $scope.CountryLIST.push(country_list.data);
            });
            $http.get($localStorage.service+'SettingAPI/Nationality',{headers:{'access_token':$localStorage.access_token}})
            .success(function(nationality_list){
                $scope.NationalityLIST.push(nationality_list.data);
            });
            $http.get($localStorage.service+'EmployeemgmntAPI/positionDetail',{headers:{'access_token':$localStorage.access_token}})
            .success(function(positionList){
                $scope.PostionLISTS.push(positionList.data);
            });
            $http.get($localStorage.service+'SettingAPI/maritalstatus',{headers:{'access_token':$localStorage.access_token}})
            .success(function(marital_list){
                $scope.maritalList.push(marital_list.data);
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
            $scope.selectize_d_options = $scope.deptData;
            $scope.selectize_d_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Department *',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $('#basicForm').parsley().validate();
                        console.log(value);
                    });
                }
            };
            $scope.selectize_position_options = $scope.PostionLISTS;
            $scope.selectize_position_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Position',
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
                        $timeout(function() {
                            $('#contactForm').parsley().validate();
                        }, 200);
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
            

            
            $scope.form_dynamic = [];
            $scope.form_dynamic.push({'prevInst_ID':'','locationID':'','employee_role': '','p_institute_name': '','prev_address':'','prev_city': '','prev_state': '','prev_country':'','prev_pincode': '','prev_period_from': '','prev_period_to':''});

            $scope.form_dynamic_model = [];

            // clone section
            $scope.cloneSection = function($event,$index,currentE) {
                console.log(currentE,'currentE');
                if(currentE.employee_role =='' || currentE.prev_period_from=='' || currentE.prev_period_to==''){
                    UIkit.notify({
                        message : 'Please Fill current form',
                        status  : 'warning',
                        timeout : 2000,
                        pos     : 'top-center'
                    });
                }else {
                    console.log('Not Empty');
                    $event.preventDefault();
                    $scope.form_dynamic.push({'prevInst_ID':'','locationID':'','employee_role': '','p_institute_name': '','prev_address':'','prev_city': '','prev_state': '','prev_country':'','prev_pincode': '','prev_period_from': '','prev_period_to':''});
                }
                
                // $event.preventDefault();
                // $scope.form_dynamic.push({'prevInst_ID':'','locationID':'','employee_role': '','p_institute_name': '','prev_address':'','prev_city': '','prev_state': '','prev_country':'','prev_pincode': '','prev_period_from': '','prev_period_to':''});
            };

            // delete section
            $scope.deleteSection = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic_model.splice($index,1);
                $scope.form_dynamic.splice($index,1);
            };

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                altair_uikit.reinitialize_grid_margin();
            });



            $scope.saveAdmissionDetails=function(){
                // console.log($scope.EMP_ADM.admission_no,'$scope.EMP_ADM');
                var img_file=$('.fileinput-preview').find('img').attr('src');
                $http({
                    method:'POST',
                    url: $localStorage.service+'EmployeemgmntAPI/employeeAdmission',
                    data: {
                        'employee_id' : $scope.employee_id,
                        'admission_no' : $scope.EMP_ADM.admission_no,
                        'join_date' : $scope.EMP_ADM.join_date,
                        'profile_image' : img_file,
                        'first_name' : $scope.EMP_ADM.first_name,
                        'last_name' : $scope.EMP_ADM.last_name,
                        'gender' : $scope.EMP_ADM.gender,
                        'dob' : $scope.EMP_ADM.dob,
                        'marital_status' : $scope.EMP_ADM.marital_status,
                        'nationality' : $scope.EMP_ADM.nationality,
                        'qualification':$scope.EMP_ADM.qualification,
                        'department' : $scope.EMP_ADM.department,
                        'category' : $scope.EMP_ADM.category,
                        'position' : $scope.EMP_ADM.position,
                        'ProfileID' : $scope.ProfileID
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.status,'sss');
                    if(return_data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $scope.employee_id=return_data.data.data.EMP_PROFILE_ID;
                        $scope.ProfileID=return_data.data.data.PROFILE_ID;
                        $scope.DummyProfileID=return_data.data.data.PROFILE_ID;
                        WizardHandler.wizard().next();
                    }else {
                        UIkit.modal.alert('Admission No Already Exists');
                    }
                    
                });
            };

            $scope.saveConatctDetails=function(){
                $http({
                    method:'POST',
                    url: $localStorage.service+'EmployeemgmntAPI/employeeContactDetail',
                    data: {
                        'mailing_id' : $scope.mailing_id,
                        'permanant_id' : $scope.permanant_id,
                        'employee_id' : $scope.employee_id,
                        'ProfileID' : $scope.ProfileID,
                        "m_address":$scope.Mailing.address,
                        "m_city":$scope.Mailing.city,
                        "m_state":$scope.Mailing.state,
                        "m_pincode":$scope.Mailing.pincode,
                        "m_country":$scope.Mailing.country,
                        "p_address":$scope.Permanant.address,
                        "p_city":$scope.Permanant.city,
                        "P_state":$scope.Permanant.state,
                        "P_pincode":$scope.Permanant.pincode,
                        "P_country":$scope.Permanant.country,
                        "phone_no":$scope.ADDITIONAl.phone_no,
                        "mobile_no":$scope.ADDITIONAl.mobile_no,
                        "email":$scope.ADDITIONAl.email,
                        "facebook":$scope.ADDITIONAl.facebook,
                        "google":$scope.ADDITIONAl.google,
                        "linked_in":$scope.ADDITIONAl.linkedin
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.data.message);
                    UIkit.notify({
                        message : return_data.data.data.message,
                        status  : 'success',
                        timeout : 2000,
                        pos     : 'top-center'
                    });
                    $scope.mailing_id=return_data.data.data.MAILING_ADDRESS_ID;
                    $scope.permanant_id=return_data.data.data.PERM_ADDRESS_ID;
                    $scope.employee_profileID=return_data.data.data.EMP_PROFILE_ID;
                    $scope.ThirdProfileID=return_data.data.data.EMP_PROFILE_ID;
                    WizardHandler.wizard().next();
                });
            }
            $scope.savePreviousInstituteDetails=function(){
                 $http({
                    method:'POST',
                    url: $localStorage.service+'EmployeemgmntAPI/employeePreviousInstitute',
                    data: {
                        'instituteID' :$scope.instituteID,
                        'emp_profileID' : $scope.employee_profileID,  
                        'prev_inst_data':$scope.form_dynamic,
                        // 'prevInstID':$scope.PREVOIUS.prevInst_ID
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.data.message);
                    UIkit.notify({
                        message : return_data.data.data.message,
                        status  : 'success',
                        timeout : 2000,
                        pos     : 'top-center'
                    });
                    $scope.instituteID=return_data.data.data.INSTITUTE_ID;
                    $scope.dummyINST_ID=return_data.data.data.INSTITUTE_ID;
                    angular.forEach(return_data.data.data.INSTITUTE_ID, function (value, keys) {
                        $scope.form_dynamic[keys].prevInst_ID=value;
                    });
                    angular.forEach(return_data.data.data.LOCATION_ID, function (value, keys) {
                        $scope.form_dynamic[keys].locationID=value;
                    }); 
                    WizardHandler.wizard().next();
                });
            }
            $scope.saveAdditioinalDetails=function(){
                // console.log($scope.ProfileID,'$scope.ProfileID');
                $http({
                    method:'POST',
                    url: $localStorage.service+'EmployeemgmntAPI/employeeAdditionalDetails',
                    data: {
                        'profile':$scope.ProfileID,
                        'emp_profile_id':$scope.employee_id,
                        'profile_extra_id':$scope.ADDITIONAl.profile_extra_id,
                        'acc_name' :$scope.ADDITIONAl.acc_name,
                        'acc_number' :$scope.ADDITIONAl.acc_number,
                        'bank_name' :$scope.ADDITIONAl.bank_name,
                        'branch' :$scope.ADDITIONAl.branch,
                        'passport' :$scope.ADDITIONAl.passport,
                        'work_permit' :$scope.ADDITIONAl.work_permit
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.data.message);
                    if(return_data.data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $timeout(function(){
                            $state.go('restricted.employeemanagement.employee_profile_tableview');
                        },200);
                    }
                });
            }

            // $scope.EMP_ADM.join_date=$filter('date')(new Date(),'MM.dd.yyyy');
            // $scope.EMP_ADM.dob=$filter('date')(new Date(),'MM.dd.yyyy');
            // form_validation
            $timeout(function(){
                var $formValidate = $('#basicForm');
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

                var $formValidate = $('#contactForm');
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

            $scope.exitValidation = function(){
                // if($scope.EMP_ADM.admission_no==undefined || $scope.EMP_ADM.join_date==undefined || $scope.EMP_ADM.first_name==undefined || $scope.EMP_ADM.last_name==undefined || $scope.EMP_ADM.dob==undefined || $scope.EMP_ADM.qualification==undefined || $scope.EMP_ADM.department==undefined){
                    if($scope.EMP_ADM.admission_no==undefined){
                    return false;
                }else{
                    return true;
                }
            }

            $scope.enterValidation = function(){
                if($scope.DummyProfileID==undefined){
                 return false;
                }else{
                 return true;
                }
               }
            $scope.enterValidation1 = function(){
                if($scope.ThirdProfileID==undefined){
                 return false;
                }else{
                 return true;
                }
               }

                $scope.enterValidation2 = function(){
                if($scope.dummyINST_ID==undefined){
                 return false;
                }else{
                 return true;
                }
               }
            //  
            // $scope.exitValidation2 = function(){
            //     if($scope.PREVOIUS.employee_role==undefined){
            //         return false;
            //     }else{
            //         return true;
            //     }
            // }

            // $scope.checkCheckBox=function(){
            //     $('#checkboxStatus').trigger('click');
            // }

            // $('.uk-clearfix li').css('pointer-events','none');

            $timeout(function(){
            // date range
            var $dp_start = $('#uk_dp_start'),
                $dp_end = $('#uk_dp_end');

            var start_date = UIkit.datepicker($dp_start, {
                format:'DD.MM.YYYY'
            });

            var end_date = UIkit.datepicker($dp_end, {
                format:'DD.MM.YYYY'
            });

            $dp_start.on('change',function() {
                end_date.options.maxDate = $dp_start.val();
            });

            $dp_end.on('change',function() {
                start_date.options.minDate = $dp_end.val();
            });

            $scope.checkDateValidation=function(data){
                console.log(data,'data');
                if(data){
                    console.log(data,'true');
                    $timeout(function() {
                        $('#basicForm').parsley().validate();
                    }, 200);
                }else {
                    console.log(data,'true');
                }
            }
        },1100);
        }
    ]);