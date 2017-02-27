import { Component } from '@angular/core';

import { AttendancePage } from '../../home/home';
import { HDReportPage } from '../reports/reports';
import { HDSchoolPage } from '../school/school';
import { ContactPage } from '../../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class HDTabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = AttendancePage;
  tab2Root: any = HDReportPage;
  tab3Root: any = ContactPage;
  tab4Root: any = HDSchoolPage;

  constructor() {

  }
}
