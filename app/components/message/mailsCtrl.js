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
        '$http',
        '$localStorage',
        '$state',
        'getMessageList',
        function ($rootScope,$scope,$timeout,messages,variables,$stateParams,$filter,$http,$localStorage,$state, getMessageList) {
            // $scope.msgVal=[];
            console.log($stateParams.mailId,"$stateParams");
            $scope.userProfile_id = $localStorage.userProfile_id;
            getMessageList.getMessage()
            .then(function(response){
                $scope.messageList = response.data.message;
                console.log(response.data.message,"getMessageList");
                var data=$filter('filter')(response.data.message, {C_ID : $stateParams.mailId});
                console.log(data[0],"getMessageList");
                // $scope.getVal(data[0]);
                if (data.length != 0) {
                    // var data1=$filter('filter')(response.data.message, {TO_ID : $scope.userProfile_id}, true);
                    // var data1 =$filter('filter')(response.data.message,function(value){
                    //     return value.TO_ID==$scope.userProfile_id || value.FROM_ID==$scope.userProfile_id;
                    // });
                    $scope.getVal(data[0]);    
                }                
                console.log($scope.msgVal,"getMessageList1111");
            });            
            $scope.EditData = [];

            $scope.fold=$stateParams.fold || "";

            // $rootScope.toBarActive = true;

            // $scope.$on('$destroy', function() {
            //     $rootScope.toBarActive = false;
            // });

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
                        action: './assets/uploads/', // upload url
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

                    console.log(select,'select');
            })

            $scope.folds = [
                {name: 'Inbox', filter:''},
                {name: 'Sent', filter:'sent'},
                {name: 'Trash', filter:'trash'}
            ];

            //$scope.fold = 'Inbox';
            $scope.btnVal = "Inbox";
            $scope.functionThree = function(val){
                if(val == "Sent"){
                    $scope.btnVal = "Sent";
                }else if(val == "Trash"){
                    $scope.btnVal = "Trash";
                }else{
                    $scope.btnVal = "Inbox";
                }
            }

            $scope.items=[];
            $http({
                method:'GET',
                url: $localStorage.service+'messageAPI/profileData',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                console.log(return_data,'return_data');
                $scope.items.push(return_data.data.message);

                angular.forEach($scope.items[0], function(values, keys){
                    values.value=values.FIRSTNAME+" - "+values.LASTNAME;
                });

                UIkit.on('domready.uk.dom', function(){
                    UIkit.autocomplete($('#autocomplete'), {
                      source: $scope.items[0],
                      minLength:1,
                      flipDropdown:true
                    }).on('selectitem.uk.autocomplete', function (e, data, ac) {
                        $scope.message_compose.profileId = data.id;

                    });
                });
            });

            $scope.message_compose = {};
            $scope.composeMsg = function(value){
                console.log(value,"valuevalue");
                $http({
                    method : 'POST',
                    url : $localStorage.service+'messageAPI/composeMsg',
                    data : {
                        'recipient' : value.profileId,
                        'subject' : value.subject,
                        'message' : value.message,
                        'profile_id' : value.profileId,
                        'from_id':$scope.userProfile_id
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_data');
                    if(return_data.data.status==true){
                        UIkit.modal("#mailbox_new_message").hide();
                        UIkit.notify({
                            message : return_data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        getMessageList.getMessage()
                        .then(function(response){
                            $scope.messageList = response.data.message;
                        });
                    }else {
                        UIkit.modal.alert('Already Exists');
                    }
                })
            }

            $scope.sendMessage = function($event,arrVal){
                var code = $event.keyCode || $event.which;
                var inptVal = $scope.message;
                $scope.msgVal.messages.push({
                    'MESSAGE': inptVal,
                    'CRT_USER_ID':$scope.userProfile_id
                });

                $scope.replyMsg();

                if (code == 1 || code == 13 && inptVal != '') {
                    var $chatbox = $($event.target).closest('.chat_box_wrapper'),
                    $chatbox_content = $chatbox.find('.chat_box');
                }

            }

            $scope.replyMsg = function(){
                // console.log($scope.msgVal,"sendMessage");
                var to_id =  ($scope.msgVal.FROM_ID == $scope.userProfile_id)? $scope.msgVal.TO_ID:$scope.msgVal.FROM_ID;
                // console.log({
                //         'recipient' : to_id,
                //         'message' : $scope.message,
                //         'msg_con_id' : $scope.msgVal.ID,
                //         'from_id': $scope.userProfile_id
                //     });
                $http({
                    method : 'POST',
                    url : $localStorage.service+'messageAPI/replyMsg',
                    data : {
                        'recipient' : to_id,
                        'message' : $scope.message,
                        'msg_con_id' : $scope.msgVal.ID,
                        'from_id': $scope.userProfile_id,
                        'reply_id': $scope.msgVal.C_ID
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_data');
                    $scope.message = "";
                    if(return_data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                    }else {
                        UIkit.modal.alert('Already Exists');
                    }
                })
            }

            $scope.msgDetail=[];
            $http({
                method:'GET',
                url: $localStorage.service+'messageAPI/messageDetailById',
                params : { id : $stateParams.mailId, profile_id : $localStorage.userProfile_id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.msgDetail = return_data.data.message[0];
                $scope.msgDetailView = $scope.msgDetail.MESSAGE;
                $scope.msgFNAME = return_data.data.message[0].FNAME;
                console.log($scope.msgDetail,'$scope.msgDetail');
            });

            // $scope.messageList=[];
            // $http({
            //     method:'GET',
            //     url: $localStorage.service+'messageAPI/messageHeaderList',
            //     params : { id : $localStorage.userProfile_id},
            //     headers:{'access_token':$localStorage.access_token}
            // }).then(function(return_data){
            //     console.log(return_data,'returnss_data');
            //     $scope.messageList = return_data.data.message;
            //     $scope.msgList = $scope.messageList.MESSAGE;
            // });

            $scope.getVal = function(value){
                // console.log(value,'valuevaluevaluevalue');
                // var index = $scope.messageList.indexOf(value);
                $scope.msgVal = value;
                if (value.messages[0].CRT_USER_ID != $scope.userProfile_id){
                    value.STATUS = "SEEN";
                    $scope.updateStatus(value);
                }                 
            }
            $scope.removeChat = function(value){
                value.STATUS = "RMD";
                $scope.updateStatus(value);
            }
            $scope.updateStatus = function(value){
                    var index = $scope.messageList.indexOf(value);
                    $http({
                        method:'POST',
                        url: $localStorage.service+'messageAPI/updateMessageStatus',
                        data : { C_ID : value.C_ID, MESSAGE_ID : value.MESSAGE_ID, STATUS:value.STATUS},
                        headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        angular.forEach($scope.messageList[index].messages, function(value1, keys){
                            $scope.messageList[index].messages[keys].STATUS = value.STATUS;
                        });                        
                    });
            }

            $rootScope.page_full_height = true;
            $rootScope.headerDoubleHeightActive = true;

            $scope.$on('$destroy', function() {
                $rootScope.page_full_height = false;
                $rootScope.headerDoubleHeightActive = false;
            });
            
            $scope.chat_users = [
                {
                    "id": 0,
                    "name": "Lue Feest",
                    "description": "Lorem ipsum dolor sit amet.",
                    "avatar": "assets/img/avatars/avatar_11_tn.png",
                    "status": "online"

                },
                {
                    "id": 1,
                    "name": "Roosevelt Stoltenberg",
                    "description": "Lorem ipsum dolor sit amet.",
                    "avatar": "assets/img/avatars/avatar_03_tn.png",
                    "status": "online"

                },
                {
                    "id": 2,
                    "name": "Casimer Smitham",
                    "description": "Et quis eligendi ex.",
                    "avatar": "assets/img/avatars/avatar_05_tn.png",
                    "status": "afk"
                },
                {
                    "id": 3,
                    "name": "Katarina Fadel",
                    "description": "Facere laboriosam molestiae doloribus culpa.",
                    "avatar": "assets/img/avatars/avatar_08_tn.png",
                    "status": "online"
                },
                {
                    "id": 4,
                    "name": "Caterina Homenick",
                    "description": "Corporis doloribus aut voluptate ut aut.",
                    "avatar": "assets/img/avatars/avatar_06_tn.png",
                    "status": "offline"
                },
                {
                    "id": 5,
                    "name": "Mark Leffler",
                    "description": "Nihil et ea.",
                    "avatar": "assets/img/avatars/avatar_07_tn.png",
                    "status": "online"
                }
            ];

            $scope.chat_messages = [
                {
                    "user_id": 0,
                    "content": [
                        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio, eum?",
                        "Lorem ipsum dolor sit amet."
                    ],
                    "date": "13:38"
                },
                {
                    "user_id": 1,
                    "content": [
                        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus distinctio dolor earum est hic id impedit ipsum minima mollitia natus nulla perspiciatis quae quasi, quis recusandae, saepe, sunt totam."
                    ],
                    "date": "13:34"
                },
                {
                    "user_id": 0,
                    "content": [
                        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ea mollitia pariatur porro quae sed sequi sint tenetur ut veritatis."
                    ],
                    "date": "23 JUN 1:10AM"
                },
                {
                    "user_id": 1,
                    "content": [
                        "Lorem ipsum dolor sit amet, consectetur.",
                        "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
                    ],
                    "date": "FRIDAY 13:34"
                }
            ];

            // colors
            $scope.chat_colors = 'chat_box_colors_a';

            $scope.changeColor = function($event,colors) {
                $event.preventDefault();
                $scope.chat_colors = colors;
                $($event.currentTarget)
                    .closest('li').addClass('uk-active')
                    .siblings('li').removeClass('uk-active');
            };

            // scroll to last message
            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $timeout(function() {
                    var chatScroll = $(element).closest('.scrollbar-inner'),
                        totalHeight = 0;

                    chatScroll.children().each(function(){
                        totalHeight = totalHeight + $(this).outerHeight(true);
                    });

                    chatScroll.scrollTop(totalHeight);
                })
            });
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