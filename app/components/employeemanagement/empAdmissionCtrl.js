angular
    .module('rubycampusApp')
    .controller('empAdmCtrl', [
        '$scope',
        'utils',
        '$http','$rootScope', '$filter','$localStorage','$state','$timeout',
        function ($scope,utils,$http,$rootScope, $filter,$localStorage,$state,$timeout) {

            // var $wizard_advanced_form = $('#wizard_advanced_form');
            $scope.EMP_ADM=[];
            $scope.CONTACT=[];
            $scope.PREVOIUS=[];
            $scope.ADDITIONAl=[];
            $scope.deptData=[];
            $scope.CategoryList=[];
            $scope.CountryLIST=[];
            $scope.postionList=[];
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
                    $scope.Permanant.address=null;
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
            .success(function(country_list){
                $scope.postionList.push(country_list.data);
            });
            $http.get($localStorage.service+'SettingAPI/maritalstatus',{headers:{'access_token':$localStorage.access_token}})
            .success(function(marital_list){
                $scope.maritalList.push(marital_list.data);
            });
            $scope.selectize_marital_options = $scope.maritalList;
            $scope.selectize_marital_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Marital Status',
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
                placeholder: 'Select Department',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };
            $scope.selectize_pos_options = $scope.postionList;
            $scope.selectize_pos_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Position',
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
                placeholder: 'Select Nationality',
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
                placeholder: 'Select Country',
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
                    placeholder: 'Select Category...',
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
            $scope.cloneSection = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic.push({'prevInst_ID':'','locationID':'','employee_role': '','p_institute_name': '','prev_address':'','prev_city': '','prev_state': '','prev_country':'','prev_pincode': '','prev_period_from': '','prev_period_to':''});
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
                    console.log(return_data.data.data.message);
                    UIkit.notify({
                        message : return_data.data.data.message,
                        status  : 'success',
                        timeout : 2000,
                        pos     : 'top-center'
                    });
                    $scope.employee_id=return_data.data.data.EMP_PROFILE_ID;
                    $scope.ProfileID=return_data.data.data.PROFILE_ID;
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
                    angular.forEach(return_data.data.data.INSTITUTE_ID, function (value, keys) {
                        $scope.form_dynamic[keys].prevInst_ID=value;
                    });
                    angular.forEach(return_data.data.data.LOCATION_ID, function (value, keys) {
                        $scope.form_dynamic[keys].locationID=value;
                    }); 
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

            $scope.EMP_ADM.join_date=$filter('date')(new Date(),'MM.dd.yyyy');
            $scope.EMP_ADM.dob=$filter('date')(new Date(),'MM.dd.yyyy');
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

                // var $formValidate = $('#previousWorkForm');
                // $formValidate
                //     .parsley()
                //     .on('form:validated',function() {
                //         $scope.$apply();
                //     })
                //     .on('field:validated',function(parsleyField) {
                //         if($(parsleyField.$element).hasClass('md-input')) {
                //             $scope.$apply();
                //         }
                //     }); 
            },500);

            $scope.exitValidation = function(){
                if($scope.EMP_ADM.admission_no==undefined || $scope.EMP_ADM.join_date==undefined || $scope.EMP_ADM.first_name==undefined || $scope.EMP_ADM.last_name==undefined || $scope.EMP_ADM.dob==undefined || $scope.EMP_ADM.qualification==undefined || $scope.EMP_ADM.department==undefined || $scope.EMP_ADM.category==undefined || $scope.EMP_ADM.position==undefined){
                    return false;
                }else{
                    return true;
                }
            }
            $scope.exitValidation1 = function(){
                if($scope.Mailing.address==undefined || $scope.Mailing.city==undefined || $scope.Mailing.state==undefined || $scope.Mailing.country==undefined || $scope.Permanant.address==undefined || $scope.Permanant.city==undefined || $scope.Permanant.state==undefined || $scope.Permanant.country==undefined || $scope.ADDITIONAl.phone_no==undefined || $scope.ADDITIONAl.email==undefined || $scope.ADDITIONAl.mobile_no==undefined){
                    return false;
                }else{
                    return true;
                }
            }
            // $scope.exitValidation2 = function(){
            //     if($scope.PREVOIUS.employee_role==undefined){
            //         return false;
            //     }else{
            //         return true;
            //     }
            // }
        }
    ]);