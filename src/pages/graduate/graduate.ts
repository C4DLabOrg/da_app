import { Storage } from '@ionic/storage';
import { Classes } from './../home/classes';
import { Component, OnInit } from '@angular/core';
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
export class GraduatePage implements OnInit {

  testRadioOpen: boolean;
  testRadioResult;
  classes: Classes[]


  constructor(public navCtrl: NavController,
    private storage: Storage,
    public navParams: NavParams, public alertCtrl: AlertController) {
  }
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getclasses()
  }

  showCheckbox(ind) {
    var cl = this.classes[ind]
    let alert = this.alertCtrl.create();
    alert.setTitle('Promote to');

    // alert.addInput({
    //   type: 'radio',
    //   label: 'Class 2 East',
    //   value: 'value1',
    //   checked: true
    // });
    // console.log(cl)
    var nxt = parseInt(cl._class) + 1
    var cls = this.classes.filter(c => c._class === nxt.toString())

    for (var c in cls) {
      var ths = cls[c]
      // ch=  c == '0'?true:false
      let nx ={} as any
      nx._class = ths._class
      nx.id = ths.id
      nx.class_name = ths.class_name
      nx.studens_no = ths.students.length

      alert.addInput({
        type: 'radio',
        label: ths.class_name,
        value: JSON.stringify(nx),
        checked: c == '0' ? true : false
      })
    }

    alert.addButton('Cancel');
    if (cls.length > 0) {
      alert.addButton({
        text: 'OK',
        handler: data => {
          // this.testRadioOpen = false;
          // this.testRadioResult = data;
          this.classes[ind].next_class = JSON.parse(data)

        }
      });
    }

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
  getclasses() {
    this.storage.get("classes").then((data) => {
      this.classes = data
    })
  }

}
