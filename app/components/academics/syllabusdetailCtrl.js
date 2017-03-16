angular
    .module('altairApp')
    .controller('syllabusdetailCtrl', [
        '$rootScope',
        '$scope',
        '$window',
        'notes_data',
        '$timeout',
        'variables',
        '$stateParams',
        '$filter',
        '$resource',
        function ($rootScope,$scope,$window,notes_data,$timeout,variables,$stateParams,$filter,$resource) {

            $scope.deptArray=[];
            $scope.courseArray=[];
            $scope.subjectArray=[];

            var paramsData=$filter('filter')(notes_data, {id : $stateParams.syllabus_id});
            // $scope.user_data = paramsData[0];

            $rootScope.page_full_height = true;
            $rootScope.headerDoubleHeightActive = true;

            $scope.$on('$destroy', function() {
                $rootScope.page_full_height = false;
                $rootScope.headerDoubleHeightActive = false;
            });
            
            // get note data
            $scope.notes_data = paramsData;

            // hide note form
            $scope.noteActive = false;


            // open a note
            $scope.openNote = function($event,$parentIndex,$index,note) {
                $event.preventDefault();

                $scope.noteActive = true;

                $('.notes_list').children('li').removeClass('md-list-item-active');

                $($event.currentTarget).parent('li').addClass('md-list-item-active');

                $scope.note_form = {
                    parentIndex: $parentIndex,
                    index: $index,
                    id: note.id,
                    title: note.title,
                    content: note.content
                };

                angular.element($window).resize();
            };

            // create a note
            $scope.newNote = function($event,note) {
                $event.preventDefault();
                $scope.noteActive = true;

                $scope.note_form = {
                    id: '123',
                    title: '',
                    content: ''
                };

                angular.element($window).resize();
            };

            // save note
            $scope.saveNote = function($event) {
                $event.preventDefault();

                // get variables from active note
                var parentIndex = $scope.note_form.parentIndex,
                    index = $scope.note_form.index,
                    title = $scope.note_form.title;
                    content = $scope.note_form.content;

                if(parentIndex && index) {
                    // update main data
                    $scope.notes_data[parentIndex].notes[index] = {
                        title: title,
                        content: content,
                        date: moment().format("ddd DD.MM.YYYY")
                    };
                }

                var data = JSON.stringify($scope.note_form, null, 2);
                UIkit.modal.alert('<p>Note data:</p><pre>' + data + '</pre>');

                angular.element($window).resize();
            }


            // Help Notes
            $rootScope.page_full_height = true;
            $rootScope.headerDoubleHeightActive = true;

            $scope.$on('$destroy', function() {
                $rootScope.page_full_height = false;
                $rootScope.headerDoubleHeightActive = false;
            });
            
            // $scope.help_data = help_data;

            var $toggleAll_btn = $('#toggleAll'),
                $help_accordion = $('.help_accordion');

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                UIkit.accordion($help_accordion, {
                    collapse: false,
                    showfirst: false
                });
            });

            $scope.toggleAll = function($event) {
                $event.preventDefault();
                $toggleAll_btn.velocity("transition.expandOut", {
                    duration: 280,
                    easing: variables.easing_swiftOut,
                    begin: function() {
                        if(!$help_accordion.hasClass('all_expanded')) {
                            $help_accordion.addClass('all_expanded').find('.uk-accordion-title').not('.uk-active').each(function() {
                                var $this = $(this);
                                $timeout(function() {
                                    $this.click()
                                },10);
                            });
                        } else {
                            $help_accordion.removeClass('all_expanded').find('.uk-accordion-title.uk-active').each(function() {
                                var $this = $(this);
                                $timeout(function() {
                                    $this.click()
                                },10);
                            });
                        }
                    },
                    complete: function() {
                        $toggleAll_btn.velocity("transition.expandIn", {
                            duration: 280,
                            easing: variables.easing_swiftOut,
                            begin: function() {
                                if(!$help_accordion.hasClass('all_expanded')) {
                                    $toggleAll_btn.html('&#xe8f2;');
                                } else {
                                    $toggleAll_btn.html('&#xe8ee;');
                                }
                            }
                        })
                    }
                });
            };

                $resource('app/components/academics/department.json')
                .query()
                .$promise
                .then(function(return_data) {
                    $scope.deptArray.push(return_data);
                });

                $resource('app/components/academics/course.json')
                .query()
                .$promise
                .then(function(return_data) {
                    $scope.course_data=return_data;
                });

                $resource('app/components/academics/subject.json')
                .query()
                .$promise
                .then(function(return_data) {
                    $scope.subject_data=return_data;
                });

                $resource('app/components/academics/syllabus.json')
                .query()
                .$promise
                .then(function(return_data) {
                    $scope.syllabus_data=return_data;
                });

             // Dropdow Filter for course
            $scope.selectize_dept_data = $scope.deptArray;
            $scope.selectize_dept_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department...',
                valueField: 'id',
                labelField: 'dept_name',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $scope.courseArray=[];
                        var dept_data=$filter('filter')($scope.course_data, {dept_id : value});
                        $scope.courseArray.push(dept_data);
                        $scope.selectize_course_data = $scope.courseArray;
                        $timeout(function() {
                            $('#page_content_inner').trigger('click');
                        }, 200);
                    });
                }
            };

            $scope.selectize_course_data = $scope.courseArray;
                $scope.selectize_course_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Course...',
                    valueField: 'id',
                    labelField: 'course_name',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            console.log(value,'value');
                            if(value==''){
                                $scope.selectize_subject_data = [];
                            }else {
                                $scope.subjectArray=[];
                                var subData=$filter('filter')($scope.subject_data, {course_id : value});
                                $scope.subjectArray.push(subData);
                                $scope.selectize_subject_data = $scope.subjectArray;
                            }
                            $timeout(function() {
                                $('#page_content_inner').trigger('click');
                            }, 200);
                        });
                    }
                };
            
             // Dropdow Filter for Subject
             console.log($scope.subjectArray,'ssssssssssss');
            $scope.selectize_subject_data = $scope.subjectArray;
            $scope.selectize_subject_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Subject...',
                valueField: 'id',
                labelField: 'subject_name',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        if(value==''){
                            console.log('empty');
                        }else {
                            var syllabusReturndata=$filter('filter')($scope.syllabus_data, {sub_id : value});
                            $scope.notes_data = syllabusReturndata;
                        }
                        $timeout(function() {
                            $('#page_content_inner').trigger('click');
                        }, 200);

                    });
                }
            };
        }
    ]);