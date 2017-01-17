import { Component,OnInit } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import {Storage} from '@ionic/storage'


@Component({
  selector: 'absence-about',
  templateUrl: 'absence.component.html'
})
export class AbsencePage{
  user:any
  constructor(public navCtrl: NavController,private storage:Storage, public alertCtrl: AlertController) {

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
