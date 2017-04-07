angular
    .module('rubycampusApp')
    .controller('mailsCtrl', [
        '$rootScope',
        '$scope',
        '$timeout',
        'messages',
        'variables',
        '$stateParams',
        '$filter',
        function ($rootScope,$scope,$timeout,messages,variables,$stateParams,$filter) {

            $scope.EditData = [];

            $scope.fold=$stateParams.fold || "";

            $rootScope.toBarActive = true;

            $scope.$on('$destroy', function() {
                $rootScope.toBarActive = false;
            });

            $scope.messages = messages;

            var paramsData=$filter('filter')(messages, {id : $stateParams.mailId});
            $scope.EditData.push(paramsData[0]);

            var $mailbox = $('#mailbox');

            // select message
            $mailbox
                .on('ifChanged', '.select_message', function() {
                    $(this).is(':checked') ? $(this).closest('li').addClass('md-card-list-item-selected') : $(this).closest('li').removeClass('md-card-list-item-selected');
            });

            // select all messages
            $('#mailbox_select_all').on('ifChanged',function() {
                var $this = $(this);
                $mailbox.find('.select_message').each(function() {
                    $this.is(':checked') ? $(this).iCheck('check') : $(this).iCheck('uncheck');
                })
            });

            // file upload (new message)
            $timeout(function() {
                var progressbar = $("#mail_progressbar"),
                    bar         = progressbar.find('.uk-progress-bar'),
                    settings    = {
                        action: './upload/', // upload url
                        single: false,
                        loadstart: function() {
                            bar.css("width", "0%").text("0%");
                            progressbar.removeClass("uk-hidden uk-progress-danger");
                        },
                        progress: function(percent) {
                            percent = Math.ceil(percent);
                            bar.css("width", percent+"%").text(percent+"%");
                            if(percent == '100') {
                                setTimeout(function(){
                                    progressbar.addClass("uk-hidden");
                                }, 1500);
                            }
                        },
                        error: function(event) {
                            progressbar.addClass("uk-progress-danger");
                            bar.css({'width':'100%'}).text('100%');
                        },
                        abort: function(event) {
                            console.log(event);
                        },
                        complete: function(response, xhr) {
                            console.log(response);
                        }
                    };

                var select = UIkit.uploadSelect($("#mail_upload-select"), settings),
                    drop   = UIkit.uploadDrop($("#mail_upload-drop"), settings);
            })

            $scope.folds = [
                {name: 'Inbox', filter:''},
                {name: 'Sent', filter:'sent'},
                {name: 'Trash', filter:'trash'}
            ];

            //$scope.fold = 'Inbox';
        }
    ]);

// angular
//     .module('rubycampusApp')
//     .controller('mailDetailsCtrl', [
//         '$rootScope',
//         '$scope',
//         '$timeout',
//         'messages',
//         'variables',
//         function ($rootScope,$scope,$timeout,messages,variables) {

//         }
// ]);