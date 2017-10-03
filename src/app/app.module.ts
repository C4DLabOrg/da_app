import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { AttendancePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {LoginPage} from '../pages/login/login.component';
import {PasswordPage} from '../pages/password/password.component';
import {ResultPage} from '../pages/result/result.component';
import {AbsencePage} from '../pages/absence/absence.component';
import {AccountService} from '../pages/login/account.services';
import {Link} from './link';
import {BrowserModule} from '@angular/platform-browser'
import {HttpModule} from '@angular/http'
import {ClassPopoverPage} from '../pages/home/classpopover.component';
import { ChartModule, } from 'angular2-highcharts';
import { HDTabsPage } from '../pages/headteacher/tabs/tabs';
import { HDReportPage } from '../pages/headteacher/reports/reports';
import { HDSchoolPage} from '../pages/headteacher/school/school';
import { HDStudentPage} from '../pages/headteacher/students/students'
import {AddStudentModal} from '../pages/headteacher/students/addstudent'
import {AddTeacherModal} from '../pages/headteacher/teachers/addteacher'
import { HDTeachersPage} from '../pages/headteacher/teachers/teachers'
import { PromotePage} from '../pages/headteacher/promote/promote'
// import { HelpPage} from '../pages/help/help'
// import { HelpPage} from '../pages/headteacher/help/help'
import {AddClassModal} from '../pages/headteacher/classes/addclass'
import { HDClassesPage} from '../pages/headteacher/classes/classes'
import {HDSync} from '../pages/sync/sync'
import { IndividualPage} from '../pages/headteacher/individual/individual';
import {StudentSearch} from '../pipes/student-search'
import { Ng2OrderModule } from 'ng2-order-pipe';
// import {DatePicker  } from "../pages/ionic2-date-picker/date-picker";
import { DatePicker } from '@ionic-native/date-picker';

//import {require} from '@types/node'
//declare var require: any;


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
    AddClassModal,
    HDClassesPage,
    HDTeachersPage,
    IndividualPage,
    PromotePage,
    // HelpPage,
    HDSync,StudentSearch
    // ,DatePicker

  ],
  imports: [ ChartModule,Ng2OrderModule, IonicStorageModule.forRoot(),BrowserModule,HttpModule,
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
    AddClassModal,
    HDClassesPage,
    HDStudentPage,
    AddStudentModal,
    AddTeacherModal,
    HDTeachersPage,
    IndividualPage,
    PromotePage,
    // HelpPage,
    HDSync
    // ,DatePicker

  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},DatePicker,AccountService,Link]
})
export class AppModule {}
