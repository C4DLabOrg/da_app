import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AccountService } from '../login/account.services'
import { ChangePassword } from './changepassword'
@Component({
  selector: 'page-password',
  templateUrl: 'password.component.html'
})
export class PasswordPage {
  changepass: ChangePassword = new ChangePassword()
  error: string
  eheader: string
  loader: any
  title:string
  message:string
  constructor(public navCtrl: NavController,
    private account: AccountService,
    private loadctrl: LoadingController) {

  }
  ldpresent(message: string) {
    this.loader = this.loadctrl.create({ content: message })
    this.loader.present();
  }
  change() {
    this.error = null;
    this.title=null;
    this.ldpresent("Changing password ...")
    // this.changepass.new_password=this.new_password
    // this.changepass.old_password=this.old_password
   
    this.account.changepassword(this.changepass).then((resp) => {
      console.log(resp)
      this.title="Successful";
      this.message="Password Changed"
      this.loader.dismiss();
    }, (error) => {
      console.log(error)
      this.loader.dismiss();
      if (error.url != null) {
        if (error.json().error_description) {
          this.error = error.json().error_description
        } else {
          this.error = error.json()

        }

        this.eheader = error.statusText
        if (error.url == null) {
          this.error = "Check your internet connection"
        }
        else if (error.status == 400) {
          this.error = "Wrong Password Provided"
        }
      }
      else {
        this.eheader = "No Connection"
        this.error = "Make sure you have a working internet connection"
      }
    })

  }

}
