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
                            title: 'Buildings',
                            link: 'restricted.setting.building'
                        },
                        {
                            title: 'Blocks',
                            link: 'restricted.setting.buildingblock'
                        },
                        {
                            title: 'Rooms',
                            link: 'restricted.setting.room'
                        },
                        {
                            title: 'Settings',
                            link: 'restricted.setting.institutionsetting'
                        }
                    ]
                },
                {
                    id: 2,
                    title: 'Academics',
                    icon: 'school',
                    submenu: [
						{
							title: 'Department',
							link: 'restricted.academics.department'
						},
                        {
                            title: 'Courses & Batches',
                            submenu: [
                                {
                                    title: 'Courses',
                                    link: 'restricted.academics.course'
                                },
                                {
                                    title: 'Batches',
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
                            title: 'Student Attendance',
                            submenu: [
                                {
                                    title: 'Attendance Marking',
                                    link: 'restricted.academics.markattendance'
                                },
								{
                                    title: 'Attendance Report',
									link: 'restricted.academics.studentreport'
                                }
								// {
                                    // title: 'Leave Applications',
                                    // link: 'restricted.academics.studentleaveapprove'
                                // }
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
									title: 'Create Timetable',
									link:'restricted.academics.timetable.managetimetable.createcalendar'
								},
								{
									title: 'Setting',
									link:'restricted.academics.timetable.managetimetable.setting'
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
                                // {
                                    // title: 'Assessment',
									// submenu: [
										// {
											// title: 'Set Assessment',
											// link: 'restricted.academics.examination.setassessment'
										// },
										// {
											// title: 'Assessment MarkList',
											// // link: 'restricted.academics.examination.assessmentList'
											// link: 'restricted.academics.examination.assessmentMark'
										// },
									// ]
                                // },
								{
									title: 'Schedule Exam',
									link: 'restricted.academics.examination.setexamination'
								},
								{
									title: 'Marks Entry & Report',
									link: 'restricted.academics.examination.markDetails'
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
                                    link:'restricted.hr.leavetype'
                                },
                                {
                                    title: 'Leave Entitlement',
                                    link : 'restricted.hr.leave_entitlement_View'
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
                                    title: 'Attendance Marking',
                                    link : 'restricted.hr.employee_attendancemarking'
                                },
                                {
                                    title: 'Attendance Report',
                                    link: 'restricted.hr.employeeattendancereport'
                                },
                            ]
                        },
                        {
                            title: 'Payroll & Payslip',
                            submenu: [
                                {
                                    title: 'Pay Items',
                                    link : 'restricted.hr.payitem_details'
                                },
                                {
                                    title: 'Pay Structure',
                                    link : 'restricted.hr.StructureGroup'
                                },
                                {
                                    title: 'Payslips',
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
                            title:'Fees Management',
                            submenu:[
                                    
                                {
                                    title:'Fee Items',
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
                                    title:'Reports',
                                    submenu:[
                                        {
                                            title:'Student Fee Report',
                                            link: 'restricted.finance.fee.feeReport'
                                        },
                                        {
                                            title:'Fee Defaulters',
                                            link: 'restricted.finance.fee.feeDefaulter'
                                        }
                                    ]
                                    // title:'Fee Report',
                                    // link: 'restricted.finance.fee.feeReport'
                                }
                                // {
                                    // title:'Parent Receipt View',
                                    // link: 'restricted.finance.fee.parentReceiptView'
                                // }
                            ]
                        },
                        {
                            title:'Payslip Management',
                            submenu:[
                                {
                                    title:'Payslips',
                                    link: 'restricted.finance.payslipGenaration_view'
                                },
                                {
                                    title:'Approve Payslips',
                                    link: 'restricted.finance.approvepayslip'
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
                // {
                    // id: 7,
                    // title: 'Email Template',
                    // icon: '&#xE158;',
                    // link : 'restricted.emailTemplate.template'
                // },
                {
                    id: 8,
                    title: 'Library',
                    icon: '&#xE02F;',
                    // link: 'restricted.Library'
                    submenu: [
                        {
                            title: 'Book Category',
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
                            title: 'Reports',
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
                            title: 'Vehicles',
                            link : 'restricted.transport.vehicleDetail'
                        },
                        {
                            title: 'Routes',
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
                            title: 'Passenger Allocation',
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
                            title: 'Room Settings',
                            link: 'restricted.hostel.settings'
                        },
                        {
                            title: 'Room Allocation',
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
                            title: 'Store Items',
                            link: 'restricted.inventory.storeItem'
                        },
                        {
                            title: 'Suppliers',
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
                // {
                    // id: 12,
                    // title: 'Calendar',
                    // icon: '&#xE8DF;',
                    // submenu: [
                        // {
                            // title: 'Calendar',
                            // link: 'restricted.plugins.calendar'
                        // },
                        // {
                            // title: 'Exam Calendar',
                            // link: 'restricted.plugins.examination'
                        // },
                        // {
                            // title: 'Events Calendar',
                            // link: 'restricted.plugins.events'
                        // }
                    // ]
                // },
				{
					id: 12,
					title: 'Events & News',
                    icon: '&#xE8DF;',
					link: 'restricted.plugins.events'
				},
				{
					id:13,
					title: 'SMS',
					icon: '&#xE8E8;',
					link: 'restricted.bulksms'
				},
				{
                    id: 14,
                    title: 'User Privileges',
                    icon: '&#xE8DF;',
					link: 'restricted.user_privileges.assignRole'
                }
				// {
                    // id: 14,
                    // title: 'User Privileges',
                    // icon: '&#xE8DF;',
                    // submenu:[
                        // {
                            // title:'Assign Roles',
                            // link: 'restricted.user_privileges.assignRole'
                        // },
                        // {
                            // title:'Set Privileges',
                            // link:'restricted.user_privileges.userView'
                        // }
                        // ]
                // }
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
                            link: 'restricted.academics.syllabus_view'
                        },
                        {
                            title: 'Attendance',
                            submenu: [
                                {
                                    title: 'Student Attendance Marking',
                                    link: 'restricted.academics.markattendance'
                                },
								{
                                    title: 'Student Attendance Report',
									link: 'restricted.academics.studentreport'
                                }
								// {
                                    // title: 'Student Leave Applications',
                                    // link: 'restricted.academics.studentleaveapprove'
                                // }
                            ]
                        },
                        {
                            title: 'Timetable',
							link: 'restricted.academics.timetable.empviewtimetable'
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
									title: 'Schedule Exam',
									link: 'restricted.academics.examination.setexamination'
								},
								{
									title: 'Marks Entry & Reports',
									link: 'restricted.academics.examination.markDetails'
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
							link : 'restricted.hr.payslipReportEmp'
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
                            title: 'Attendance Report',
							link: 'restricted.academics.reportforstudent'
                            // submenu: [
                                // {
                                    // title: 'Attendance Report',
                                    // link: 'restricted.academics.reportforstudent'
                                // }
                                // // {
                                    // // title: 'My Leaves',
                                    // // link: 'restricted.student.stuApplyLeave'
                                // // }
                            // ]
                        },
                        {
                            title: 'Timetable',
							link: 'restricted.academics.timetable.stuviewtimetable'
                        },
                        {
                            title: 'Examination',
                            submenu: [
                                {
                                    title: 'Schedule Exam',
									link: 'restricted.academics.examination.setexamination'
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
					id: 4,
					title:'My Fees',
                    icon: '&#xE263;',
					link: 'restricted.student.paymentforparents'
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
                    title: 'Events',
                    icon: '&#xE8DF;',
					link:'restricted.plugins.events'
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
                            title: 'Timetable',
							link: 'restricted.academics.timetable.stuviewtimetable'
                        },
                        {
                            title: 'Examination',
                            submenu: [
                                {
                                    title: 'Schedule Exam',
									link: 'restricted.academics.examination.setexamination'
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
                    title: 'Student',
                    icon: '&#xE7FD;',
                    submenu:[
                        {
                            title:'Profile',
                            link: 'restricted.student.student_list'
                        },
                        // {
                            // title: 'Leaves',
                            // submenu: [
                                // {
                                    // title: 'Apply Leaves',
                                    // link: 'restricted.student.stuApplyLeave'
                                // }
                            // ]
                        // },
						{
                            title:'Parents Feepayment',
                            link: 'restricted.student.paymentforparents'
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
                    title: 'Events',
                    icon: '&#xE8DF;',
					link:'restricted.plugins.events'
                }
            ];
            
			// HR Role
			
			var hrLov = [
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
                                    link : 'restricted.hr.employee_attendancemarking'
                                },
                                {
                                    title: 'Attendance Report',
                                    link: 'restricted.hr.employeeattendancereport'
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
			
			// HR Role
			
			var empLov = [
				{
                    id: 5,
                    title: 'Employee',
                    icon: '&#xE7EF;',
                    submenu: [
                        {
                            title: 'Employee Profile',
							link: 'restricted.employeemanagement.employee_view'
                        },
                        {
                            title: 'Leave Management',
                            submenu: [
                                {
                                    title: 'Leave Applications',
                                    link : 'restricted.hr.leave_application'
                                },

                                {
                                    title: 'Attendance Register',
                                    link : 'restricted.hr.employee_attendancemarking'
                                },
                                {
                                    title: 'Attendance Report',
                                    link: 'restricted.hr.employeeattendancereport'
                                }
                            ]
                        }
                    ]
                }
            ];
			
			var sidemenu=[];
			var dummy=[];
			sidemenu.push(dummy,adminLov,employeeLov,studentRole,parentRole,hrLov,financeLov,transportLov,hostelLov,inventoryLov,empLov);
			//console.log(sidemenu.length,'sidemenu');
			
			$http.get($localStorage.service+'DashboardAPI/sidemenu',{params:{profileId:$localStorage.userProfile_id,roleId:$localStorage.role_id},headers:{'access_token':$localStorage.access_token}})
			.success(function(response){
				// console.log(response.message[0]['Additional_RoleId'],"response");
				
				if($localStorage.role_id==1){
					$scope.sections = sidemenu[1];
				}else if($localStorage.role_id==2){
					$scope.sections = sidemenu[2];
					if(response.message[0]['Additional_RoleId']!=null){
						$scope.AdRoleId=response.message[0]['Additional_RoleId'].split(',');
						for(var i=0;i<$scope.AdRoleId.length;i++){
							$scope.sections = $scope.sections.concat(sidemenu[$scope.AdRoleId[i]]);
						}
					}
				}else{
					$scope.sections = sidemenu[$localStorage.role_id];
				}
				
			});
			
            // if($localStorage.role_id==1){
                // // $scope.sections = adminLov;
                // $scope.sections = sidemenu[1];
            // }else if($localStorage.role_id==2){
                // // $scope.sections = employeeLov;
                // $scope.sections = sidemenu[2];
				// if($localStorage.Additional_RoleId!=null){
					// $scope.AdRoleId=$localStorage.Additional_RoleId.split(',');
					// for(var i=0;i<$scope.AdRoleId.length;i++){
						// $scope.sections = $scope.sections.concat(sidemenu[$scope.AdRoleId[i]]);
						// // if($scope.AdRoleId[i]==5){
							// // $scope.sections = employeeLov.concat(hrLov);
						// // }else if($scope.AdRoleId[i]==6){
							// // $scope.sections = employeeLov.concat(financeLov);
						// // }else if($scope.AdRoleId[i]==7){
							// // $scope.sections = employeeLov.concat(transportLov);
						// // }else if($scope.AdRoleId[i]==8){
							// // $scope.sections = employeeLov.concat(hostelLov);
						// // }else if($scope.AdRoleId[i]==9){
							// // $scope.sections = employeeLov.concat(inventoryLov);
						// // }
					// }
				// }
                // // $scope.sections = employeeLov.concat(financeLov);
            // }else if($localStorage.role_id==3){
                // $scope.sections = studentRole;
            // }else if($localStorage.role_id==4){
                // $scope.sections = parentRole;
            // }else if($localStorage.role_id==5){
                // $scope.sections = hrLov;
            // }else if($localStorage.role_id==6){
                // $scope.sections = financeLov;
            // }else if($localStorage.role_id==7){
                // $scope.sections = transportLov;
            // }else if($localStorage.role_id==8){
                // $scope.sections = hostelLov;
            // }else if($localStorage.role_id==9){
                // $scope.sections = inventoryLov;
            // }
           
        }
    ])
;