import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Storage} from '@ionic/storage'
import {LoginPage} from '../login/login.component'

import {PasswordPage} from '../password/password.component'

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController,
  private app:App,private storage:Storage) {

  }
  logout() {
    this.storage.remove("profile");
    this.storage.remove("subjects")
    this.storage.remove("classes")
    this.storage.remove("user").then(() => {
      console.log("logged out")
      this.gotologin()
    })
  }
  gotologin() {
    //this.navCtrl.setRoot(Loginpage)
    this.app.getRootNav().setRoot(LoginPage)
  }

  gotopassword(){

      this.navCtrl.push(PasswordPage);
  }
}
