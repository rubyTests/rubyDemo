angular
    .module('rubycampusApp')
    .controller('reportforstudentCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$compile',
        'variables',
        '$resource',
        '$filter',
        '$stateParams',
        '$http',
        '$localStorage',
        function ($scope,$rootScope,$timeout,$compile,variables,$resource,$filter,$stateParams,$http,$localStorage) {
            // console.log($localStorage.courseTypes,'$localStorage.courseTypes');

            if($localStorage.courseTypes=='Daily'){
                $scope.showDaily=true;
                $scope.showSubject=false;
            }else {
                $scope.showDaily=false;
                $scope.showSubject=true;
            }

            // $http({
            //     method : "GET",
            //     url : $localStorage.service+"StuAttendanceAPI/studentBasicandPercentageDetails",
            //     params : {
            //         'profileid':$stateParams.id
            //     },
            //     headers:{'access_token':$localStorage.access_token}
            // }).then(function(response1) {
            //     console.log(response1,'response');
            //     // $scope.basic = response1.data.message;
            // });

            $scope.sendParams=function(subjectid){
                $localStorage.subjectids=subjectid;
            }
            var percen=0;
			if($stateParams.id){
                $http({
                    method : "GET",
                    url : $localStorage.service+"StuAttendanceAPI/studentBasicandPercentageDetails",
                    params : {
                        'profileid':$stateParams.id
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(response1) {
                    // console.log(response1.data.message[0],'response');
                    $scope.basic = response1.data.message[0];
                    $scope.AttendancePercentage = response1.data.message[0].PERCENTAGE;
                    percen=response1.data.message[0].PERCENTAGE;
                });

				$http.get($localStorage.service+'StuAttendanceAPI/stuAttendanceReport',{params:{attendance_type:$localStorage.courseTypes,profileId:$stateParams.id},headers:{'access_token':$localStorage.access_token}})
				.success(function(data){
					$scope.table_data = data.message;
                    console.log(data.message,'ddddddddddddd');
                    if(data.message=='Data Not found'){
                        $scope.tblShow=false;
                    }else{
                        $scope.tblShow=true;
                    }
				});
			// }else{
			// 	$http.get($localStorage.service+'StuAttendanceAPI/stuProfileAttendanceReport',{params:{profileId:$localStorage.userProfile_id},headers:{'access_token':$localStorage.access_token}})
			// 	.success(function(data){
			// 		console.log(data,'tttttt');
			// 		$scope.currentUser = data.message[0];
			// 		$scope.table_data = data.message[0].leaveDetails;
			// 		$scope.percentage=data.message[0].Percentage;
					
			// 	});
			}
			
			$scope.AttendanceType=$localStorage.stuAttendanceType
			// parseInt($scope.percentage)
			$scope.tesVal=78;
            // live update gauge chart
            var c3_server_load_id = '#c3_server_load';
			setTimeout(function(){
				if($(c3_server_load_id).length) {
					var server_1 = c3.generate({
						bindto: c3_server_load_id,
						data: {
							columns: [
								['Overall Percentage', percen]
							],
							type: 'gauge',
							onclick: function (d, i) { /*console.log("onclick", d, i);*/ },
							onmouseover: function (d, i) { /*console.log("onmouseover", d, i);*/ },
							onmouseout: function (d, i) { /*console.log("onmouseout", d, i);*/ }
						},
						gauge: {
							label: {
								format: function(value, ratio) {
									return value + '%';
								},
								show: false
							},
							min: 0,
							max: 100,
							width: 36
						},
						color: {
							pattern: ['#D32F2F', '#F57C00', '#388E3C' ], // the three color levels for the percentage values.
							threshold: {
								values: [50, 80, 100]
							}
						},
						size: {
							height: 180
						}
					});
				} 
			},1500)
              

            // initialize tables
            $scope.$on('onLastRepeat', function (scope, element, attrs) {

                var $ts_pager_filter = $("#ts_pager_filter"),
                    $ts_align = $('#ts_align'),
                    $ts_customFilters = $('#ts_custom_filters'),
                    $columnSelector = $('#columnSelector');

                // pager + filter
                if($(element).closest($ts_pager_filter).length) {

                    // define pager options
                    var pagerOptions = {
                        // target the pager markup - see the HTML block below
                        container: $(".ts_pager"),
                        // output string - default is '{page}/{totalPages}'; possible variables: {page}, {totalPages}, {startRow}, {endRow} and {totalRows}
                        output: '{startRow} - {endRow} of {filteredRows}',
                        // if true, the table will remain the same height no matter how many records are displayed. The space is made up by an empty
                        // table row set to a height to compensate; default is false
                        fixedHeight: true,
                        // remove rows from the table to speed up the sort of large tables.
                        // setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
                        removeRows: false,
                        // go to page selector - select dropdown that sets the current page
                        cssGoto: '.ts_gotoPage'
                    };

                    // change popup print & close button text
                    $.tablesorter.language.button_print = "Print table";
                    $.tablesorter.language.button_close = "Cancel";

                    // print table
                    $('#printTable').on('click',function(e) {
                        e.preventDefault();
                        $ts_pager_filter.trigger('printTable');
                    });

                    // Initialize tablesorter
                    var ts_users = $ts_pager_filter
                        .tablesorter({
                            theme: 'altair',
                            widthFixed: true,
                            widgets: ['zebra', "filter", 'print','columnSelector'],
                            headers: {
                                0: {
                                    sorter: false,
                                    parser: false
                                }
                            },
                            widgetOptions : {
                                // column selector widget
                                columnSelector_container : $columnSelector,
                                columnSelector_name : 'data-name',
                                columnSelector_layout : '<li class="padding_md"><input type="checkbox"><label class="inline-label">{name}</label></li>',
                                columnSelector_saveColumns: false,
                                // print widget
                                print_title      : '',          // this option > caption > table id > "table"
                                print_dataAttrib : 'data-name', // header attrib containing modified header name
                                print_rows       : 'f',         // (a)ll, (v)isible, (f)iltered, or custom css selector
                                print_columns    : 's',         // (a)ll, (v)isible or (s)elected (columnSelector widget)
                                print_extraCSS   : '',          // add any extra css definitions for the popup window here
                                print_styleSheet : '',          // add the url of your print stylesheet
                                print_now        : true,        // Open the print dialog immediately if true
                                // callback executed when processing completes - default setting is null
                                filter_external : '.search',
                                // add a default type search to the first name column
                                filter_defaultFilter: { 1 : '~{query}' },
                                // include column filters
                                filter_columnFilters: false,
                                filter_placeholder: { search : 'Search...' },
                                filter_saveFilters : true,
                                filter_reset: '.reset',
                                print_callback   : function(config, $table, printStyle){
                                    // hide sidebar
                                    $rootScope.primarySidebarActive = false;
                                    $rootScope.primarySidebarOpen = false;
                                    $timeout(function () {
                                        // print the table using the following code
                                        $.tablesorter.printTable.printOutput( config, $table.html(), printStyle );
                                    }, 300);
                                }
                            }
                        })
                        // initialize the pager plugin
                        .tablesorterPager(pagerOptions)
                        .on('pagerComplete', function(e, filter){
                            // update selectize value
                            if(typeof selectizeObj !== 'undefined' && selectizeObj.data('selectize')) {
                                selectizePage = selectizeObj[0].selectize;
                                selectizePage.setValue($('select.ts_gotoPage option:selected').index() + 1, false);
                            }
                        });
                        $('button[data-column]').on('click', function(){
                            var $this = $(this),
                              totalColumns = $table[0].config.columns,
                              col = $this.data('column'), // zero-based index or "all"
                              filter = [];

                            // text to add to filter
                            filter[ col === 'all' ? totalColumns : col ] = $this.text();
                            $table.trigger('search', [ filter ]);
                            return false;
                          });

                    // replace column selector checkboxes
                    $columnSelector.children('li').each(function(index) {
                        var $this = $(this);

                        var id = index == 0 ? 'auto' : index;
                        $this.children('input').attr('id','column_'+id);
                        $this.children('label').attr('for','column_'+id);

                        $this.children('input')
                            .prop('checked',true)
                            .iCheck({
                            checkboxClass: 'icheckbox_md',
                            radioClass: 'iradio_md',
                            increaseArea: '20%'
                        });

                        if(index != 0) {
                            $this.find('input')
                                .on('ifChanged', function (ev) {
                                    $(ev.target).toggleClass('checked').change();
                                })
                        }

                    });

                    $('#column_auto')
                        .on('ifChecked',function(ev) {
                            $(this)
                                .closest('li')
                                .siblings('li')
                                .find('input').iCheck('disable');
                            $(ev.target).removeClass('checked').change();
                        })
                        .on('ifUnchecked',function(ev) {
                            $(this)
                                .closest('li')
                                .siblings('li')
                                .find('input').iCheck('enable');
                            $(ev.target).addClass('checked').change();
                        });

                    // replace 'goto Page' select
                    function createPageSelectize() {
                        selectizeObj = $('select.ts_gotoPage')
                            .val($("select.ts_gotoPage option:selected").val())
                            .after('<div class="selectize_fix"></div>')
                            .selectize({
                                hideSelected: true,
                                onDropdownOpen: function($dropdown) {
                                    $dropdown
                                        .hide()
                                        .velocity('slideDown', {
                                            duration: 200,
                                            easing: variables.easing_swiftOut
                                        })
                                },
                                onDropdownClose: function($dropdown) {
                                    $dropdown
                                        .show()
                                        .velocity('slideUp', {
                                            duration: 200,
                                            easing: variables.easing_swiftOut
                                        });

                                    // hide tooltip
                                    $('.uk-tooltip').hide();
                                }
                            });
                    }
                    createPageSelectize();

                    // replace 'pagesize' select
                    $('.pagesize.ts_selectize')
                        .after('<div class="selectize_fix"></div>')
                        .selectize({
                            hideSelected: true,
                            onDropdownOpen: function($dropdown) {
                                $dropdown
                                    .hide()
                                    .velocity('slideDown', {
                                        duration: 200,
                                        easing: variables.easing_swiftOut
                                    })
                            },
                            onDropdownClose: function($dropdown) {
                                $dropdown
                                    .show()
                                    .velocity('slideUp', {
                                        duration: 200,
                                        easing: variables.easing_swiftOut
                                    });

                                // hide tooltip
                                $('.uk-tooltip').hide();

                                if(typeof selectizeObj !== 'undefined' && selectizeObj.data('selectize')) {
                                    selectizePage = selectizeObj[0].selectize;
                                    selectizePage.destroy();
                                    $('.ts_gotoPage').next('.selectize_fix').remove();
                                    setTimeout(function() {
                                        createPageSelectize()
                                    })
                                }

                            }
                        });

                    // select/unselect table rows
                    $('.ts_checkbox_all')
                        .iCheck({
                            checkboxClass: 'icheckbox_md',
                            radioClass: 'iradio_md',
                            increaseArea: '20%'
                        })
                        .on('ifChecked',function() {
                            $ts_pager_filter
                                .find('.ts_checkbox')
                                // check all checkboxes in table
                                .prop('checked',true)
                                .iCheck('update')
                                // add highlight to row
                                .closest('tr')
                                .addClass('row_highlighted');
                        })
                        .on('ifUnchecked',function() {
                            $ts_pager_filter
                                .find('.ts_checkbox')
                                // uncheck all checkboxes in table
                                .prop('checked',false)
                                .iCheck('update')
                                // remove highlight from row
                                .closest('tr')
                                .removeClass('row_highlighted');
                        });

                    // select/unselect table row
                    $ts_pager_filter.find('.ts_checkbox')
                        .on('ifUnchecked',function() {
                            $(this).closest('tr').removeClass('row_highlighted');
                            $('.ts_checkbox_all').prop('checked',false).iCheck('update');
                        }).on('ifChecked',function() {
                            $(this).closest('tr').addClass('row_highlighted');
                        });

                    // remove single row
                    $ts_pager_filter.on('click','.ts_remove_row',function(e) {
                        e.preventDefault();

                        var $this = $(this);
                        UIkit.modal.confirm('Are you sure you want to delete this user?', function(){
                            $this.closest('tr').remove();
                            ts_users.trigger('update');
                        }, {
                            labels: {
                                'Ok': 'Delete'
                            }
                        });
                    });
                }

                // align widget example
                if($(element).closest($ts_align).length) {
                    $ts_align.tablesorter({
                        theme: 'altair',
                        widgets: ['zebra', 'alignChar'],
                        widgetOptions: {
                            alignChar_wrap: '<i/>',
                            alignChar_charAttrib: 'data-align-char',
                            alignChar_indexAttrib: 'data-align-index',
                            alignChar_adjustAttrib: 'data-align-adjust' // percentage width adjustments
                        }
                    });
                }

                // custom filters
                if($(element).closest($ts_customFilters).length) {
                    $ts_customFilters
                        .tablesorter({
                            theme: 'altair',
                            headerTemplate: '{content} {icon}',
                            widgets: ['zebra', 'filter'],
                            widgetOptions: {
                                filter_reset : 'button.ts_cf_reset',
                                filter_cssFilter: ['', 'ts_cf_range', 'ts_cf_select_single', 'ts_cf_datepicker']
                            }
                        })
                        .on('apply.daterangepicker', function(){
                            $table.trigger('search');
                        });

                    // rangeSlider
                    var slider = $('.ts_cf_range').ionRangeSlider({
                        "min": "0",
                        "max": "1000",
                        "type": "double",
                        "grid-num": "10",
                        "from-min": "10",
                        "from-max": "30",
                        "input_values_separator": " - "
                    }).data("ionRangeSlider");

                    // selectize
                    var $selectize = $('.ts_cf_select_single')
                        .after('<div class="selectize_fix"></div>')
                        .selectize({
                            hideSelected: true,
                            dropdownParent: 'body',
                            closeAfterSelect: true,
                            onDropdownOpen: function($dropdown) {
                                $dropdown
                                    .hide()
                                    .velocity('slideDown', {
                                        duration: 200,
                                        easing: [ 0.4,0,0.2,1 ]
                                    })
                            },
                            onDropdownClose: function($dropdown) {
                                $dropdown
                                    .show()
                                    .velocity('slideUp', {
                                        duration: 200,
                                        easing: [ 0.4,0,0.2,1 ]
                                    });
                            }
                        });

                    var cf_selectize = $selectize[0].selectize;

                    var modal = UIkit.modal("#modal_daterange", {
                        center: true
                    });

                    $('.ts_cf_datepicker').on('focus',function() {
                        if ( modal.isActive() ) {
                            modal.hide();
                        } else {
                            modal.show();
                        }
                    });

                    var $dp_start = $('#ts_dp_start'),
                        $dp_end = $('#ts_dp_end');

                    var start_date = UIkit.datepicker($dp_start, {
                        format:'MMM D, YYYY'
                    });

                    var end_date = UIkit.datepicker($dp_end, {
                        format:'MMM D, YYYY'
                    });

                    $dp_start.on('change',function() {
                        end_date.options.minDate = $dp_start.val();
                    });

                    $dp_end.on('change',function() {
                        start_date.options.maxDate = $dp_end.val();
                    });

                    $('#daterangeApply').on('click', function(e){
                        e.preventDefault();
                        modal.hide();
                        $('.ts_cf_datepicker').val(
                            $dp_start.val() + ' - ' + $dp_end.val()
                        ).change().blur();
                    });

                    $('button.ts_cf_reset').on('click', function() {
                        // reset selectize
                        cf_selectize.clear();
                        // slider reset
                        slider.reset();
                    })

                }

            });

        }
    ]);