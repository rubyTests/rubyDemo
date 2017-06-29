angular
    .module('rubycampusApp')
    .controller('postEditCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$filter',
        '$compile',
        '$location',
        '$stateParams',
        '$state',
        '$localStorage',
        '$http',
        function ($scope,$rootScope,$timeout,$resource,$filter,$compile,$location,$stateParams,$state,$localStorage,$http) {

            $('.dropify').dropify();

            // $('.dropify').dropify({
            //     tpl: {
            //         wrap:            '<div class="dropify-wrapper"></div>',
            //         loader:          '<div class="dropify-loader"></div>',
            //         message:         '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
            //         preview:         '<div class="dropify-preview"><span class="dropify-render"><img src="'+empReturndata[0].CoverImage+'"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
            //         //preview:         '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
            //         filename:        '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
            //         clearButton:     '<button type="button" class="dropify-clear">{{ remove }}</button>',
            //         errorLine:       '<p class="dropify-error">{{ error }}</p>',
            //         errorsContainer: '<div class="dropify-errors-container"><ul></ul></div>'
            //     }
            // });

            $http.get($localStorage.service+'AcademicsAPI/courseDetail',{headers:{'access_token':$localStorage.access_token}})
            .success(function(course_data){
                $scope.selectize_courseId_options=course_data.message;
            });

            $scope.selectize_courseId_options =[];
            $scope.selectize_courseId_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Course',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };

            $scope.CategoryData=[];
            $http({
                method : 'GET',
                url : $localStorage.service+'RepositoryAPI/Rep_Category',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.CategoryData.push(return_data.data.message);
            })

            $scope.selectize_category_options =$scope.CategoryData;
            $scope.selectize_category_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Category',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };


            $scope.rep_data = [];
            $http({
                method:'GET',
                url: $localStorage.service+'RepositoryAPI/Rep_Post',
                params: {
                    'id' : $stateParams.id,
                },
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                console.log(return_data,'return_datareturn_data');
                $scope.rep_data = return_data.data.message[0];
                $scope.rep_id = $scope.rep_data.ID;
                $scope.rep_title = $scope.rep_data.TITLE;
                $scope.rep_content = $scope.rep_data.CONTENT;
                $scope.rep_upload_file = $scope.rep_data.UPLOAD_FILE;
                console.log($scope.rep_upload_file,'$scope.rep_upload_file');
                $timeout(function(){
                    $scope.selectize_category = $scope.rep_data.REP_CATEGORY_ID;
                    $scope.selectize_courseId = $scope.rep_data.COURSE_ID;
                },200);
            });

            $scope.updateRepPostDetails = function(){
                var $fileInput = $('.dropify-preview').find('img').attr('src');
                $http({
                    method : 'POST',
                    url : $localStorage.service+'RepositoryAPI/Rep_Post',
                    data : {
                        'rep_id' : $scope.rep_id,
                        'rep_title' : $scope.rep_title,
                        'rep_upload_file' : $fileInput,
                        'rep_content' : $scope.rep_content,
                        'categoryId' : $scope.selectize_category,
                        'courseId' : $scope.selectize_courseId
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_datareturn_datakkk');
                    if(return_data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $timeout(function(){
                            $state.go('restricted.repository.postView');
                        },200);
                    }else {
                        UIkit.modal.alert('Already Exists');
                    }
                })
            }

            $scope.tinymce_options = {
                skin_url: 'assets/skins/tinymce/material_design',
                plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table contextmenu paste"
                ],
                toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                file_picker_callback : elFinderBrowser
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

            $scope.backBtn=function(){
                window.history.back();
            }
        }
    ]);