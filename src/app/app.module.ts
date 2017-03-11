import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { AttendancePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {LoginPage} from '../pages/login/login.component';
import {PasswordPage} from '../pages/password/password.component';
import {ResultPage} from '../pages/result/result.component';
import {AbsencePage} from '../pages/absence/absence.component';
import {Storage} from '@ionic/storage';
import {AccountService} from '../pages/login/account.services';
import {Link} from './link';
import {ClassPopoverPage} from '../pages/home/classpopover.component';
import { ChartModule } from 'angular2-highcharts';
import { HDTabsPage } from '../pages/headteacher/tabs/tabs';
import { HDReportPage } from '../pages/headteacher/reports/reports';
import { HDSchoolPage} from '../pages/headteacher/school/school';
import { HDStudentPage} from '../pages/headteacher/students/students'
import {AddStudentModal} from '../pages/headteacher/students/addstudent'
import {AddTeacherModal} from '../pages/headteacher/teachers/addteacher'
import { HDTeachersPage} from '../pages/headteacher/teachers/teachers'
import {HDSync} from '../pages/headteacher/sync/sync'
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    AttendancePage,
    TabsPage,
    LoginPage,
    PasswordPage,
    ClassPopoverPage,
    ResultPage,
    AbsencePage,
    HDTabsPage,
    HDReportPage,
    HDSchoolPage,
    HDStudentPage,
    AddStudentModal,
    AddTeacherModal,
    HDTeachersPage,
    HDSync

  ],
  imports: [ ChartModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    AttendancePage,
    TabsPage,
    LoginPage,
    PasswordPage,
    ClassPopoverPage,
    ResultPage,
    AbsencePage,
    HDTabsPage,
    HDReportPage,
    HDSchoolPage,
    HDStudentPage,
    AddStudentModal,
    AddTeacherModal,
    HDTeachersPage,
    HDSync

  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},Storage,AccountService,Link]
})
export class AppModule {}
