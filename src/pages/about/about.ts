import { Component, OnInit } from '@angular/core';

import { NavController, AlertController, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { AccountService } from '../login/account.services'
import { TakeAttendance } from '../home/takeattendance'
import { Classes, Student } from '../home/classes'
import { ClassPopoverPage } from "../home/classpopover.component"
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  providers: [CallNumber]
})
export class AboutPage implements OnInit {
  user: any
  takeattendance = new TakeAttendance()
  selectedclass: Classes
  classes: Classes[]
  index: number = 0
  constructor(public navCtrl: NavController, private account: AccountService,
    private popoverCtrl: PopoverController,
    private storage: Storage, private alertctrl: AlertController, private call: CallNumber) {

  }
  ngOnInit() {
    this.getprofile()
    this.getclasses()

  }
  getprofile() {
    this.storage.get("profile").then((data) => {
      this.user = data
    })
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

    this.account.studentDelete$.subscribe((student) => {
      let clindex = this.classes.indexOf(this.classes.filter(cl => cl.id === student.class_id)[0])
      let theclass = this.classes[clindex]
      let studindex = theclass.students.indexOf(theclass.students.filter(stud => stud.id === student.id)[0])
      theclass.students.splice(studindex, 1)
      this.classes[clindex] = theclass
    })
  }
  getclasses() {
    this.storage.get("classes").then((data) => {
      this.classes = data
      this.selectclass(0)
    })
  }
  selectclass(id) {
    this.selectedclass = this.classes[id]
    for (let i = 0; i < this.selectedclass.students.length; i++) {
      this.selectedclass.students[i].status = false
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
  callConfirm(student: Student) {
    let confirm = this.alertctrl.create({
      title: 'Call  Guardian',
      message: 'Do you want Call to ' + student.student_name,
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
            this.makecall(student.fstname)
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
  makecall(phone: string) {
    this.call.callNumber('0727290364', true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));

  }


}
