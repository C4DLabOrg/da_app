import { AccountService } from './../login/account.services';
import { Student } from './../home/classes';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DeleteReasonPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-delete-reason',
  templateUrl: 'delete-reason.html',
})
export class DeleteReasonPage {
    student:any
    reason:any
    other_reason:string=''
  constructor(public navCtrl: NavController,
    private account:AccountService,
     public navParams: NavParams) {
    this.student=navParams.get("student")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeleteReasonPage');

  }
  deletestudent() {
    var reas=""
    reas=this.reason
    if (this.reason=="other"){
      reas=this.other_reason
    }
    this.account.loaderpresent("")
    this.account.deletestudent(this.student, reas).then((resp) => {
      this.account.loaderdismiss()
      this.navCtrl.pop()
    }, (error) => {
      this.account.loaderdismiss()      
      console.log(JSON.stringify(error))
    })
    
  }
}
