import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { AttendancePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {LoginPage} from '../pages/login/login.component';
import {PasswordPage} from '../pages/password/password.component';
import {Storage} from '@ionic/storage';
import {AccountService} from '../pages/login/account.services';
import {Link} from './link';
import {ClassPopoverPage} from '../pages/home/classpopover.component'

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    AttendancePage,
    TabsPage,
    LoginPage,
    PasswordPage,
    ClassPopoverPage
  ],
  imports: [
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
    ClassPopoverPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},Storage,AccountService,Link]
})
export class AppModule {}
