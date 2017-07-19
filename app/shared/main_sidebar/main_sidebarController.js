angular
    .module('rubycampusApp')
    .controller('main_sidebarCtrl', [
        '$timeout',
        '$scope',
        '$rootScope',
        '$http',
        '$localStorage',
        '$filter',
        function ($timeout,$scope,$rootScope,$http,$localStorage,$filter) {
    
            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $timeout(function() {
                    if(!$rootScope.miniSidebarActive) {
                        // activate current section
                        $('#sidebar_main').find('.current_section > a').trigger('click');
                        $('#sidebar_main').find('.act_item').parents('li:first').find('a:first').trigger('click');
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
                        return '<div class=item><i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i></div>';
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
            var adminLov = [
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
                            // link:'restricted.setting.institution_view'
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
                        //Modified
                        {
                            title: 'Assign Teacher',
                            link: 'restricted.student.assignTeacher'
                        },
                        {
                            title: 'Attendance',
                            submenu: [
                                {
                                    title: 'Student Attendance Report',
									link: 'restricted.academics.studentreport'
                                },
                                {
                                    title: 'Student Attendance Marking',
                                    link: 'restricted.academics.markattendance'
                                },
								{
                                    title: 'Student Leave Approve',
                                    link: 'restricted.academics.studentleaveapprove'
                                }
                            ]
                        },
                        {
                            title: 'Timetable'
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
                                    title: 'Set Term',
                                    link: 'restricted.academics.examination.setTerm'
                                },
								{
                                    title: 'Create Exam',
                                    link: 'restricted.academics.examination.createExam'
                                },
                                {
                                    title: 'Assessment',
									submenu: [
										{
											title: 'Set Assessment',
											link: 'restricted.academics.examination.setassessment'
										},
										{
											title: 'Assessment MarkList',
											// link: 'restricted.academics.examination.assessmentList'
											link: 'restricted.academics.examination.assessmentMark'
										},
									]
                                },
								{
                                    title: 'Exam',
									submenu: [
										{
											title: 'Set Exam',
											link: 'restricted.academics.examination.setexamination'
										},
										{
											title: 'Exam MarkList',
											link: 'restricted.academics.examination.markDetails'
										},
									]
                                }
							]
						},
                        {
                            title: 'Assignments',
                            link: 'restricted.academics.assignment'
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
                                    title: 'Employees',
                                    link: 'restricted.employeemanagement.employee_view'
                                }
                            ]
                        },
                        {
                            title: 'Leave Management',
                            submenu: [
                                {
                                    title: 'Leave Type',
                                    link:'restricted.hr.leave_category'
                                },
                                {
                                    title: 'Leave Entitlement',
                                    link : 'restricted.hr.assignleave_categoryView'
                                },
                                {
                                    title: 'Apply Leave',
                                    link:'restricted.hr.applyLeave'
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
                                    title: 'Pay Structure',
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
                                    title:'Fee Item',
                                    link: 'restricted.finance.fee.feeitemDetails'
                                },
                                {
                                    title:'Fine',
                                    link: 'restricted.finance.fee.fineDetails'
                                },
                                {
                                    title:'Fee Structure',
                                    link: 'restricted.finance.fee.feeStructureDetails'
                                },
                                {
                                    title:'Assign Fees',
                                    link: 'restricted.finance.fee.assignedFeeStructure'
                                },
                                {
                                    title:'Fee Collection',
                                    link: 'restricted.finance.fee.feeCollectionDetails'
                                },
                                {
                                    title:'Report',
                                    submenu:[
                                        {
                                            title:'Student Fee Report',
                                            link: 'restricted.finance.fee.feeReport'
                                        },
                                        {
                                            title:'Fee Defaulter',
                                            link: 'restricted.finance.fee.feeDefaulter'
                                        }
                                    ]
                                    // title:'Fee Report',
                                    // link: 'restricted.finance.fee.feeReport'
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
                        },
                        {
                            title:'Transaction',
                            submenu:[
                                {
                                    title:'Category',
                                    link: 'restricted.finance.fee.category'
                                },
                                {
                                    title:'Income',
                                    link: 'restricted.finance.fee.income'
                                },
                                {
                                    title:'Expense',
                                    link: 'restricted.finance.fee.expense'
                                },
                                {
                                    title:'Report',
                                    link: 'restricted.finance.fee.transactionreport'
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
                            link: 'restricted.library.bookreturn_view'
                        },
                        {
                            title: 'Report',
                            link: 'restricted.library.reportView'
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
                            title: 'Vehicle',
                            link : 'restricted.transport.vehicleDetail'
                        },
                        {
                            title: 'Route',
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
                            title: 'Settings',
                            link: 'restricted.hostel.settings'
                        },
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
                    icon: '&#xE8D1;',
                    submenu: [
                        {
                            title:'Settings',
                            submenu:[
                                {
                                    title: 'Store Category',
                                    link: 'restricted.inventory.storeCategory'
                                },
                                {
                                    title: 'Item Category',
                                    link: 'restricted.inventory.itemCategory'
                                },
                                {
                                    title: 'Supplier Type',
                                    link: 'restricted.inventory.supplierType'
                                }
                            ]
                        },
                        {
                            title: 'Store',
                            link: 'restricted.inventory.store'
                        },
                        {
                            title: 'Item',
                            link: 'restricted.inventory.item'
                        },
                        {
                            title: 'Store Item',
                            link: 'restricted.inventory.storeItem'
                        },
                        {
                            title: 'Supplier',
                            link: 'restricted.inventory.supplier'
                        },
                        {
                            title: 'Material Request',
                            link: 'restricted.inventory.materialRequestView'
                        },
                        {
                            title: 'Purchase Order',
                            link: 'restricted.inventory.purchaseOrderView'
                        },
                        {
                            title: 'Billing',
                            link: 'restricted.inventory.billingView'
                        },
                        {
                            title: 'GRN',
                            link: 'restricted.inventory.grnView'
                        },
                        {
                            title: 'Reports',
                            link: 'restricted.inventory.reportView'
                        }
                    ]
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
                    // id: 13,
                    // title: 'Student Dashboard',
                    // icon: '&#xE158;',
                    // link : 'restricted.studentDashboard'
                // },
                // {
                    // id: 14,
                    // title: 'User Privileges',
                    // icon: '&#xE8E8;',
                    // link : 'restricted.user_privileges.userView'
                // }
            ];
            
			// Employee Role 
			
			var employeeLov = [
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
                    link:'restricted.setting.institutionDetailsView'
                },
                {
                    id: 2,
                    title: 'Academics',
                    icon: 'school',
                    submenu: [
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
                        //Modified
                        {
                            title: 'Assign Teacher',
                            link: 'restricted.student.assignTeacher'
                        },
                        {
                            title: 'Attendance',
                            submenu: [
                                {
                                    title: 'Student Attendance Report',
									link: 'restricted.academics.studentreport'
                                },
                                {
                                    title: 'Student Attendance Marking',
                                    link: 'restricted.academics.markattendance'
                                },
								{
                                    title: 'Student Leave Approve',
                                    link: 'restricted.academics.studentleaveapprove'
                                }
                            ]
                        },
                        {
                            title: 'Timetable',
                            submenu: [
                                {
                                    title: 'View Timetable',
                                    // link:'restricted.academics.timetable.viewtimetable'
                                    link:'restricted.academics.timetable.timetableView'
                                },
                                {
                                    title: 'Manage Timetable',
                                    submenu: [
                                        {
                                            title: 'Create Timetable',
                                            link:'restricted.academics.timetable.managetimetable.createcalendar'
                                        },
                                        {
                                            title: 'Setting',
                                            link:'restricted.academics.timetable.managetimetable.setting'
                                        }
                                    ]
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
                                    title: 'Set Term',
                                    link: 'restricted.academics.examination.setTerm'
                                },
								{
                                    title: 'Create Exam',
                                    link: 'restricted.academics.examination.createExam'
                                },
                                {
                                    title: 'Assessment',
									submenu: [
										{
											title: 'Set Assessment',
											link: 'restricted.academics.examination.setassessment'
										},
										{
											title: 'Assessment MarkList',
											// link: 'restricted.academics.examination.assessmentList'
											link: 'restricted.academics.examination.assessmentMark'
										},
									]
                                },
								{
                                    title: 'Exam',
									submenu: [
										{
											title: 'Set Exam',
											link: 'restricted.academics.examination.setexamination'
										},
										{
											title: 'Exam MarkList',
											link: 'restricted.academics.examination.markDetails'
										},
									]
                                }
							]
						},
                        {
                            title: 'Assignments',
                            link: 'restricted.academics.assignment'
                        }
                    ]
                },
                {
                    id: 3,
                    title: 'Student',
                    icon: '&#xE7FD;',
                    submenu:[
                        {
                            title:'Students',
                            link: 'restricted.student.student_list'
                        }
                    ]
                },
                {
                    id: 4,
                    title: 'Profile',
					icon: '&#xE7FD;',
                    submenu: [
                        {
                            title: 'My Profile',
							link:'restricted.employeemanagement.profile'
                        },
						{
                            title: 'Apply Leave',
							link:'restricted.hr.applyLeave'
                        },
                        {
                            title: 'Payslip Report',
							link : 'restricted.hr.payslipReport'
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
                    ]
                }
            ];
			
            // Student Role
            
            var studentRole = [
                {
                    id: 0,
                    title: 'Dashboard',
                    icon: '&#xE871;',
                    link: 'restricted.studentDashboard'
                },
                {
                    id: 1,
                    title: 'Institution',
                    icon: '&#xE84F;',
                    link:'restricted.setting.institutionDetailsView'
                },
                {
                    id: 2,
                    title: 'Academics',
                    icon: 'school',
                    submenu: [
                        {
                            title: 'Subjects & Syllabus',
                            link:'restricted.academics.studentSubjectView'
                        },
                        {
                            title: 'Attendance',
                            submenu: [
                                {
                                    title: 'Attendance Report',
                                    link: 'restricted.academics.reportforstudent'
                                },
                                {
                                    title: 'My Leaves',
                                    link: 'restricted.student.stuApplyLeave'
                                }
                            ]
                        },
                        {
                            title: 'Timetable'
                        },
                        {
                            title: 'Examination',
                            submenu: [
                                {
                                    title: 'Assign Exam',
                                    link: 'restricted.academics.examination.assign'
                                },
                                {
                                    title: 'Mark List',
                                    link: 'restricted.academics.examination.markDetails'
                                }
                            ]
                        },
                        {
                            title: 'Assignments',
                            link: 'restricted.academics.stuassignment'
                        }
                    ]
                },
                {
                    id: 3,
                    title: 'My Profile',
                    icon: '&#xE7FD;',
                    link: 'restricted.student.student_profile'
                },
                {
                    id: 6,
                    title: 'Repository',
                    icon: '&#xE2CC;',
                    link: 'restricted.repository.repositoryView'
                },
                {
                    id: 8,
                    title: 'Library',
                    icon: '&#xE02F;',
					submenu: [
						{
							title: 'Library',
							link: 'restricted.Library'
						},
						{
							title: 'Books Taken',
							link: 'restricted.library.booktaken'
						}
					]
                    
                },
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
                }
            ];
            
            var parentRole = [
                {
                    id: 0,
                    title: 'Dashboard',
                    icon: '&#xE871;',
                    link: 'restricted.studentDashboard'
                },
                {
                    id: 1,
                    title: 'Institution',
                    icon: '&#xE84F;',
                    link:'restricted.setting.institutionDetailsView'
                },
                {
                    id: 2,
                    title: 'Academics',
                    icon: 'school',
                    submenu: [
                        {
                            title: 'Subjects & Syllabus',
                            link:'restricted.academics.studentSubjectView'
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
                            title: 'Timetable'
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
                            title:'Profile',
                            link: 'restricted.student.student_list'
                        },
                        {
                            title: 'Leaves',
                            submenu: [
                                {
                                    title: 'Apply Leaves',
                                    link: 'restricted.student.stuApplyLeave'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 6,
                    title: 'Repository',
                    icon: '&#xE2CC;',
                    link: 'restricted.repository.repositoryView'
                },
                {
                    id: 8,
                    title: 'Library',
                    icon: '&#xE02F;',
                    link: 'restricted.Library'
                },
                {
                    id: 9,
                    title: 'Transport',
                    icon: '&#xE530;',
                    submenu: [
                        {
                            title: 'Vehicle',
                            link : 'restricted.transport.vehicleDetail'
                        },
                        {
                            title: 'Route',
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
                    ]
                },
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
                }
            ];
            
			// HR Role
			
			var hrLov = [
                {
                    id: 2,
                    title: 'Academics',
                    icon: 'school',
                    submenu: [
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
                            title: 'Assign Teacher',
                            link: 'restricted.student.assignTeacher'
                        },
                        {
                            title: 'Attendance',
                            submenu: [
                                {
                                    title: 'Student Attendance Report',
									link: 'restricted.academics.studentreport'
                                },
                                {
                                    title: 'Student Attendance Marking',
                                    link: 'restricted.academics.markattendance'
                                },
								{
                                    title: 'Student Leave Approve',
                                    link: 'restricted.academics.studentleaveapprove'
                                }
                            ]
                        },
                        {
                            title: 'Timetable',
                            submenu: [
                                {
                                    title: 'View Timetable',
                                    link:'restricted.academics.timetable.timetableView'
                                },
                                {
                                    title: 'Manage Timetable',
                                    submenu: [
                                        {
                                            title: 'Create Timetable',
                                            link:'restricted.academics.timetable.managetimetable.createcalendar'
                                        },
                                        {
                                            title: 'Setting',
                                            link:'restricted.academics.timetable.managetimetable.setting'
                                        }
                                    ]
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
                                    title: 'Set Term',
                                    link: 'restricted.academics.examination.setTerm'
                                },
								{
                                    title: 'Create Exam',
                                    link: 'restricted.academics.examination.createExam'
                                },
                                {
                                    title: 'Assessment',
									submenu: [
										{
											title: 'Set Assessment',
											link: 'restricted.academics.examination.setassessment'
										},
										{
											title: 'Assessment MarkList',
											link: 'restricted.academics.examination.assessmentMark'
										},
									]
                                },
								{
                                    title: 'Exam',
									submenu: [
										{
											title: 'Set Exam',
											link: 'restricted.academics.examination.setexamination'
										},
										{
											title: 'Exam MarkList',
											link: 'restricted.academics.examination.markDetails'
										},
									]
                                }
							]
						},
                        {
                            title: 'Assignments',
                            link: 'restricted.academics.assignment'
                        }
                    ]
                },
                {
                    id: 3,
                    title: 'Student',
                    icon: '&#xE7FD;',
                    submenu:[
                        {
                            title:'Students',
                            link: 'restricted.student.student_list'
                        }
                    ]
                },
                {
                    id: 4,
                    title: 'Profile',
					icon: '&#xE7FD;',
                    submenu: [
                        {
                            title: 'My Profile',
							link:'restricted.employeemanagement.profile'
                        },
						{
                            title: 'Apply Leave',
							link:'restricted.hr.applyLeave'
                        },
                        {
                            title: 'Payslip Report',
							link : 'restricted.hr.payslipReport'
                        }
                    ]
                },
				{
                    id: 5,
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
                                    title: 'Employees',
                                    link: 'restricted.employeemanagement.employee_view'
                                }
                            ]
                        },
                        {
                            title: 'Leave Management',
                            submenu: [
                                {
                                    title: 'Leave Type',
                                    link:'restricted.hr.leave_category'
                                },
                                {
                                    title: 'Leave Entitlement',
                                    link : 'restricted.hr.assignleave_categoryView'
                                },
                                {
                                    title: 'Apply Leave',
                                    link:'restricted.hr.applyLeave'
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
                                    title: 'Pay Structure',
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
                            link: 'restricted.library.bookreturn_view'
                        },
                        {
                            title: 'Report',
                            link: 'restricted.library.reportView'
                        }
                    ]
                }
            ];
            
			var financeLov = [
                {
                    id: 5,
                    title: 'Finance',
                    icon: '&#xE263;',
                    submenu: [
                        {
                            title:'Fees',
                            submenu:[
                                    
                                {
                                    title:'Fee Item',
                                    link: 'restricted.finance.fee.feeitemDetails'
                                },
                                {
                                    title:'Fine',
                                    link: 'restricted.finance.fee.fineDetails'
                                },
                                {
                                    title:'Fee Structure',
                                    link: 'restricted.finance.fee.feeStructureDetails'
                                },
                                {
                                    title:'Assign Fees',
                                    link: 'restricted.finance.fee.assignedFeeStructure'
                                },
                                {
                                    title:'Fee Collection',
                                    link: 'restricted.finance.fee.feeCollectionDetails'
                                },
                                {
                                    title:'Report',
                                    submenu:[
                                        {
                                            title:'Student Fee Report',
                                            link: 'restricted.finance.fee.feeReport'
                                        },
                                        {
                                            title:'Fee Defaulter',
                                            link: 'restricted.finance.fee.feeDefaulter'
                                        }
                                    ]
                                    // title:'Fee Report',
                                    // link: 'restricted.finance.fee.feeReport'
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
                        },
                        {
                            title:'Transaction',
                            submenu:[
                                {
                                    title:'Category',
                                    link: 'restricted.finance.fee.category'
                                },
                                {
                                    title:'Income',
                                    link: 'restricted.finance.fee.income'
                                },
                                {
                                    title:'Expense',
                                    link: 'restricted.finance.fee.expense'
                                },
                                {
                                    title:'Report',
                                    link: 'restricted.finance.fee.transactionreport'
                                }
                            ]
                        }
                    ]
                }
            ];
			
			
			var transportLov = [
                {
                    id: 9,
                    title: 'Transport',
                    icon: '&#xE530;',
                    submenu: [
                        {
                            title: 'Vehicle',
                            link : 'restricted.transport.vehicleDetail'
                        },
                        {
                            title: 'Route',
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
                }
            ];
			
			var hostelLov = [
                {
                    id: 10,
                    title: 'Hostel',
                    icon: '&#xE88A;',
                    submenu: [
                        {
                            title: 'Settings',
                            link: 'restricted.hostel.settings'
                        },
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
                    ]
                }
            ];
			
			var inventoryLov = [
                {
                    id: 11,
                    title: 'Inventory',
                    icon: '&#xE8D1;',
                    submenu: [
                        {
                            title:'Settings',
                            submenu:[
                                {
                                    title: 'Store Category',
                                    link: 'restricted.inventory.storeCategory'
                                },
                                {
                                    title: 'Item Category',
                                    link: 'restricted.inventory.itemCategory'
                                },
                                {
                                    title: 'Supplier Type',
                                    link: 'restricted.inventory.supplierType'
                                }
                            ]
                        },
                        {
                            title: 'Store',
                            link: 'restricted.inventory.store'
                        },
                        {
                            title: 'Item',
                            link: 'restricted.inventory.item'
                        },
                        {
                            title: 'Store Item',
                            link: 'restricted.inventory.storeItem'
                        },
                        {
                            title: 'Supplier',
                            link: 'restricted.inventory.supplier'
                        },
                        {
                            title: 'Material Request',
                            link: 'restricted.inventory.materialRequestView'
                        },
                        {
                            title: 'Purchase Order',
                            link: 'restricted.inventory.purchaseOrderView'
                        },
                        {
                            title: 'Billing',
                            link: 'restricted.inventory.billingView'
                        },
                        {
                            title: 'GRN',
                            link: 'restricted.inventory.grnView'
                        },
                        {
                            title: 'Reports',
                            link: 'restricted.inventory.reportView'
                        }
                    ]
                }
            ];
			
			
            if($localStorage.role_id==1){
                $scope.sections = adminLov;
            }else if($localStorage.role_id==2){
                $scope.sections = employeeLov;
                // $scope.sections = employeeLov.concat(financeLov);
            }else if($localStorage.role_id==3){
                $scope.sections = studentRole;
            }else if($localStorage.role_id==4){
                $scope.sections = parentRole;
            }else if($localStorage.role_id==5){
                $scope.sections = hrLov;
            }else if($localStorage.role_id==6){
                $scope.sections = financeLov;
            }else if($localStorage.role_id==7){
                $scope.sections = transportLov;
            }else if($localStorage.role_id==8){
                $scope.sections = hostelLov;
            }else if($localStorage.role_id==9){
                $scope.sections = inventoryLov;
            }
           
        }
    ])
;