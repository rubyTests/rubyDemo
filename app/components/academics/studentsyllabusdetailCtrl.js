angular
    .module('altairApp')
    .controller('studentsyllabusdetailCtrl', [
        '$rootScope',
        '$scope',
        '$window',
        'notes_data',
        '$timeout',
        'variables',
        function ($rootScope,$scope,$window,notes_data,$timeout,variables) {
            $rootScope.page_full_height = true;
            $rootScope.headerDoubleHeightActive = true;

            

            $scope.$on('$destroy', function() {
                $rootScope.page_full_height = false;
                $rootScope.headerDoubleHeightActive = false;
            });
            
            // get note data
            $scope.notes_data = notes_data;
            
            $scope.notes_preview=$scope.notes_data[0];
            $scope.change_notes_preview=function(note){
                $scope.notes_preview=note;
            }

            // hide note form
            $scope.noteActive = false;

            // open a note
            $scope.openNote = function($event,$parentIndex,$index,note) {
                $event.preventDefault();
                $scope.notes_preview=note;
                $('.hierarchical_slide').addClass('hierarchical_slide_inView');
                $('.notes_list').children('li').removeClass('md-list-item-active');

                $($event.currentTarget).parent('li').addClass('md-list-item-active');
                // $scope.note_form = {
                //     parentIndex: $parentIndex,
                //     index: $index,
                //     title: note.syllabus_title,
                //     content: note.content
                // };
                $scope.noteActive = true;
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
        }
    ]);