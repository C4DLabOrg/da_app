import { Component, OnInit } from '@angular/core';

import { NavController, PopoverController, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { Classes } from './classes'
import { ClassPopoverPage } from './classpopover.component'
import { TakeAttendance } from './takeattendance'
import { AccountService } from '../login/account.services'
import { ResultPage } from '../result/result.component'
import { DatePipe } from '@angular/common'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class AttendancePage implements OnInit {
  content: any
  text: any
  classes: Classes[]
  load: boolean = false
  index: number = 0
  event: string
  takeattendance = new TakeAttendance()
  selectedclass: Classes
  toast: any
  confirm: any
  mindate: string = this.addDays(new Date(), 14)
  maxdate: string = new Date().toISOString()
  constructor(public navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private storage: Storage, private account: AccountService,
    private toastctrl: ToastController, private alertctrl: AlertController) {

  }
  addDays(theDate, days) {
    return new Date(theDate.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  }
  ngOnInit() {
    this.getclasses()
    this.event = new Date().toISOString()
    this.onStudentsChange()
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
  }
  datechange(value) {
    this.clearattendance()
    console.log(this.event)
  }
  showtoast(name: string, status: boolean) {
    if (this.toast) {
      this.toast.dismiss()
    }
    let message = ""
    if (status) {
      message = name + "  is Present";
    }
    this.toast = this.toastctrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    this.toast.onDidDismiss(() => {
      this.toast = null
    });

    this.toast.present()
  }
  onchange(val, name) {
    console.log(val)
    if (val) {
      this.showtoast(name, val)
    }
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
  clearattendance() {
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
  confirmattendance() {
    let mm = ""
    if (this.selectedclass) {
      this.takeattendance.absent = []
      this.takeattendance.present = []
      let students = this.selectedclass.students
      for (let i = 0; i < students.length; i++) {
        let stud = students[i]
        if (stud.status) {
          this.takeattendance.present.push(stud.id)
        } else {
          this.takeattendance.absent.push(stud.id)
        }
      }
    }
    if (this.takeattendance.absent.length == 0) {
      mm = "None"
    }
    else if (this.takeattendance.absent.length == this.selectedclass.students.length) {
      mm = "All"
    }
    else {
      mm = this.takeattendance.absent.length.toString()
    }
    console.log(this.selectclass.name)
    let confirm = this.alertctrl.create({
      title: 'Take attendance ?',
      message: 'Take <b>' + this.selectedclass.class_name + "</b> attendance " +
      "<br> with <b>" + mm + "  students absent </b> <br>" +
      " <b>" + new Date(this.event).toDateString() + "</b>",
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
            this.attendance()
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
  attendance() {
    if (this.selectedclass) {
      this.load = true
      this.takeattendance.absent = []
      this.takeattendance.present = []
      let students = this.selectedclass.students
      for (let i = 0; i < students.length; i++) {
        let stud = students[i]
        if (stud.status) {
          this.takeattendance.present.push(stud.id)
        } else {
          this.takeattendance.absent.push(stud.id)
        }
      }
      //  console.log(this.takeattendance)
      this.takeattendance.date = this.event.split("T")[0]
      this.takeattendance.class_name = this.selectedclass.class_name
      this.account.takeattendance(this.takeattendance).then((response) => {

        this.load = false
        this.clearattendance()
        //   console.log(response)
        this.navCtrl.push(ResultPage, { "attendance": this.takeattendance, "response": response })
      }, (error) => {
        this.load = false
        console.log(error)
      })
    }
    else {
      //console.log("No selected class")
    }
  }




}

