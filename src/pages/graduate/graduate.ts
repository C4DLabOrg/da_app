import Moment from 'moment';
import { AccountService } from './../login/account.services';
import { Storage } from '@ionic/storage';
import { Classes, PromoteStream } from './../home/classes';
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
  profile: any
  config_saved: boolean = false
  promote_school: any
  year: any = Moment().subtract(6, "months").year()
  constructor(public navCtrl: NavController,
    private storage: Storage,
    private alertctrl: AlertController,
    private account: AccountService,
    public navParams: NavParams, public alertCtrl: AlertController) {
  }
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getclasses()
    this.initmethods()
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
      let nx = {} as any
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
          var nxt = JSON.parse(data);
          let next_c = {} as any
          ///Class selected in the radio button value 
          next_c.next_class = nxt.id
          next_c.next_class_name = nxt.class_name
          next_c.prev_class = this.classes[ind].id
          this.classes[ind].next_class = next_c

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
    this.account.storagetprofile().then(data => {
      this.profile = data
    })

  }
  initmethods() {

    this.account.storagegetpromotion().then(data => {
      if (data && data.year == this.year) {
        this.promote_school = data

        this.updateclassesnext(data.stream_promotions)
      }
    });

  }
  promote(status) {
    let schoolpromote = {} as any
    schoolpromote.school = this.profile.school
    schoolpromote.year = Moment().subtract(6, "months").year()
    schoolpromote.stream_promotions = []
    var notselected = []
    for (var i in this.classes) {
      let cl = this.classes[i]
      if (cl.next_class) {
        var promotestream = new PromoteStream()
        promotestream = cl.next_class
        // promotestream.prev_class = cl.id
        schoolpromote.stream_promotions.push(promotestream)
      }
      else {
        //Ignore class 8 Streams
        if (cl._class != "8") {
          notselected.push(cl)
        }

      }

    }
    if (notselected.length < 1) {
      if (status == "new") {
        this.dopromote(schoolpromote)
      }
      else if (status == "update") {
        console.log(schoolpromote)
        this.doupdate(schoolpromote)
      }

    }
    else {
      this.account.presentAlert("Not Complete", "Some classes have not been selected for promotion.");
    }

    console.log(schoolpromote);

  }
  updateclassesnext(resp) {
    for (var i in this.classes) {
      var cl = this.classes[i]
      var updated = resp.filter(c => c.prev_class == cl.id)
      if (updated.length > 0) {
        console.log(updated)
        this.classes[i].next_class = updated[0]
      }
    }
  }
  doupdate(schoolpromote) {
    this.account.loaderpresent("")
    this.account.updatepromotion(this.promote_school.id, schoolpromote).subscribe(resp => {
      console.log(resp)
       this.account.loaderdismiss()
      this.promote_school = resp
      this.updateclassesnext(resp.stream_promotions)
      this.account.presentAlert("Successful", "Update was successful")

    }, error => {
       this.account.loaderdismiss()
      console.log(error)
      if (error.url = null) {
        this.account.presentAlert("No Internet Connection", "Turn on Wifi or Data")
      }
      else if (error.detail) {
        this.account.presentAlert("Failed", error.detail)
      }
      else {
        this.account.presentAlert("Failed", "Make sure you an internet connection.")
      }
    });

  }
  dopromote(schoolpromote) {
    this.account.loaderpresent("")
    this.account.createpromotion(schoolpromote).subscribe(resp => {
      console.log(resp)
       this.account.loaderdismiss()
      this.promote_school = resp
      this.updateclassesnext(resp.stream_promotions)
      this.account.presentAlert("Confirmation", "Promotions looks ok. If no update is required , Complete promotion")

    }, error => {
       this.account.loaderdismiss()
      console.log(error)
      if (error.url = null) {
        this.account.presentAlert("No Internet Connection", "Turn on Wifi or Data")
      }
      else if (error.non_field_errors) {
        this.account.presentAlert("Failed", error.non_field_errors)
      }
      else {
        this.account.presentAlert("Failed", "Make sure you an internet connection.")
      }
    });

  }
  completeConfirm(action) {
    let confirm = this.alertctrl.create({
      title: action + ' Promotions',
      message: 'This might not be reversible',
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
            this.docomplete(action)
          }
        }
      ]
    });
    confirm.present();
  }
  docomplete(action) {
    this.account.loaderpresent("")
    this.account.completepromotion(this.promote_school.id, { "action": action })
      .subscribe(resp => {
        this.account.loaderdismiss()
        this.promote_school = resp
        this.storage.get("classes").then(data => {
          this.classes = data
          this.updateclassesnext(resp.stream_promotions)
        });

      }, error => {
        this.account.loaderdismiss()
        console.log(error)
        if (error.url = null) {
          this.account.presentAlert("No Internet Connection", "Turn on Wifi or Data")
        }
        else if (error.non_field_errors) {
          this.account.presentAlert("Failed", error.non_field_errors)
        }
        else if (error.detail) {
          this.account.presentAlert("Failed", error.detail)
        }
        else {
          this.account.presentAlert("Failed", "Make sure you an internet connection.")
        }
      });

  }

}
