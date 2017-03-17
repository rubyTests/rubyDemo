angular
    .module('altairApp')
    .controller('dashboardCtrl', [
        '$rootScope',
        '$scope',
        '$interval',
        '$window',
        '$timeout',
        'user_data',
        'variables',
        function ($rootScope,$scope,$interval,$window,$timeout,user_data,variables) {

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
                    title: 'Last Year Result',
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
                $scope.dynamicStats[0].count = '18456';
                $scope.dynamicStats[1].count = '13238';
                $scope.dynamicStats[2].count = '64';

                // update live statistics
                function getRandomVal(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }

                $interval(function () {
                    var random = Math.round(Math.random() * 10);
                    var live_values = $scope.dynamicStats[3].chart_data.toString().split(",");

                    live_values.shift();
                    live_values.push(random);
                    live_values.join(",");

                    var countTo = getRandomVal(20, 100);

                    $scope.dynamicStats[3].chart_data = live_values;
                    $scope.dynamicStats[3].count = ($scope.dynamicStats[3].count == countTo) ? countTo : getRandomVal(20, 120);

                }, 2000)
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
        }
    ])
;