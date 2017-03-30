angular
    .module('altairApp')
    .controller('main_sidebarCtrl', [
        '$timeout',
        '$scope',
        '$rootScope',
        function ($timeout,$scope,$rootScope) {
    
            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $timeout(function() {
                    if(!$rootScope.miniSidebarActive) {
                        // activate current section
                        $('#sidebar_main').find('.current_section > a').trigger('click');
                    } else {
                        // add tooltips to mini sidebar
                        var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
                        tooltip_elem.each(function() {
                            var $this = $(this);
    
                            $this.attr('title',$this.find('.menu_title').text());
                            UIkit.tooltip($this, {
                                pos: 'right'
                            });
                        });
                    }
                })
            });
    
            // language switcher
            $scope.langSwitcherModel = 'gb';
            var langData = $scope.langSwitcherOptions = [
                {id: 1, title: 'English', value: 'gb'},
                {id: 2, title: 'French', value: 'fr'},
                {id: 3, title: 'Chinese', value: 'cn'},
                {id: 4, title: 'Dutch', value: 'nl'},
                {id: 5, title: 'Italian', value: 'it'},
                {id: 6, title: 'Spanish', value: 'es'},
                {id: 7, title: 'German', value: 'de'},
                {id: 8, title: 'Polish', value: 'pl'}
            ];
            $scope.langSwitcherConfig = {
                maxItems: 1,
                render: {
                    option: function(langData, escape) {
                        return  '<div class="option">' +
                            '<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                            '<span>' + escape(langData.title) + '</span>' +
                            '</div>';
                    },
                    item: function(langData, escape) {
                        return '<div class="item"><i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i></div>';
                    }
                },
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                create: false,
                onInitialize: function(selectize) {
                    $('#lang_switcher').next().children('.selectize-input').find('input').attr('readonly',true);
                }
            };
    
            // menu entries
            $scope.sections = [
                {
                    id: 0,
                    title: 'Dashboard',
                    icon: '&#xE871;',
                    link: 'restricted.dashboard'
                },
                {
                    id: 1,
                    title: 'Institution',
                    icon: '&#xE84F;',
                    submenu: [
                        {
                            title: 'Institution Details',
                            link: 'restricted.setting.institutionDetails'
                        },
                        {
                            title: 'Building',
                            link: 'restricted.setting.building'
                        },
                        {
                            title: 'Building Block',
                            link: 'restricted.setting.buildingblock'
                        },
                        {
                            title: 'Room',
                            link: 'restricted.setting.room'
                        }
                    ]
                },
                {
                    id: 2,
                    title: 'Academics',
                    icon: 'school',
                    submenu: [
                         {
                            title: 'Course & Batch',
                            submenu: [
                                {
                                    title: 'Department',
                                    link: 'restricted.academics.department'
                                },
                                {
                                    title: 'Course',
                                    link: 'restricted.academics.course'
                                },
                                {
                                    title: 'Batch',
                                    link: 'restricted.academics.courseBatches'
                                },
                                {
                                    title: 'Calendar',
                                },
                                {
                                    title: 'Assign Class Teacher',
                                    link: 'restricted.academics.assignClassTeacher'
                                }
                            ]
                        },
                        {
                            title: 'Subjects & Syllabus',
                            submenu: [
                                {
                                    title: 'Subjects',
                                    link: 'restricted.academics.subjects'
                                },
                                {
                                    title: 'Syllabus',
                                    link: 'restricted.academics.syllabus_view'
                                }
                            ]
                        },
                        {
                            title: 'Attendance',
                            submenu: [
                                {
                                    title: 'Student Attendance Register',
                                },
                                {
                                    title: 'Student Attendance Report',
									link: 'restricted.plugins.studentreport'
                                },
                                {
                                    title: 'Student Attendance Marking',
                                    link: 'restricted.academics.markattendance'
                                },
                            ]
                        },
                        {
                            title: 'Time Table',
                            submenu: [
                                {
                                    title: 'Configuration',
                                    submenu: [
                                    {
                                        title: 'Class Room Allocation',
                                    },
                                    {
                                        title: 'Create Week Days',
                                    },
                                    {
                                        title: 'Set Class Timing',
                                    },
                                ]
                                },
                                {
                                    title: 'Manage Time Table',
                                }
                            ]
                        },
                       
                        {
                            title: 'Discipline',
                            submenu: [
                                {
                                    title: 'Add Compliant',
                                }
                            ]
                        },
                        {
                            title: 'Examination',
                            submenu: [
								{
                                    title: 'Set Grading',
                                    link: 'restricted.academics.examination.setgrading'
                                },
                                {
                                    title: 'Set Exam',
                                    link: 'restricted.academics.examination.setexam'
                                },
                                {
                                    title: 'Set Assessment',
									link: 'restricted.academics.examination.setassessment'
                                },
								{
                                    title: 'Set Weightages',
                                    link: 'restricted.academics.examination.setweightage'
                                },
                                {
                                    title: 'Assign Exam',
									link: 'restricted.academics.examination.assign'
                                },
								{
                                    title: 'Mark List',
									link: 'restricted.academics.examination.markDetails'
                                },
                                {
                                    title:'Online Exam',
                                    submenu: [
                                        {
                                            title: 'Add Online Exam',
                                        },
                                        {
                                            title: 'View Exam Result',
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 3,
                    title: 'Student',
                    icon: '&#xE7FD;',
                    submenu:[
                        {
                            title:'Student Admission',
                            link: 'restricted.student.admission'
                        },
                        {
                            title:'Students',
                            link: 'restricted.student.student_list'
                        },
                        {
                            title: 'Leaves',
                            submenu: [
                                {
                                    title: 'Apply Leaves',
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 4,
                    title: 'HR',
                    icon: '&#xE7EF;',
                    submenu: [
                        {
                            title: 'Employee Management',
                            submenu: [
                                {
                                    title: 'Employee Category',
                                    link: 'restricted.hr.config.category'
                                },
                                {
                                    title: 'Employee Position',
                                    link: 'restricted.hr.config.position'
                                },
                                {
                                    title: 'Employee Admission',
                                    link: 'restricted.employeemanagement.admission'
                                },
                                {
                                    title: 'Employee Details',
                                    link: 'restricted.employeemanagement.employee_view'
                                }
                            ]
                        },
                        {
                            title: 'Leave Management',
                            submenu: [
                                // {
                                //     title: 'Leave Type',
                                //     link:'restricted.hr.leavetype'
                                // },
                                {
                                    title: 'Leave Category',
                                    link:'restricted.hr.leave_category'
                                },
                                {
                                    title: 'Leave Entitlement',
                                    link : 'restricted.hr.assignleave_categoryView'
                                },
                                {
                                    title: 'Leave Applications',
                                    link : 'restricted.hr.leave_application'
                                },

                                {
                                    title: 'Attendance Register',
									link : 'restricted.academics.empattendancemark'
                                },
                                {
                                    title: 'Attendance Report',
									link: 'restricted.plugins.employeereport'
                                },
                            ]
                        },
                        {
                            title: 'Payroll & Payslip',
                            submenu: [
                                {
                                    title: 'Pay Item',
                                    link : 'restricted.hr.payitem_details'
                                },
                                {
                                    title: 'Pay Category',
                                    link : 'restricted.hr.StructureGroup'
                                },
                                {
                                    title: 'Payslip',
                                    link : 'restricted.hr.payslipGenaration_view'
                                },
                                {
                                    title: 'Payslip Report',
                                    link : 'restricted.hr.payslipReport'
                                },
                                {
                                    title:'Rejected Payslips',
                                    link : 'restricted.hr.rejectpayslip'  
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 5,
                    title: 'Finance',
                    icon: '&#xE263;',
                    submenu: [
                        {
                            title:'Fees',
                            submenu:[
                                {
                                    title:'Configuration',
                                    submenu:[
                                        {
                                            title:'Fee Item',
                                            link: 'restricted.finance.fee.config.feeitemDetails'
                                        },
                                        {
                                            title:'Fine',
                                            link: 'restricted.finance.fee.config.fineDetails'
                                        }
                                    ]
                                },
                                {
                                    title:'Fee Structure',
                                    link: 'restricted.finance.fee.feeStructureDetails'
                                },
                                {
                                    title:'Fee Collection',
                                    link: 'restricted.finance.fee.feeCollectionDetails'
                                },
                                {
                                    title:'Fee Report',
                                    link: 'restricted.finance.fee.feeReport'
                                },
                                {
                                    title:'Parent Receipt View',
                                    link: 'restricted.finance.fee.parentReceiptView'
                                }
                            ]
                        },
                        {
                            title:'Payslip Management',
                            submenu:[
                                {
                                    title:'Payslip',
                                    link: 'restricted.finance.payslipGenaration_view'
                                },
                                {
                                    title:'Approve Payslips',
                                    link: 'restricted.hr.approvepayslip'
                                },
                                {
                                    title:'Payslip Report',
                                    link: 'restricted.finance.payslipReport'
                                }
                            ]
                        }
                    ]
                },

                {
                    id: 6,
                    title: 'Repository',
                    icon: '&#xE2CC;',
                    submenu:[
                        {
                            title:'Category',
                            link: 'restricted.repository.categoryView'
                        },
                        {
                            title:'Post',
                            link: 'restricted.repository.postView'
                        }
                        // ,{
                        //     title:'Repository View',
                        //     link: 'restricted.repository.repositoryView'
                        // }
                    ]
                },
                {
                    id: 7,
                    title: 'Email Template',
                    icon: '&#xE158;',
					link : 'restricted.emailTemplate.template'
                },
                {
                    id: 8,
                    title: 'Library',
                    icon: '&#xE02F;',
                    // link: 'restricted.Library'
                    submenu: [
                        {
                            title: 'Category',
                            link: 'restricted.library.category'
                        },
                        {
                            title: 'Books',
                            link: 'restricted.library.bookviewdetails'
                        },
                        {
                            title: 'Issue Books',
                            link: 'restricted.library.bookissue_view'
                        },
                        {
                            title: 'Return Books',
                            // link: ''
                        },
                        {
                            title: 'Report',
                            // link: ''
                        },
                        // {
                        //     title:"Library View",
                        //     link: 'restricted.Library'
                        // }
                    ]
                },
                {
                    id: 9,
                    title: 'Transport',
                    icon: '&#xE530;',
                    submenu: [
						{
							title: 'Vehicle Detail',
							link : 'restricted.transport.vehicleDetail'
						},
						{
							title: 'Route Detail',
							link : 'restricted.transport.routeDetail'
						},
						{
							title: 'Route Timing',
							link : 'restricted.transport.routeTiming'
						},
						{
							title: 'Route Stops',
							link : 'restricted.transport.routeStops'
						},
						{
							title: 'Route Allocation',
							link : 'restricted.transport.routeAllocation'
						}
					]
                },
                {
                    id: 10,
                    title: 'Hostel',
                    icon: '&#xE88A;',
                    submenu: [
                        {
                            title: 'Allocation',
                            link: 'restricted.hostel.allocation'
                        },
                        {
                            title: 'Transfer',
                            link: 'restricted.hostel.transfer'
                        },
                        {
                            title: 'Vacate',
                            link: 'restricted.hostel.vacate'
                        },
                        {
                            title: 'Visitors',
                            link: 'restricted.hostel.visitors'
                        }
                        // {
                        //     title: 'Reports',
                        //     link: 'restricted.hostel.feereport'
                        // }
                    ]
                },
                {
                    id: 11,
                    title: 'Inventory',
                    icon: '&#xE8D1;'
                    // link: 'restricted.Library'
                },
                // {
                //     id: 12,
                //     title: 'Calendar',
                //     icon: '&#xE8DF;',
                //     link: 'restricted.calendar'
                // },
                {
                    id: 12,
                    title: 'Calendar',
                    icon: '&#xE8DF;',
                    submenu: [
                        {
                            title: 'Calendar',
                            link: 'restricted.plugins.calendar'
                        },
                        {
                            title: 'Exam Calendar',
                            link: 'restricted.plugins.examination'
                        },
                        {
                            title: 'Events Calendar',
                            link: 'restricted.plugins.events'
                        }
                    ]
                },
                // {
                //     id: 15,
                //     title: 'Sticky Notes',
                //     icon: '&#xE8F0;',
                //     link: 'restricted.pages.sticky_notes'
                // },
                // {
                //     id: 7,
                //     title: 'Forms',
                //     icon: '&#xE8D2;',
                //     submenu: [
                //         {
                //             title: 'Regular Elements',
                //             link: 'restricted.forms.regular'
                //         },
                //         {
                //             title: 'Advanced Elements',
                //             link: 'restricted.forms.advanced'
                //         },
                //         {
                //             title: 'Dynamic',
                //             link: 'restricted.forms.dynamic'
                //         },
                //         {
                //             title: 'File Input',
                //             link: 'restricted.forms.file_input'
                //         },
                //         {
                //             title: 'File Upload',
                //             link: 'restricted.forms.file_upload'
                //         },
                //         {
                //             title: 'Validation',
                //             link: 'restricted.forms.validation'
                //         },
                //         {
                //             title: 'Wizard',
                //             link: 'restricted.forms.wizard'
                //         },
                //         {
                //             title: 'CKeditor',
                //             link: 'restricted.forms.wysiwyg_ckeditor',
                //             group: 'WYSIWYG Editors'
                //         },
                //         {
                //             title: 'Ckeditor Inline',
                //             link: 'restricted.forms.wysiwyg_inline'
                //         },
                //         {
                //             title: 'TinyMCE',
                //             link: 'restricted.forms.wysiwyg_tinymce'
                //         }
                //     ]
                // },
                // {
                //     id: 8,
                //     title: 'Layout',
                //     icon: '&#xE8F1;',
                //     submenu: [
                //         {
                //             title: 'Top Menu',
                //             link: 'restricted.layout.top_menu'
                //         },
                //         {
                //             title: 'Full Header',
                //             link: 'restricted.layout.full_header'
                //         }
                //     ]
                // },
                // {
                //     id: 9,
                //     title: 'Kendo UI Widgets',
                //     icon: '&#xE1BD;',
                //     submenu: [
                //         {
                //             title: 'Autocomplete',
                //             link: 'restricted.kendoui.autocomplete'
                //         },
                //         {
                //             title: 'Calendar',
                //             link: 'restricted.kendoui.calendar'
                //         },
                //         {
                //             title: 'ColorPicker',
                //             link: 'restricted.kendoui.colorpicker'
                //         },
                //         {
                //             title: 'ComboBox',
                //             link: 'restricted.kendoui.combobox'
                //         },
                //         {
                //             title: 'DatePicker',
                //             link: 'restricted.kendoui.datepicker'
                //         },
                //         {
                //             title: 'DateTimePicker',
                //             link: 'restricted.kendoui.datetimepicker'
                //         },
                //         {
                //             title: 'DropDownList',
                //             link: 'restricted.kendoui.dropdown_list'
                //         },
                //         {
                //             title: 'Masked Input',
                //             link: 'restricted.kendoui.masked_input'
                //         },
                //         {
                //             title: 'Menu',
                //             link: 'restricted.kendoui.menu'
                //         },
                //         {
                //             title: 'MultiSelect',
                //             link: 'restricted.kendoui.multiselect'
                //         },
                //         {
                //             title: 'Numeric TextBox',
                //             link: 'restricted.kendoui.numeric_textbox'
                //         },
                //         {
                //             title: 'PanelBar',
                //             link: 'restricted.kendoui.panelbar'
                //         },
                //         {
                //             title: 'TimePicker',
                //             link: 'restricted.kendoui.timepicker'
                //         },
                //         {
                //             title: 'Toolbar',
                //             link: 'restricted.kendoui.toolbar'
                //         },
                //         {
                //             title: 'Window',
                //             link: 'restricted.kendoui.window'
                //         }
                //     ]
                // },
                // {
                //     id: 10,
                //     title: 'Components',
                //     icon: '&#xE87B;',
                //     submenu: [
                //         {
                //             title: 'Accordions',
                //             link: 'restricted.components.accordion'
                //         },
                //         {
                //             title: 'Autocomplete',
                //             link: 'restricted.components.autocomplete'
                //         },
                //         {
                //             title: 'Breadcrumbs',
                //             link: 'restricted.components.breadcrumbs'
                //         },
                //         {
                //             title: 'Buttons',
                //             link: 'restricted.components.buttons'
                //         },
                //         {
                //             title: 'Buttons: FAB',
                //             link: 'restricted.components.buttons_fab'
                //         },
                //         {
                //             title: 'Cards',
                //             link: 'restricted.components.cards'
                //         },
                //         {
                //             title: 'Colors',
                //             link: 'restricted.components.colors'
                //         },
                //         {
                //             title: 'Common',
                //             link: 'restricted.components.common'
                //         },
                //         {
                //             title: 'Dropdowns',
                //             link: 'restricted.components.dropdowns'
                //         },
                //         {
                //             title: 'Dynamic Grid',
                //             link: 'restricted.components.dynamic_grid'
                //         },
                //         {
                //             title: 'Footer',
                //             link: 'restricted.components.footer'
                //         },
                //         {
                //             title: 'Grid',
                //             link: 'restricted.components.grid'
                //         },
                //         {
                //             title: 'Icons',
                //             link: 'restricted.components.icons'
                //         },
                //         {
                //             title: 'Lightbox/Modal',
                //             link: 'restricted.components.modal'
                //         },
                //         {
                //             title: 'List/Grid View',
                //             link: 'restricted.components.list_grid_view'
                //         },
                //         {
                //             title: 'Lists',
                //             link: 'restricted.components.lists'
                //         },
                //         {
                //             title: 'Nestable',
                //             link: 'restricted.components.nestable'
                //         },
                //         {
                //             title: 'Notifications',
                //             link: 'restricted.components.notifications'
                //         },
                //         {
                //             title: 'Panels',
                //             link: 'restricted.components.panels'
                //         },
                //         {
                //             title: 'Preloaders',
                //             link: 'restricted.components.preloaders'
                //         },
                //         {
                //             title: 'Slider',
                //             link: 'restricted.components.slider'
                //         },
                //         {
                //             title: 'Slideshow',
                //             link: 'restricted.components.slideshow'
                //         },
                //         {
                //             title: 'Sortable',
                //             link: 'restricted.components.sortable'
                //         },
                //         {
                //             title: 'Switcher',
                //             link: 'restricted.components.switcher'
                //         },
                //         {
                //             title: 'Tables',
                //             link: 'restricted.components.tables'
                //         },
                //         {
                //             title: 'Tables Examples',
                //             link: 'restricted.components.tables_examples'
                //         },
                //         {
                //             title: 'Tabs',
                //             link: 'restricted.components.tabs'
                //         },
                //         {
                //             title: 'Tooltips',
                //             link: 'restricted.components.tooltips'
                //         },
                //         {
                //             title: 'Typography',
                //             link: 'restricted.components.typography'
                //         }
                //     ]
                // },
                // {
                //     id: 11,
                //     title: 'E-commerce',
                //     icon: '&#xE8CB;',
                //     submenu: [
                //         {
                //             title: 'Product Details',
                //             link: 'restricted.ecommerce.product_details'
                //         },
                //         {
                //             title: 'Product Edit',
                //             link: 'restricted.ecommerce.product_edit'
                //         },
                //         {
                //             title: 'Products Grid',
                //             link: 'restricted.ecommerce.products_grid'
                //         },
                //         {
                //             title: 'Products List',
                //             link: 'restricted.ecommerce.products_list'
                //         }
                //     ]
                // },
                // {
                //     id: 12,
                //     title: 'Plugins',
                //     icon: '&#xE8C0;',
                //     submenu: [
                //         {
                //             title: 'Calendar',
                //             link: 'restricted.plugins.calendar'
                //         },
                //         {
                //             title: 'Charts',
                //             link: 'restricted.plugins.charts'
                //         },
                //         {
                //             title: 'Charts (Echarts)',
                //             link: 'restricted.plugins.charts_echarts'
                //         },
                //         {
                //             title: 'Code Editor',
                //             link: 'restricted.plugins.code_editor'
                //         },
                //         {
                //             title: 'Context Menu',
                //             link: 'restricted.plugins.context_menu'
                //         },
                //         {
                //             title: 'Datatables',
                //             link: 'restricted.plugins.datatables'
                //         },
                //         {
                //             title: 'Diff View',
                //             link: 'restricted.plugins.diff_view'
                //         },
                //         {
                //             title: 'Filemanager',
                //             link: 'restricted.plugins.filemanager'
                //         },
                //         {
                //             title: 'Gantt Chart',
                //             link: 'restricted.plugins.gantt_chart'
                //         },
                //         {
                //             title: 'Google Maps',
                //             link: 'restricted.plugins.google_maps'
                //         },
                //         {
                //             title: 'Image Cropper',
                //             link: 'restricted.plugins.image_cropper'
                //         },
                //         {
                //             title: 'Idle Timeout',
                //             link: 'restricted.plugins.idle_timeout'
                //         },
                //         {
                //             title: 'Push Notifications',
                //             link: 'restricted.plugins.push_notifications'
                //         },
                //         {
                //             title: 'Tablesorter',
                //             link: 'restricted.plugins.tablesorter'
                //         },
                //         {
                //             title: 'Tour',
                //             link: 'restricted.plugins.tour'
                //         },
                //         {
                //             title: 'Tree',
                //             link: 'restricted.plugins.tree'
                //         },
                //         {
                //             title: 'Vector Maps',
                //             link: 'restricted.plugins.vector_maps'
                //         }
                //     ]
                // },
                // {
                //     id: 13,
                //     title: 'Pages',
                //     icon: '&#xE24D;',
                //     submenu: [
                //         {
                //             title: 'Blank',
                //             link: 'restricted.pages.blank'
                //         },
                //         {
                //             title: 'Contact List',
                //             link: 'restricted.pages.contact_list'
                //         },
                //         {
                //             title: 'Contact List Horizontal',
                //             link: 'restricted.pages.contact_list_horizontal'
                //         },
                //         {
                //             title: 'Gallery',
                //             link: 'restricted.pages.gallery'
                //         },
                //         {
                //             title: 'Help/Faq',
                //             link: 'restricted.pages.help'
                //         },
                //         {
                //             title: 'Login Page',
                //             link: 'login'
                //         },
                //         {
                //             title: 'Notes',
                //             link: 'restricted.pages.notes'
                //         },
                //         {
                //             title: 'Pricing Tables',
                //             link: 'restricted.pages.pricing_tables'
                //         },
                //         {
                //             title: 'Search Results',
                //             link: 'restricted.pages.search_results'
                //         },
                //         {
                //             title: 'Settings',
                //             link: 'restricted.pages.settings'
                //         },
                //         {
                //             title: 'Todo',
                //             link: 'restricted.pages.todo'
                //         },
                //         {
                //             title: 'User edit',
                //             link: 'restricted.pages.user_edit'
                //         },
                //         {
                //             title: 'Issues List',
                //             link: 'restricted.pages.issues.list',
                //             group: 'Issues'
                //         },
                //         {
                //             title: 'Issue Details',
                //             link: 'restricted.pages.issues.details({ issueId: 1 })'
                //         },
                //         {
                //             title: 'Blog List',
                //             link: 'restricted.pages.blog.list',
                //             group: 'Blog'
                //         },
                //         {
                //             title: 'Blog Article',
                //             link: 'restricted.pages.blog.article({ articleId: 1 })'
                //         },
                //         {
                //             title: 'Error 404',
                //             link: 'error.404',
                //             group: 'Errors'
                //         },
                //         {
                //             title: 'Error 500',
                //             link: 'error.500'
                //         }
                //     ]
                // },
                // {
                //     id: 14,
                //     title: 'Multi level',
                //     icon: '&#xE241;',
                //     submenu: [
                //         {
                //             title: 'First level',
                //             submenu: [
                //                 {
                //                     title: 'Second level',
                //                     submenu: [
                //                         {
                //                             title: 'Third level'
                //                         },
                //                         {
                //                             title: 'Third level'
                //                         },
                //                         {
                //                             title: 'Third level'
                //                         }
                //                     ]
                //                 },
                //                 {
                //                     title: 'Long title to test',
                //                     submenu: [
                //                         {
                //                             title: 'Third level'
                //                         },
                //                         {
                //                             title: 'Third level'
                //                         },
                //                         {
                //                             title: 'Third level'
                //                         }
                //                     ]
                //                 },
                //                 {
                //                     title: 'Even longer title multi line'
                //                 }
                //             ]
                //         }
                //     ]
                // }
            ]
    
        }
    ])
;