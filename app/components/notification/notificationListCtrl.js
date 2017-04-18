angular
    .module('rubycampusApp')
    .controller('notificationListCtrl', [
        '$rootScope',
        '$scope',
        '$timeout',
        'messages',
        'variables',
        function ($rootScope,$scope,$timeout,messages,variables) {

            // $rootScope.toBarActive = true;

            // $scope.$on('$destroy', function() {
            //     $rootScope.toBarActive = false;
            // });
            
            $scope.messages = messages;

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
        }
    ])
;