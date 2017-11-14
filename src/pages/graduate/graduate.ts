import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the GraduatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-graduate',
  templateUrl: 'graduate.html',
})
export class GraduatePage {

  testRadioOpen: boolean;
  testRadioResult;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  showCheckbox() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Promote to');

    alert.addInput({
      type: 'radio',
      label: 'Class 2 East',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Class 2 West',
      value: 'value2'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.testRadioOpen = false;
        this.testRadioResult = data;
      }
    });
    alert.present();
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Undo Promotion',
      message: 'Are you sure you want to undo promoting students to next class?',
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad GraduatePage');
  }

}
