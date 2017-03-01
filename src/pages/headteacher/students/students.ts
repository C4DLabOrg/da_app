import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../login/account.services'
import { TakeAttendance } from '../../home/takeattendance'
import { Classes } from '../../home/classes'
import { ClassPopoverPage } from '../../home/classpopover.component'
import { AddStudentModal } from './addstudent'
import { NavController, ToastController, AlertController, PopoverController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage'

@Component({
  selector: 'page-students',
  templateUrl: 'students.html'
})
export class HDStudentPage implements OnInit {

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
  constructor(public navCtrl: NavController,
    private popoverCtrl: PopoverController, private modalctrl: ModalController,
    private storage: Storage, private account: AccountService,
    private toastctrl: ToastController, private alertctrl: AlertController) {

  }
  ngOnInit() {
    this.getclasses()
    this.event = new Date().toISOString()
  }
  datechange(value) {
    console.log(this.event)
  }
  presentModal(student, type) {
    if (student == 'a') {
      let modal = this.modalctrl.create(AddStudentModal, { type: type,class:this.selectedclass.id });
       modal.present();
    } else {
      let modal = this.modalctrl.create(AddStudentModal, { student: student, type: type,class:this.selectedclass.id });
       modal.present();
    }
   
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

  }

}
