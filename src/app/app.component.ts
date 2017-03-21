import { Component,OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { LoginPage } from '../pages/login/login.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HDTabsPage } from '../pages/headteacher/tabs/tabs';
import {Storage}  from '@ionic/storage'


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  rootPage: any;
  constructor(platform: Platform,private storage:Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  
  }
  ngOnInit(){
    this.gotoApp()
  }

  gotoApp() {
    this.storage.get("user").then((val) => {
      console.log(val)
      if (val) {
        this.rootPage=HDTabsPage
      }
      else {
        this.rootPage=LoginPage
      }
    });

  }

}

