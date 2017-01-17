import { Component,OnInit } from '@angular/core';

import { NavController,NavParams,AlertController } from 'ionic-angular';
import {Storage} from '@ionic/storage'
import {Student} from '../home/classes'

@Component({
  selector: 'absence-about',
  templateUrl: 'absence.component.html'
})
export class AbsencePage implements OnInit{
  user:any
  absent_students:Student[]
  selected_student:Student
  constructor(public navCtrl: NavController,private storage:Storage,
  private navparams:NavParams, public alertCtrl: AlertController) {
    this.absent_students=this.navparams.get("absent_students");
    this.selectstudent(0)
    console.log(this.selected_student)
  }
  ngOnInit(){
    this.selected_student=this.absent_students[0]
  }
  selectstudent(ind){
    this.selected_student=this.absent_students[ind]
  }

  showConfirm(){

      let confirm = this.alertCtrl.create({
      title: 'Use this lightsaber?',
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }



}
