import { AccountService } from './../login/account.services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Student } from './../home/classes';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Addsection2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-addsection2',
  templateUrl: 'addsection2.html',
})
export class Addsection2Page {
  student: Student
  updateform: FormGroup
  load:boolean=false
  constructor(public navCtrl: NavController,
  private account:AccountService,
   public navParams: NavParams, private formBuilder: FormBuilder) {
    this.student = navParams.get("student")
    this.updateform = this.formBuilder.group({
      mode_of_transport: ['', Validators.required],
      time_to_school: ['', Validators.required],
      stay_with: ['', Validators.required],
      household: ['', Validators.required],
      meals_per_day: ['', Validators.required],
    });
    this.updateform.setValue({
      mode_of_transport: this.student.mode_of_transport,
      stay_with: this.student.stay_with,
      time_to_school: this.student.time_to_school,
      household: this.student.household,
      meals_per_day: this.student.meals_per_day
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Addsection2Page');
  }
   updatestudent() {
        this.load = true
        var data=this.updateform.value
        this.account.updatestudent(this.student.id, data, this.student).then((resp) => {
            this.load = false
            console.log("Updated student", resp)
            // this.dismiss()
            this.goback()
        }, (error) => {
            this.load = false
            console.log(JSON.stringify(error))
        })
    }
    goback(){
      this.navCtrl.pop().then(()=>{
        this.navCtrl.pop()
      });
    }

}
