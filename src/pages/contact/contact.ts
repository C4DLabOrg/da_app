import { Component,OnInit } from '@angular/core';
import { App } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Storage} from '@ionic/storage'
import {LoginPage} from '../login/login.component'
import {HDSync} from '../sync/sync'
import {PasswordPage} from '../password/password.component'

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage implements OnInit {
  user:any
  constructor(public navCtrl: NavController,
  private app:App,private storage:Storage) {

  }
  logout() {
    this.storage.remove("profile");
    this.storage.remove("subjects")
    this.storage.remove("classes")
    this.storage.remove("offline")
    this.storage.remove("user").then(() => {
      console.log("logged out")
      this.gotologin()
    })
  }
  gotologin() {
    //this.navCtrl.setRoot(Loginpage)
    this.app.getRootNav().setRoot(LoginPage)
  }

  gosync(){
    this.navCtrl.push(HDSync)
  }
  gotopassword(){

      this.navCtrl.push(PasswordPage);
  }
   ngOnInit(){
    this.getprofile()
  }
  getprofile(){
    this.storage.get("profile").then((data)=>{
      console.log(data)
      this.user=data
    })
  }
}
