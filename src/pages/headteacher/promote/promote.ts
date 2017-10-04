import { ClassPopoverPage } from './../../home/classpopover.component';
import { Storage } from '@ionic/storage';
import { Classes } from './../../home/classes';
import { TakeAttendance } from './../../home/takeattendance';
import { AccountService } from './../../login/account.services';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, PopoverController } from 'ionic-angular';


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
export class PromotePage implements OnInit {

  testRadioOpen: boolean;
  testRadioResult;
  user: any
  takeattendance = new TakeAttendance()
  selectedclass: Classes
  selectedclassid: any
  classes: Classes[]
  index: number = 0
  toast: any
  load: boolean = false
  markstatus: boolean = false

  constructor(public navCtrl: NavController,
    private account: AccountService, private storage: Storage,
    private popoverCtrl: PopoverController,
    private alertctrl: AlertController,
    public alerCtrl: AlertController, public navParams: NavParams) { }
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getprofile()
    this.getclasses()
    this.onStudentsChange()
  }
  doRadio(students) {
    if (this.classes && students.length > 0) {
      let alert = this.alerCtrl.create();
      alert.setTitle(' Move/Promote  students to Class ?');
      // alert.addInput({
      //   type: 'radio',
      //   label: '1 East',
      //   value: 'blue',
      //   checked: true
      // });
      for (var c in this.classes) {
        var cl = this.classes[c]
        // ch=  c == '0'?true:false
        if (this.selectedclass.id != cl.id) {
          alert.addInput({
            type: 'radio',
            label: cl.class_name,
            value: JSON.stringify(cl),
            checked: c == '0' ? true : false
          })
        }

      }
      alert.addButton('Cancel');
      alert.addButton({
        text: 'Ok',
        handler: data => {
          data = JSON.parse(data)
          console.log('Radio data:', data);
          this.testRadioOpen = false;
          this.testRadioResult = data;
          this.promoteconfirm(students, data);
        }
      });

      alert.present().then(() => {
        this.testRadioOpen = true;
      });
    }
    else {
      this.account.presentAlert("No Students", "Select atleast one student.")
    }
  }
  onchange(val, name) {

    console.log(val)

  }
  markstatuschange(val) {
    this.markstudents(val)
    // console.log(val)
  }
  promoteconfirm(students, _class: Classes) {

    let confirm = this.alertctrl.create({
      title: 'Move Students ?',
      message: 'Move <b>' + students.length + "</b> student" + (students.length > 1 ? 's' : '') + " from  <b>" + this.selectedclass.class_name + "</b> to  " +
      " <b> " + _class.class_name + " </b> ",
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
            let data = { "students": students, "class_id": _class.id }
            this.load = true
            this.account.movestudents(data).subscribe(resp => {
              this.load = false
              console.log(resp)
            }, error => {
              this.load = false
              console.log("error", error)
            })
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PromotePage');
  }
  onStudentsChange() {
    this.account.studentsChange$.subscribe((student) => {
      let clindex = this.classes.indexOf(this.classes.filter(cl => cl.id === student.class_id)[0])
      let theclass = this.classes[clindex]
      let studs = theclass.students.filter(stud => stud.id === student.id)
      if (studs.length > 0) {
        let studinedx = theclass.students.indexOf(studs[0])
        theclass.students[studinedx] = student
      }
      else {
        theclass.students.push(student)
      }

      this.classes[clindex] = theclass
    });
    this.account.newclasslist$.subscribe(data => {
      this.justgetclasses()
    });
  }
  getclasses() {
    this.storage.get("classes").then((data) => {
      this.classes = data
      if (this.classes.length > 0) {
        this.selectclass(0)
      }

    })
  }
  justgetclasses() {
    this.storage.get("classes").then((data) => {
      this.classes = data
      this.selectedclass=this.classes[this.selectedclassid]
      this.markstatus=false
    })
  }
  markstudents(status) {
    for (let i = 0; i < this.selectedclass.students.length; i++) {
      this.selectedclass.students[i].status = status
    }
  }
  selectclass(id) {
    this.markstatus = false
    this.selectedclass = this.classes[id]
    this.selectedclassid=id
    this.markstudents(false);
  }
  getprofile() {
    this.storage.get("profile").then((data) => {
      this.user = data
    })
  }
  promote() {
    let students = []
    if (this.selectedclass) {
      for (var d in this.selectedclass.students) {
        var stud = this.selectedclass.students[d]
        if (stud.status) {
          students.push(stud.id)
        }

      }
      this.doRadio(students)
      console.log(students)
    }
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ClassPopoverPage, { "classes": this.classes });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss((data) => {
      if (data != null) {
        this.index = data.id
        this.selectclass(data.id)
      }
    })
  }


}
