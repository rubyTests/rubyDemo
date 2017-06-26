angular
    .module('rubycampusApp')
    .controller('syllabusaddCtrl', [
        '$scope',
        '$rootScope',
        '$timeout','$filter','$compile','$stateParams','$state','$localStorage','$http',
        function ($scope,$rootScope,$timeout, $filter,$compile,$stateParams,$state,$localStorage,$http) {
            $scope.syllabus=[];
            $scope.subjectList=[];
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
                $scope.courseID="";
                $scope.dept_id="";
                $scope.course_id="";
            }
            //Course
            var $formValidate = $('#form_validation1');
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
            $scope.clearValidation1=function(){
                $('#form_validation1').parsley().reset();
                $scope.courseID="";
                $scope.dept_id="";
                $scope.subjectID="";
                $scope.course_id="";
                $scope.course_clearData();
            }
            //Department
            var $formValidate = $('#form_validation2');
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
            $scope.clearValidation2=function(){
                $('#form_validation2').parsley().reset();
                $scope.courseID="";
                $scope.dept_id="";
                $scope.subjectID="";
                $scope.course_id="";
                $scope.dept_clearData();
            }
            //Subject
            // var $formValidate = $('#form_validation3');
            // $formValidate
            // .parsley()
            // .on('form:validated',function() {
            //     $scope.$apply();
            // })
            // .on('field:validated',function(parsleyField) {
            //     if($(parsleyField.$element).hasClass('md-input')) {
            //         $scope.$apply();
            //     }
            // });
            // $scope.clearValidation3=function(){
            //     $('#form_validation3').parsley().reset();
            //     $scope.courseID="";
            //     $scope.dept_id="";
            //     $scope.subjectID="";
            // }
            $scope.courseData=[];
            var academicsAPI_courseData = function(){
                $http.get($localStorage.service+'AcademicsAPI/fetchCourseData',{headers:{'access_token':$localStorage.access_token}})
                .success(function(cor_data){
                    console.log(cor_data,'ciueeeerer');
                    if(cor_data.status==false){
                        $scope.courseData.push([{ID:0, NAME:"Add Course"}]);
                    }else{
                        $scope.courseData.push(cor_data.data);
                        $scope.courseData.push([{ID:0, NAME:"Add Course"}]);
                    }
                });
            }
            academicsAPI_courseData();
            $scope.selectize_course_options = $scope.courseData;
            $scope.selectize_course_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Course',
                valueField: 'ID',
                sortField: [{field: 'ID', direction: 'desc'}],
                labelField: 'NAME',
                searchField: 'NAME',
                render: {
                    option: function (item, escape) {
                        if(item.ID==0){
                            return '<div class="option">' +
                                        '<div class="text">' +
                                            '<i class="uk-icon-plus linkClr"></i>' + '<span class="linkClrtxt">' + escape(item.NAME) + '</span>' +
                                       '</div>' +
                                    '</div>';
                        }else{
                            return '<div class="option">' +
                                    '<div class="text">' +
                                        '<span class="name">' + escape(item.NAME) + '</span>' +
                                   '</div>' +
                                '</div>';
                        }
                       
                    }
                },
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        if (value == 0) {
                            $timeout(function(){
                                $scope.shouldBeOpen = true;    
                            },500);
                            var modal = UIkit.modal("#course_modal",{bgclose: false, keyboard:false});
                            $('.uk-modal').find('input').trigger('blur');
                            if ( modal.isActive() ) {
                                modal.hide();
                            } else {
                                modal.show();
                            }
                        }else{
                            $scope.subjectData(value);
                        }
                    });
                }
            };
            $scope.subjectData = function(id){
                
                $http.get($localStorage.service+'AcademicsAPI/getSubjectData',{params:{'courseId':id},headers:{'access_token':$localStorage.access_token}})
                .success(function(subject_data){
                    //console.log(subject_data,'subject_datasubject_data');
                    $scope.subjectList.push(subject_data.message);
                   
                });
            }
           
            $scope.selectize_subject_options = $scope.subjectList;
            $scope.selectize_subject_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Subject',
                valueField: 'SUBJECT_ID',
                labelField: 'SUBJECT_NAME',
                searchField: 'SUBJECT_NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value,'valuevalue');
                       
                    });
                }
            };

            $scope.selectize_clone_config = {
                plugins: {
                    'tooltip': ''
                }
            };
            // Clone functionality
            $scope.form_template = [
                [
                    {
                        'type': 'text',
                        'name': 'firstName',
                        'label': 'First Name'
                    },
                    {
                        'type': 'text',
                        'name': 'lastName',
                        'label': 'Last Name'
                    }
                ],
                [
                    {
                        'type': 'text',
                        'name': 'company',
                        'label': 'Company'
                    }
                ],
                [
                    {
                        'type': 'radio',
                        'label': 'Gender',
                        'name': 'gender',
                        'inputs': [
                            {
                                'label': 'Man',
                                'value': 'man'
                            },
                            {
                                'label': 'Woman',
                                'value': 'woman'
                            }
                        ]
                    },
                    {
                        'type': 'switch',
                        'label': 'Contact',
                        'inputs': [
                            {
                                'label': 'Email',
                                'name': 'switch_email'
                            },
                            {
                                'label': 'Phone',
                                'name': 'switch_phone'
                            }
                        ]
                    }
                ],
                [
                    {
                        'type': 'selectize',
                        'name': 'city',
                        'position': 'bottom',
                        'config': {
                            'valueField': 'value',
                            'labelField': 'title',
                            'placeholder': 'City...'
                        },
                        'data': [
                            {
                                "value": "city_a",
                                "title": "City A"
                            },
                            {
                                "value": "city_b",
                                "title": "City B"
                            },
                            {
                                "value": "city_c",
                                "title": "City C"
                            },
                            {
                                "value": "city_d",
                                "title": "City D"
                            },
                            {
                                "value": "city_e",
                                "title": "City E"
                            }
                        ]
                    },
                    {
                        'type': 'selectize',
                        'name': 'country',
                        'config': {
                            'valueField': 'value',
                            'labelField': 'title',
                            'create': false,
                            'maxItems': 1,
                            'placeholder': 'Country...'
                        },
                        'data': [
                            {
                                "value": "country_a",
                                "title": "Country A"
                            },
                            {
                                "value": "country_b",
                                "title": "Country B"
                            },
                            {
                                "value": "country_c",
                                "title": "Country C"
                            },
                            {
                                "value": "country_d",
                                "title": "Country D"
                            },
                            {
                                "value": "country_e",
                                "title": "Country E"
                            }
                        ]
                    }
                ]
            ];

            $scope.form_dynamic = [];
            $scope.form_dynamic.push($scope.form_template);
            $scope.form_dynamic_model = [];
            // clone section
            $scope.cloneSection = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic.push($scope.form_template);
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
            // $scope.tinymce_content ='<img alt="" src="assets/img/gallery/Image01.jpg" style="float:left; height:173px; margin-right:16px; margin-bottom: 16px; width:260px" />'+
            //     '<h1>Header</h1>'+
            //     'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consequuntur deleniti ducimus, eos fugit, mollitia neque praesentium quia quisquam quos sapiente voluptatem voluptatibus voluptatum. Assumenda consectetur deleniti doloremque fuga harum illum molestiae nisi possimus quidem vero. A accusantium alias aliquam animi cum doloremque eos est facilis illo, illum inventore ipsam itaque laboriosam maiores modi mollitia necessitatibus nemo non omnis perferendis quam quia, repellendus rerum vel veritatis voluptas voluptate? Aliquid asperiores at atque autem beatae consequatur culpa delectus eaque earum error et fugiat incidunt laborum libero molestias natus nobis odit optio, perspiciatis possimus quas saepe sapiente sed sint sit temporibus vel voluptatem. Adipisci alias assumenda dolorum eligendi enim, facilis ipsum iusto perferendis quod ratione repellat reprehenderit suscipit voluptatem. Cumque debitis eum facere facilis fugiat quo repellat sed veniam voluptas voluptate? Adipisci aliquid asperiores culpa laboriosam sint unde velit veritatis vero, voluptatibus? Accusantium aperiam aspernatur assumenda at consectetur consequuntur cupiditate dicta ducimus earum ex exercitationem explicabo fugit id illo inventore iste magnam minima molestiae mollitia nam nihil nobis officiis omnis perspiciatis porro praesentium provident quibusdam quidem quo ratione reiciendis sed sunt tempora tempore ullam, ut veritatis! Ab, aliquid asperiores cum et impedit, labore obcaecati perferendis quae, quas recusandae sint suscipit vitae voluptatem.';

            $scope.tinymce_options = {
                skin_url: 'assets/skins/tinymce/material_design',
                plugins : 'advlist autolink link image lists charmap print preview',
                inline: false,
                menubar:false,
                statusbar: false,
                // plugins: [
                //     "advlist autolink lists link image charmap print preview anchor",
                //     "searchreplace visualblocks code fullscreen",
                //     "insertdatetime media table contextmenu paste"
                // ],
                toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | images",
                //file_picker_callback : elFinderBrowser
            setup: function(editor) {
                    editor.addButton('images', {
                        text:"",
                        icon: "image",
                        onclick: function(e) {
                            if($(e.target).prop("tagName") == 'BUTTON'){
                                console.log($(e.target).parent().parent().find('input').attr('id'));
                                if($(e.target).parent().parent().find('input').attr('id') != 'tinymce-uploader') {
                                    $(e.target).parent().parent().append('<input id="tinymce-uploader" type="file" name="pic" accept="image/*" style="display:none">');
                                }
                                $('#tinymce-uploader').trigger('click');
                                $('#tinymce-uploader').change(function(){
                                    var input, file, fr, img;

                                    if (typeof window.FileReader !== 'function') {
                                        write("The file API isn't supported on this browser yet.");
                                        return;
                                    }

                                    input = document.getElementById('tinymce-uploader');
                                    if (!input) {
                                        write("Um, couldn't find the imgfile element.");
                                    } else if (!input.files) {
                                        write("This browser doesn't seem to support the `files` property of file inputs.");
                                    } else if (!input.files[0]) {
                                        write("Please select a file before clicking 'Load'");
                                    } else {
                                        file = input.files[0];
                                        fr = new FileReader();
                                        fr.onload = createImage;
                                        fr.readAsDataURL(file);
                                    }

                                    function createImage() {
                                        img = new Image();
                                        img.src = fr.result;
                                        editor.insertContent('<img src="'+img.src+'"/>');
                                    }
                                });

                            }
                        }
                    });
                }
            }
            function elFinderBrowser (callback, value, meta) {
                tinymce.activeEditor.windowManager.open({
                    file: '/file_manager/fm_tinymce.html',// use an absolute path!
                    title: 'File Manager',
                    width: 920,
                    height: 440,
                    resizable: 'yes'
                }, {
                    oninsert: function (file, elf) {
                        var url, reg, info;

                        // URL normalization
                        url = file.url;
                        reg = /\/[^/]+?\/\.\.\//;
                        while(url.match(reg)) {
                            url = url.replace(reg, '/');
                        }

                        // Make file info
                        info = file.name + ' (' + elf.formatSize(file.size) + ')';

                        // Provide file and text for the link dialog
                        if (meta.filetype == 'file') {
                            callback(url, {text: info, title: info});
                        }

                        // Provide image and alt text for the image dialog
                        if (meta.filetype == 'image') {
                            callback(url, {alt: info});
                        }

                        // Provide alternative source and posted for the media dialog
                        if (meta.filetype == 'media') {
                            callback(url);
                        }
                    }
                });
                return false;
            }
            // $scope.syllabus=[];
            $scope.saveSyllabusDetails=function(){
                $http({
                    method:'POST',
                    url: $localStorage.service+'AcademicsAPI/syllabusDetail',
                    data: {
                        'syllabus_ID':$scope.syllabus_ID,
                        'course_id' : $scope.courseID,
                        'subject_id' : $scope.subjectID,
                        'syllabus_data' : $scope.syllabus
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    if(return_data.data.status==true){
                        $state.go('restricted.academics.syllabus_view');
                    }else {
                        UIkit.modal.alert('Course & Subject Name Already Exists');
                    }
                });
            }
            // Course js
            $scope.deptData=[];
            var academicsAPI_departmentList = function(){
                $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
                .success(function(dept_data){
                    if(dept_data.status==false){
                        $scope.deptData.push([{ID:-1,NAME:"Add Department"}]);
                    }else{
                        $scope.deptData.push(dept_data.message);
                        $scope.deptData.push([{ID:-1,NAME:"Add Department"}]);
                    }
                });
            }
            academicsAPI_departmentList();
            $scope.selectize_gradingType_options = ['Weighted','UnWeighted'];
            $scope.selectize_gradingType_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Grade'
            };
            $scope.selectize_attdnceType_options = ["Subject-Wise", "Daily"];
            $scope.selectize_attdnceType_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Attendance Type'
            };
            $scope.selectize_deptId_options =$scope.deptData;
            $scope.selectize_deptId_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Department',
                valueField: 'ID',
                sortField: [{field: 'ID', direction: 'desc'}],
                labelField: 'NAME',
                searchField: 'NAME',
                render: {
                    option: function (item, escape) {
                        if(item.ID==-1){
                            return '<div class="option">' +
                                        '<div class="text">' +
                                            '<i class="uk-icon-plus linkClr"></i>' + '<span class="linkClrtxt">' + escape(item.NAME) + '</span>' +
                                       '</div>' +
                                    '</div>';
                        }else{
                            return '<div class="option">' +
                                        '<div class="text">' +
                                            '<span class="name">' + escape(item.NAME) + '</span>' +
                                       '</div>' +
                                    '</div>';
                        }
                       
                    }
                },
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        // alert(value+'depart');
                        if(value == -1){
                            $timeout(function(){
                                $scope.shouldBeOpen = true;    
                            },500);
                            //UIkit.modal("#department_Modal").show();
                            var modal = UIkit.modal("#department_Modal",{bgclose: false, keyboard:false});
                            $('.uk-modal').find('input').trigger('blur');
                            if ( modal.isActive() ) {
                                modal.hide();
                            } else {
                                modal.show();
                            }
                        } 
                    });
                }
            };
            $scope.titCaption="Add";
            $scope.btnStatus='Save';
            $scope.dept_clearData = function() {
                academicsAPI_departmentList();
                $scope.dept_id='';
                $scope.dept_name='';
                $scope.dept_code='';
                $scope.hod_prof_id='';
                $scope.phone_no='';
                $scope.courseID='';
                $scope.subjectID="";
                $scope.course_id="";
                $scope.deptFORM.$setPristine();
                $('.inputName').trigger('blur'); 
            };
             $scope.course_clearData = function(){
                academicsAPI_courseData();
                $scope.course_id='';
                $scope.course_name='';
                $scope.dept_id='';
                $scope.attendance_type='';
                $scope.percentage='';
                $scope.grade_type='';
                $scope.courseID='';
                $scope.subjectID="";
                $('.inputName').trigger('blur'); 
             }
                        
            // Save Data
            $scope.saveCourse=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'AcademicsAPI/courseDetail',
                data: {
                    // 'COURSE_ID' : $scope.course_id,
                    'COURSE_NAME' : $scope.course_name,
                    'COURSE_DEPT_ID' : $scope.dept_id,
                    'COURSE_ATTENDANCE_TYPE' : $scope.attendance_type,
                    'COURSE_PERCENTAGE' : $scope.percentage,
                    'COURSE_GARDE_TYPE' : $scope.grade_type
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.message.message);
                        if(return_data.data.message.status==true){
                        UIkit.modal("#course_modal").hide();
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $scope.course_clearData();
                    }else {
                        // UIkit.notify('Course Name Already Exists','danger');
                        UIkit.modal.alert('Course Name Already Exists');
                    }
                   
                });
            }
            //Department js
            // $scope.addDepartment = function() {
            //     academicsAPI_departmentList();
            //     $scope.titCaption="Add";
            //     $scope.btnStatus="Save";
            //     $scope.dept_id='';
            //     $scope.dept_name='';
            //     $scope.dept_code='';
            //     $scope.hod_prof_id='';
            //     $scope.room_id='';
            //     $scope.phone_no='';
            //     $('.uk-modal').find('input').trigger('blur');
            //      $scope.deptFORM.$setPristine();
            // };
            $scope.empList=[];
            $http.get($localStorage.service+'SettingAPI/employeeList',{headers:{'access_token':$localStorage.access_token}})
            .success(function(return_data){
                $scope.empList.push(return_data.data);
            });
            $scope.selectize_hodProfieId_options =$scope.empList;
            $scope.selectize_hodProfieId_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select HOD',
                valueField: 'PROFILE_ID',
                labelField: 'FULLNAME',
                searchField: 'FULLNAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };
            $scope.saveDeaprtment=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'AcademicsAPI/departmentDetail',
                data: {
                    'DEPT_NAME' : $scope.dept_name,
                    'DEPT_CODE' : $scope.dept_code,
                    'DEPT_ROOM_ID' : $scope.room_id,
                    'DEPT_HOD' : $scope.hod_prof_id,
                    'DEPT_PHONE' : $scope.phone_no
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    if(return_data.data.message.status==true){
                        console.log(return_data.data.message.message);
                        UIkit.modal("#department_Modal").hide();
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $scope.dept_clearData();
                        UIkit.modal("#course_modal").show();
                    }else {
                        UIkit.modal.alert('Department Name Already Exists');
                    }
                });
            }
            // End Department
            // //subject js
            // $scope.sub_clear = function(){
            //     academicsAPI_subjectData();
            //     $scope.subjectID="";
            //     $scope.cou_sub_id='';
            //     $scope.sub_id='';
            //     $scope.subject_name='';
            //     $scope.sub_code='';
            //     $scope.course_id='';
            //     $scope.total_hours='';
            //     $scope.sub_type='';
            // }
            // // $http.get($localStorage.service+'AcademicsAPI/fetchCourseData',{headers:{'access_token':$localStorage.access_token}})
            // //     .success(function(cor_data){
            // //         //console.log(cor_data,'fetchCourseData');
            // //         if(cor_data.status==false){
            // //             $scope.courseData.push([{ID:0, NAME:"Add Course"}]);
            // //         }else{
            // //             $scope.courseData.push(cor_data.data);
            // //             $scope.courseData.push([{ID:0, NAME:"Add Course"}]);
            // //         }
                 
            // //     });
            // // $scope.selectize_courseName_options =$scope.courseData;
            // // $scope.selectize_courseName_config = {
            // //     create: false,
            // //     maxItems: 1,
            // //     placeholder: 'Course',
            // //     valueField: 'ID',
            // //     labelField: 'NAME',
            // //     searchField: 'NAME',
            // //     render: {
            // //         option: function (item, escape) {
            // //             if(item.ID==0){
            // //                 return '<div class="option">' +
            // //                             '<div class="text">' +
            // //                                 '<i class="uk-icon-plus linkClr"></i>' + '<span class="linkClrtxt">' + escape(item.NAME) + '</span>' +
            // //                            '</div>' +
            // //                         '</div>';
            // //             }else{
            // //                  return '<div class="option">' +
            // //                             '<div class="text">' +
            // //                                 '<span class="name">' + escape(item.NAME) + '</span>' +
            // //                            '</div>' +
            // //                         '</div>';
            // //             }
                       
            // //         }
            // //     },
            // //     onInitialize: function(selectize){
            // //         selectize.on('change', function(value) {
            // //             if (value==0 && value!='') {
            // //                 UIkit.modal("#course_modal").show();
            // //             };
            // //         });
            // //     }
            // // };

            // $scope.selectize_subType_options =['Daily','Regular'];
            // $scope.selectize_subType_config = {
            //     create: false,
            //     maxItems: 1,
            //     placeholder: 'Select Type',
            // };
            // $scope.saveSubjectData=function(){
            //     $http({
            //         method:'POST',
            //         url: $localStorage.service+'AcademicsAPI/subjectDetail',
            //         data: {
            //             'cou_sub_id' : $scope.cou_sub_id,
            //             'sub_id' : $scope.sub_id,
            //             'subject_name' : $scope.subject_name,
            //             'sub_code' : $scope.sub_code,
            //             // 'sub_type' : $scope.sub_type,
            //             'course_id' : $scope.course_id,
            //             'total_hours' : $scope.total_hours,
            //             // 'credit_hours' : $scope.credit_hours
            //         },
            //         headers:{'access_token':$localStorage.access_token}
            //     }).then(function(return_data){
            //         console.log(return_data.data.message.message);
            //         if(return_data.data.message.status==true){
            //             UIkit.modal("#subject_modal").hide();
            //             UIkit.notify({
            //                 message : return_data.data.message.message,
            //                 status  : 'success',
            //                 timeout : 2000,
            //                 pos     : 'top-center'
            //             });
            //            $scope.sub_clear();
            //         }else {
            //             UIkit.modal.alert('Course & Subject Name Already Exists');
            //         }
            //     });
            // }
            // // Subject End
        }
    ]);