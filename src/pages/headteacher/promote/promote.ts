import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';


/**
 * Generated class for the PromotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-promote',
  templateUrl: 'promote.html',
})
export class PromotePage {

  testRadioOpen: boolean;
  testRadioResult;

  constructor(public navCtrl: NavController, public alerCtrl: AlertController,  public navParams: NavParams) {}

   doRadio() {
    let alert = this.alerCtrl.create();
    alert.setTitle('Promote / Move to Class');

    alert.addInput({
      type: 'radio',
      label: '1 East',
      value: 'blue',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: '1 West',
      value: 'green'
    });

    alert.addInput({
      type: 'radio',
      label: '2 East',
      value: 'red'
    });

    alert.addInput({
      type: 'radio',
      label: '2 West',
      value: 'yellow'
    });

    alert.addInput({
      type: 'radio',
      label: '3 East',
      value: 'purple'
    });

    alert.addInput({
      type: 'radio',
      label: '3 West',
      value: 'white'
    });

    alert.addInput({
      type: 'radio',
      label: '4 East',
      value: 'black'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log('Radio data:', data);
        this.testRadioOpen = false;
        this.testRadioResult = data;
      }
    });

    alert.present().then(() => {
      this.testRadioOpen = true;
    });
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromotePage');
  }

}
