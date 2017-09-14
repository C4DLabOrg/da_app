import { Component } from '@angular/core';

import { NavController, LoadingController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs'
import { AccountService } from './account.services'
import { Storage } from '@ionic/storage'
import { HDTabsPage } from '../headteacher/tabs/tabs';
import $ from "jquery";
@Component({
  selector: 'page-login',
  templateUrl: 'login.component.html'
})
export class LoginPage {

  username: string
  password: string
  error: string
  eheader: string
  loader: any
  constructor(public navCtrl: NavController,
    private account: AccountService,
    private storage: Storage,
    private loadctrl: LoadingController) {
    // this.loader = this.loadctrl.create({ content: "Logging in ..", dismissOnPageChange: true })

  }
  ldpresent(message: string) {
    this.loader = this.loadctrl.create({ content: message })
    this.loader.present();
  }
  gotoPage(data) {
    this.storage.set('loggedin', true).then(() => {
      if (data.headteacher) {
        this.navCtrl.setRoot(HDTabsPage)
      }
      else {
        this.navCtrl.setRoot(TabsPage)
      }
    })


  }

  login() {
    this.error = null;
    this.ldpresent("Logging in ...")
    if (this.username && this.password) {
      this.account.getauth()
      this.account.login($.trim(this.username), this.password)
        .subscribe((response) => {
          console.log("The response is ", response)
          if (response == "offline") {
            this.storage.get("profile").then(data => {
              this.gotoPage(data);
            });
          }
          else {
            this.storage.set("user", response).then(() => {
              this.gototab()
            })
          }

          // console.log(response)
          this.loader.dismiss();
        }, (error) => {
          console.log(error)
          this.loader.dismiss();
           if(error.title){
             this.eheader = error.title
              this.error=error.message
            }
            else if (error.url != null) {
           
            if (error.json().error_description) {
              this.error = error.json().error_description
            } else {
              this.error = error.json().error.replace("_", " ")
            }
            this.eheader = error.statusText
            
            if (error.url == null) {
              this.error = "Check your internet connection"
            }
            else if (error.status == 400) {
              this.error = "Confirm email and password"
            }
          }
          else {
            this.eheader = "No Internet Connection"
            this.error = "Turn on mobile data or wifi"
          }
          console.log("haha", error)
        });
      // .catch((error) => {
      //   this.loader.dismiss();
      //   if (error != null) {
      //     if (error.json().error_description) {
      //       this.error = error.json().error_description
      //     } else {
      //       this.error = error.json().error.replace("_", " ")
      //     }

      //     this.eheader = error.statusText
      //     if (error.url == null) {
      //       this.error = "Check your internet connection"
      //     }
      //     else if (error.status == 400) {
      //       this.error = "Confirm email and password"
      //     }
      //   }
      //   else {
      //     this.eheader = "No Connection"
      //     this.error = "Make sure you have a working internet connection"
      //   }

      //   console.log("haha", error)

      // })
    }
    else {
      console.log("both must be present")
    }

  }

  gototab() {
    this.ldpresent("Fetching data ..")
    this.account.getauth()
    this.storage.get("user").then((data) => {
      this.account.profile().then((data) => {
        console.log("dumm", data);
        let us: any = {}
        this.loader.dismiss();
        this.gotoPage(data.profile)
        // this.storage.set("profile", data.profile)
        // this.storage.set("subjects", data.subjects)
        // this.storage.set("reasons", data.reasons)
        // this.storage.set("teachers", data.teachers)
        // this.storage.set("classes", data.classes).then(() => {
        //   this.loader.dismiss();
        //   this.gotoPage(data.profile)
        // })
      }, (error) => {
        this.loader.dismiss();
        console.log("this ***", error)
        if (error != null) {
          if (error.error_description) {
            this.error = error.data.error_description
          } else {
            if (error.json().error) {
              this.error = error.data.error.replace("_", " ")
            }

          }

          this.eheader = error.statusText
        }
        else {
          this.eheader = "No Connection"
          this.error = "Make sure you have a working internet connection"
        }


        this.storage.remove("user");
      });
    })

  }

}