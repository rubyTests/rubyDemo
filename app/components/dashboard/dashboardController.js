angular
    .module('rubycampusApp')
    .controller('dashboardCtrl', [
        '$rootScope',
        '$scope',
        '$interval',
        '$window',
        '$timeout',
        'user_data',
        'sale_chart_data',
        'variables',
        '$http',
        '$localStorage',
        function ($rootScope,$scope,$interval,$window,$timeout,user_data,sale_chart_data,variables, $http, $localStorage) {
			$scope.todo_data=[];
        // circular statistics
            $scope.stat_conversions_data = [5,3,9,6,5,9,7];
            $scope.stat_conversions_options = {
                height: 64,
                width: 96,
                fill: ["#d84315"],
                padding: 0.2
            };

            $scope.epc_user_messages = {
                barColor:'#03a9f4',
                scaleColor: false,
                trackColor: '#f5f5f5',
                lineWidth: 5,
                size: 110,
                easing: variables.bez_easing_swiftOut
            };

            $scope.epc_tasks_list = {
                barColor:'#9c27b0',
                scaleColor: false,
                trackColor: '#f5f5f5',
                lineWidth: 5,
                size: 110,
                easing: variables.bez_easing_swiftOut
            };

            $scope.epc_orders = {
                barColor:'#009688',
                scaleColor: false,
                trackColor: '#f5f5f5',
                lineWidth: 5,
                size: 110,
                easing: variables.bez_easing_swiftOut
            };

            $scope.epc_user_registrations = {
                barColor:'#607d8b',
                scaleColor: false,
                trackColor: '#f5f5f5',
                lineWidth: 5,
                size: 110,
                easing: variables.bez_easing_swiftOut
            };

        // statistics
            $scope.dynamicStats = [
                {
                    id: '1',
                    title: 'Student',
                    count: '0',
                    chart_data: [ 5,3,9,6,5,9,7 ],
                    chart_options: {
                        height: 28,
                        width: 48,
                        fill: ["#d84315"],
                        padding: 0.2
                    }
                },
                {
                    id: '2',
                    title: 'Employees',
                    count: '0',
                    chart_data: [ 5,3,9,6,5,9,7,3,5,2 ],
                    chart_options: {
                        height: 28,
                        width: 64,
                        fill: "#d1e4f6",
                        stroke: "#0288d1"
                    }
                },
                {
                    id: '3',
                    title: 'Courses',
                    count: '0',
                    chart_data: [ '64/100' ],
                    chart_options: {
                        height: 24,
                        width: 24,
                        fill: ["#8bc34a", "#eee"]
                    }
                },
                {
                    id: '4',
                    title: 'Admission',
                    count: '1',
                    chart_data: [ 5,3,9,6,5,9,7,3,5,2,5,3,9,6,5,9,7,3,5,2 ],
                    chart_options: {
                        height: 28,
                        width: 64,
                        fill: "#efebe9",
                        stroke: "#5d4037"
                    }
                }
            ];

        // countUp update
            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                
				$http({
				method:'get',
				url: $localStorage.service+'DashboardAPI/adminDashboard',
				headers:{'access_token':$localStorage.access_token}
				}).then(function(return_data){
					// console.log(return_data.data.message.studentCount[0].stuCount,"msg");
					$scope.dynamicStats[0].count = return_data.data.message.studentCount[0].stuCount;
					$scope.dynamicStats[1].count = return_data.data.message.employeeCount[0].empCount;
					$scope.dynamicStats[2].count = return_data.data.message.courseCount[0].courseCount;
					$scope.dynamicStats[3].count = return_data.data.message.admissionCount[0].admission;
				});
				
				// $scope.dynamicStats[0].count = '1500';
                // $scope.dynamicStats[1].count = '85';
                // $scope.dynamicStats[2].count = '10';
                // $scope.dynamicStats[3].count = '1501';

                // update live statistics
                // function getRandomVal(min, max) {
                //     return Math.floor(Math.random() * (max - min + 1)) + min;
                // }

                // $interval(function () {
                //     var random = Math.round(Math.random() * 10);
                //     var live_values = $scope.dynamicStats[3].chart_data.toString().split(",");

                //     live_values.shift();
                //     live_values.push(random);
                //     live_values.join(",");

                //     var countTo = getRandomVal(20, 100);

                //     $scope.dynamicStats[3].chart_data = live_values;
                //     $scope.dynamicStats[3].count = ($scope.dynamicStats[3].count == countTo) ? countTo : getRandomVal(20, 120);

                // }, 2000)
            });

       

        // calendar
            var $clndr_events = $('#clndr_events'),
                animate_change = function() {
                    $clndr_events
                        .removeClass('events_visible')
                        .children('.clndr')
                        .addClass('animated_change');

                    $timeout(function() {
                        $clndr_events
                            .children('.clndr')
                            .removeClass('animated_change');
                    },380);
                };

            $scope.clndr_events = [
                { date: moment().startOf('month').add(7, 'days'), title: 'Doctor appointment', url: 'javascript:void(0)', timeStart: '10:00', timeEnd: '11:00' },
                { date: moment().startOf('month').add(8, 'days'), title: 'John\'s Birthday', url: 'javascript:void(0)' },
                { date: moment().startOf('month').add(8, 'days'), title: 'Party', url: 'javascript:void(0)', timeStart: '08:00', timeEnd: '08:30' },
                { date: moment().startOf('month').add(12, 'days'), title: 'Meeting', url: 'javascript:void(0)', timeStart: '18:00', timeEnd: '18:20' },
                { date: moment().startOf('month').add(17, 'days'), title: 'Work Out', url: 'javascript:void(0)', timeStart: '07:00', timeEnd: '08:00' },
                { date: moment().startOf('month').add(17, 'days'), title: 'Business Meeting', url: 'javascript:void(0)', timeStart: '11:10', timeEnd: '11:45' },
                { date: moment().startOf('month').add(22, 'days'), title: 'Meeting', url: 'javascript:void(0)', timeStart: '20:25', timeEnd: '20:50' },
                { date: moment().startOf('month').add(25, 'days'), title: 'Haircut', url: 'javascript:void(0)' },
                { date: moment().startOf('month').add(25, 'days'), title: 'Lunch with Katy', url: 'javascript:void(0)', timeStart: '08:45', timeEnd: '09:45' },
                { date: moment().startOf('month').add(25, 'days'), title: 'Concept review', url: 'javascript:void(0)', timeStart: '15:00', timeEnd: '16:00' },
                { date: moment().startOf('month').add(26, 'days'), title: 'Swimming Poll', url: 'javascript:void(0)', timeStart: '13:50', timeEnd: '14:20' },
                { date: moment().startOf('month').add(28, 'days'), title: 'Team Meeting', url: 'javascript:void(0)', timeStart: '17:25', timeEnd: '18:15' },
                { date: moment().add(1, 'months').startOf('month').add(1, 'days'), title: 'Dinner with John', url: 'javascript:void(0)', timeStart: '16:25', timeEnd: '18:45' },
                { date: moment().add(1, 'months').startOf('month').add(12, 'days'), title: 'Business Meeting', url: 'javascript:void(0)', timeStart: '10:00', timeEnd: '11:00' }
            ];

            var daysOfTheWeek = [];
            for (var i = 0; i < 7; i++) {
                daysOfTheWeek.push(moment().weekday(i).format('dd'));
            }
            $scope.clndr_options = {
                weekOffset: 1, // Monday
                daysOfTheWeek: daysOfTheWeek
            };

            // next month
            $scope.clndr_next_month = function() {
                animate_change();
                $timeout(function() {
                    $scope.clndr.forward();
                },280);
            };

            // previous month
            $scope.clndr_prev_month = function() {
                animate_change();
                $timeout(function() {
                    $scope.clndr.back();
                },280);
            };

            $scope.clndr_today = function() {
                animate_change();
                $timeout(function() {
                    $scope.clndr
                        .setYear(moment().format('YYYY'))
                        .setMonth(moment().format('M') - 1);
                },280);
            };

            // show events panel
            $scope.showEvents = function($event,day) {
                $event.preventDefault();
                var $this = $($event.currentTarget);

                if(day.events.length && !$this.hasClass('day-active')) {

                    var delay = !$clndr_events.hasClass('events_visible') ? 280 : 0;

                    $clndr_events.addClass('events_visible');

                    $scope.clndrWidth();

                    $scope.selectedDay = function(event){
                        return (moment(day.date).format('M-D-YYYY') == moment(event.date).format('M-D-YYYY'))
                    };

                    $timeout(function() {
                        $('.clndr_events')
                            .children('.clndr_event')
                            .velocity("transition.slideUpIn", {
                                stagger: 100,
                                drag: true
                            })
                    },delay);

                    $this
                        .siblings('.day').removeClass('day-active')
                        .end()
                        .addClass('day-active');

                }
            };

            // close events panel
            $scope.closeEvents = function() {
                $clndr_events.removeClass('events_visible events_over')
            };

            // add event modal
            $scope.event_modal = UIkit.modal("#modal_clndr_new_event", {
                target: '#modal_clndr_new_event'
            });
            $scope.addEventForm = function($event) {
                if ( $scope.event_modal.isActive() ) {
                    event_modal.hide();
                } else {
                    $scope.event_modal.show();
                    // hide events panel
                    $clndr_events.removeClass('events_visible');
                }
            };

            $scope.newEvent = [];

            $scope.addEvent = function($event) {
                var e_title = '#clndr_event_title_control',
                    e_link = '#clndr_event_link_control',
                    e_date = '#clndr_event_date_control',
                    e_start = '#clndr_event_start_control',
                    e_end = '#clndr_event_end_control';

                if(!$scope.newEvent.title) {
                    $(e_title)
                        .addClass('md-input-danger')
                        .focus()
                        .change();
                    return false;
                }

                if(!$scope.newEvent.date) {
                    $(e_date)
                        .addClass('md-input-danger')
                        .focus()
                        .change();
                    return false;
                }

                var new_event = [
                    { date: $(e_date).val(), title: $(e_title).val(), url: $(e_link).val() ? $(e_link).val() : 'javascript:void(0)', timeStart: $(e_start).val(), timeEnd: $(e_end).val() }
                ];

                $scope.clndr_events.push(new_event[0]);

                $scope.clndr.addEvents(new_event);
                $scope.clndr.setMonth(moment($(e_date).val()).format('M') - 1);

                // hide modal
                $scope.event_modal.hide();

                $(e_title+','+e_link+','+e_date+','+e_start+','+e_end)
                    .removeClass('md-input-danger')
                    .val('')
                    .change();
            };

            $scope.clndrWidth = function() {

                var dayWidth = $clndr_events.find('.day > span').outerWidth(),
                calMinWidth = dayWidth * 7 + 240 + 32 + 14;

                ($clndr_events.width() < (calMinWidth)) ? $clndr_events.addClass('events_over') : $clndr_events.removeClass('events_over');
            };

            // timeline
            $scope.user_data = user_data[0];

            // secondary sidebar
            $scope.sSidebar = {
                site_online: true,
                top_bar: true,
                minify_assets: true
            };

            $scope.sSidebar_users = [
                {
                    name: 'Catalina Weber',
                    avatar: 'avatar_02'
                },
                {
                    name: 'Jayme Hermiston',
                    avatar: 'avatar_03'
                },
                {
                    name: 'Enid Roob',
                    avatar: 'avatar_06'
                },
                {
                    name: 'Lelah Leffler',
                    avatar: 'avatar_04'
                }
            ];


            var c3chart_spline_id = 'c3_chart_spline';

            if ( $('#'+c3chart_spline_id).length ) {

                var c3chart_spline = c3.generate({
                    bindto: '#'+c3chart_spline_id,
                    data: {
                        columns: [
                            ['Student', 30, 200, 100, 400, 150, 250],
                            ['Employee', 130, 100, 140, 200, 150, 50]
                        ],
                        type: 'spline'
                    },
                    color: {
                        pattern: ['#5E35B1', '#FB8C00']
                    }
                });

                $($window).on('debouncedresize', c3chart_spline.resize());

                $scope.$on('$destroy', function () {
                    $($window).off('debouncedresize', c3chart_spline.resize());
                    c3chart_spline.destroy();
                });

            }

            $scope.messageData_data = {
                name: "Lue Feest",
                avatar: "assets/img/avatars/avatar_11_tn.png",
                messages: [
                    {
                        "title": "Manikandan",
                        "content": "In adipisci amet nostrum natus recusandae animi fugit consequatur.",
                        "sender": "Korbin Doyle",
                        "color": "cyan",
                        "avatar": "http://h5ckfun.info/wp-content/uploads/2015/07/MyAvatar.png"
                    },
                    {
                        "title": "Rafeeq",
                        "content": "Voluptate aut quis rerum laborum expedita qui eaque doloremque a corporis.",
                        "sender": "Alia Walter",
                        "color": "indigo",
                        "avatar": "https://pickaface.net/gallery/avatar/Opi51c74dfa1fef6.png"
                    },
                    {
                        "title": "John",
                        "content": "Fugiat rerum aperiam et deleniti fugiat corporis incidunt aut enim et distinctio.",
                        "sender": "William Block",
                        "color": "light-green",
                        "avatar": "http://www.mubbiqureshi.com/mubbi-theme/img/avatar.jpg"
                    }
                ],
                birthday: [
                    {
                        "name": "ManiVannan",
                        "dob": "19 years old",
                        "avatar": "http://www.avatars24.de/img/avatars/avatar-5.jpg"
                    },
                    {
                        "name": "karthik",
                        "dob": "24 years old",
                        "avatar": "https://pickaface.net/gallery/avatar/Opi51c74dfa1fef6.png"
                    },
                    {
                        "name": "vijay",
                        "dob": "23 years old",
                        "avatar": "https://www.tm-town.com/assets/default_male600x600-79218392a28f78af249216e097aaf683.png"
                    },
                    {
                        "name": "Senthil",
                        "dob": "25 years old",
                        "avatar": "http://www.mubbiqureshi.com/mubbi-theme/img/avatar.jpg"
                    },
                    {
                        "name": "Mani",
                        "dob": "25 year old",
                        "avatar": "http://h5ckfun.info/wp-content/uploads/2015/07/MyAvatar.png"
                    }
                ]
            };

            //todo list added by senthil

			$scope.getTodolist=function(){
				$http({
				method:'get',
				url: $localStorage.service+'DashboardAPI/todoList',
				params:{profileId:$localStorage.userProfile_id,role_id:$localStorage.role_id},
				headers:{'access_token':$localStorage.access_token}
				}).then(function(return_data){
					//console.log(return_data.data.message,"msg");
					$scope.todo_data = return_data.data.message;
					angular.forEach($scope.todo_data,function(value,key){
						if(value.IMPORTANT=='ture'){
							$scope.todo_data[key].IMPORTANT=true;
						}else{
							$scope.todo_data[key].IMPORTANT=false;
						}
						
						if(value.CLOSED=='true'){
							$scope.todo_data[key].CLOSED=true;
						}else{
							$scope.todo_data[key].CLOSED=false;
						}
					})
					$scope.todo_length = $scope.todo_data.length;
				});
			}
			$scope.getTodolist();
            // $scope.todo_data = todo_data;
            // //console.log($scope.todo_data);
            // $scope.todo_length = $scope.todo_data.length;

            // add todo list modal
            $scope.todolist_modal = UIkit.modal("#new_todolist", {
                target: '#new_todolist'
            });
            $scope.addTodoForm = function($event) {
                if ( $scope.todolist_modal.isActive() ) {
                    todolist_modal.hide();
                } else {
                    $scope.todolist_modal.show();
                    $scope.todoTitle = null;
                    $scope.todoDate = null;
					$scope.todoDesc = null;
					$scope.important = null;
                    // hide events panel
                    // $clndr_todolist.removeClass('events_visible');
                }
            };

            
            $scope.addTodo = function($event){
                
				// var todoDataVal = {
                    // TITLE: $scope.todoTitle,
                    // DESCRIPTION: $scope.todoDesc,
                    // DATE: $scope.todoDate,
                    // CLOSED: false,
                    // IMPORTANT: $scope.important
                // }
				// console.log(todo_data,'todo_data');
                // todo_data.push(todoDataVal);
				
				if($scope.important==1){
					$scope.important='true';
				}else{
					$scope.important='false';
				}
				
				$http({
				method:'POST',
				url: $localStorage.service+'DashboardAPI/todoList',
				data: {title: $scope.todoTitle,description: $scope.todoDesc,date: $scope.todoDate,important: $scope.important,profileId:$localStorage.userProfile_id,role_id:$localStorage.role_id},
				headers:{'Content-Type':'application/json; charset=UTF-8','access_token':$localStorage.access_token}
				}).then(function(response){
					if(response.data.status==true){
						$scope.getTodolist();
						UIkit.notify({
							message : response.data.message,
							status  : 'success',
							timeout : 2000,
							pos     : 'top-center'
						});
						$scope.todoTitle = null;
						$scope.todoDate = null;
						$scope.todoDesc = null;
						$scope.important = null;
					}
				});
				
                $scope.todolist_modal.hide();
            }

            $scope.removeTodo = function(index,id){
                //console.log($scope.todo_data);
                $scope.todo_data.splice(index,1);
				$http({
				method:'delete',
				url: $localStorage.service+'DashboardAPI/todoList',
				headers:{'access_token':$localStorage.access_token},
				params:{id:id}
				}).then(function(return_data){
					//console.log(return_data.data.message,"msg");
					$scope.getTodolist();
					$scope.todo_data = return_data.data.message;
					$scope.todo_length = $scope.todo_data.length;
				});
            }
			
			
			$scope.videoPath="http://192.168.1.139/rubyServices/upload/appRelease.png";
            $scope.posts_data=[];
            $http({
                method:'GET',
                url: $localStorage.service+'RepositoryAPI/Rep_Post',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.posts_data=return_data.data.message;
				$scope.videoPath=$localStorage.uploadUrl+$scope.posts_data[0].UPLOAD_FILE;
				//console.log($scope.videoPath,"Path");
            });

                    // video player
            // $scope.video_data = [
            //     {
            //         id: '-CYs99M7hzA',
            //         name: 'Unboxing the HERO4',
            //         source: 'Mashable'
            //     },
            //     {
            //         id: 'te689fEo2pY',
            //         name: 'Apple Watch Unboxing & Setup',
            //         source: 'Unbox Therapy'
            //     },
            //     {
            //         id: '7AFJeaYojhU',
            //         name: 'Energous WattUp Power Transmitter',
            //         source: 'TechCrunch'
            //     },
            //     {
            //         id: 'hajnEpCq5SE',
            //         name: 'The new MacBook - Design',
            //         source: 'Apple'
            //     }
            // ];

            var $video_player = $('#video_player'),
                $video_playlist = $('#video_player_playlist'),
                active_class = 'md-list-item-active';
			// $scope.videoPath=$localStorage.uploadUrl;
            $scope.videoChange = function($event,post_url) {
                var $this = $($event.currentTarget);
                if(!$this.hasClass(active_class)) {
                    var iframe_embed = '<iframe height="150" width="300" data-uk-cover src="' + $localStorage.uploadUrl+post_url + '" frameborder="0" allowfullscreen style="max-height:100%"></iframe>';

                    $video_playlist.children('li').removeClass(active_class);
                    $this.addClass(active_class);

                    $video_player.velocity({
                            translateZ: 0,
                            scale: 0,
                            opacity: 0
                        },
                        {
                            duration: 280,
                            easing: variables.easing_swiftOut,
                            complete: function() {
                                $video_player.html(iframe_embed);
                                setTimeout(function() {
                                    $video_player.velocity('reverse');
                                },280)
                            }
                        }
                    );

                }

            };

        // weather
            $scope.weatherToday = {
                city: 'Some City',
                backgroundImg: 'assets/img/gallery/Image17.jpg',
                icon: 'wi-day-sunny-overcast',
                temperature: '14'
            };
            $scope.weatherData = [
                {
                    icon: 'wi-day-sunny-overcast',
                    temperature: '22',
                    description: 'Mostly Sunny',
                    date: moment().add(1,'days').format('DD MMM (dddd)')
                },
                {
                    icon: 'wi-cloudy',
                    temperature: '19',
                    description: 'Partly Cloudy',
                    date: moment().add(2,'days').format('DD MMM (dddd)')
                },
                {
                    icon: 'wi-day-rain',
                    temperature: '16',
                    description: 'Rainy',
                    date: moment().add(3,'days').format('DD MMM (dddd)')
                },
                {
                    icon: 'wi-day-sunny uk-text-warning',
                    temperature: '24',
                    description: 'Sunny',
                    date: moment().add(4,'days').format('DD MMM (dddd)')
                }
            ];


        }
    ])
;