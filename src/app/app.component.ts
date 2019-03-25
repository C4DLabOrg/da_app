import { AccountService } from './../pages/login/account.services';
import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { LoginPage } from '../pages/login/login.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HDTabsPage } from '../pages/headteacher/tabs/tabs';
import { Storage } from '@ionic/storage'


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  rootPage: any;
  constructor(platform: Platform,
   private storage: Storage,
   private account:AccountService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      document.addEventListener('resume', () => {
        console.log("app resuming ..");
      })
    });

  }
  ngOnInit() {
    this.gotoApp()
    // this.account.dostudentsync()
  }

  checkofflines(){
      
  }
  gotoApp() {
    this.storage.get("loggedin").then((val) => {
      console.log(val)
      if (val) {
        this.storage.get("profile").then((profile) => {
          if (profile.headteacher) {
            this.rootPage = HDTabsPage
          }
          else {
            this.rootPage = TabsPage
          }

        })

      }
      else {
        this.rootPage = LoginPage
      }
    });

  }

}

