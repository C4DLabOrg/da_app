import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../login/account.services'
import { TakeAttendance } from '../../home/takeattendance'
import { Classes } from '../../home/classes'
import { ClassPopoverPage } from '../../home/classpopover.component'
import {  AddClassModal} from './addclass'
import { NavController, ToastController, AlertController, PopoverController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage'


@Component({
  selector: 'page-classes',
  templateUrl: 'classes.html'
})                                                        
export class HDClassesPage implements OnInit {

  content: any
  text: any
  classes:Classes[]
  load: boolean = false
  index: number = 0
  event: string
  takeattendance = new TakeAttendance()

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
      console.log("removing from ...")
      let clindex = this.classes.indexOf(this.classes.filter(cl => cl.id === student.class_id)[0])
      let theclass = this.classes[clindex]
      let studindex = theclass.students.indexOf(theclass.students.filter(stud => stud.id === student.id)[0])
      theclass.students.splice(studindex, 1)
      this.classes[clindex] = theclass
    })
    this.account.newclasslist$.subscribe((data) => {
      this.getclasses()
    });
  }
  datechange(value) {
    console.log(this.event)
  }
  presentModal(student, type) {
    // if (student == 'a') {
    //   let modal = this.modalctrl.create(AddTeacherModal, { type: type,class:this.selectedclass.id });
    //    modal.present();
    // } else {
    //   let modal = this.modalctrl.create(AddTeacherModal, { student: student, type: type,class:this.selectedclass.id });
    //    modal.present();
    // }
   
  }
  showtoast(name: string, status: boolean) {
    if (this.toast) {
      this.toast.dismiss()
    }
    let message =name
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
    })
  }



  attendance() {

  }

}