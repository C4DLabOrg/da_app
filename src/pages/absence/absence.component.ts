import { Component, OnInit } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { Student } from '../home/classes'
import { AccountService } from '../login/account.services'


@Component({
  selector: 'absence-about',
  templateUrl: 'absence.component.html'
})
export class AbsencePage implements OnInit {
  user: any
  absent_students: Student[]
  selected_student: Student
  reasons: any
  load: boolean = false
  student_reasons: any = []
  index: number

  constructor(public navCtrl: NavController, private storage: Storage,
    private navparams: NavParams, public alertCtrl: AlertController, private account: AccountService) {
    this.absent_students = this.navparams.get("absent_students");
    this.selectstudent(0)
    console.log(this.selected_student)
  }
  ngOnInit() {
    this.getreasons()
  }
  selectstudent(ind) {
    this.index = ind
    this.selected_student = this.absent_students[ind]
    this.getreasons()
    this.student_reasons = []
  }
  nextstudent() {
    this.selectstudent(this.index + 1)
  }
  getreasons() {
    this.storage.get("reasons").then((data) => {
      // console.log(data)
      this.reasons = data
    })

  }
  onchange(val, id, index) {

    if (val) {
      this.student_reasons.push(id)
    }
    else {
      this.student_reasons.splice(index, 1)

    }
  }


  showConfirm() {
    if (this.student_reasons.length == 0) {
      let confirm = this.alertCtrl.create({
        title: 'Mark attendance',
        message: 'You have not submitted a reason for absence for this student, are you sure you want to go to the next student?',
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
              if (this.absent_students.length - 1 == this.index) {
                   this.navCtrl.pop()
              }
              else {
                this.nextstudent()
              }

              console.log('Agree clicked');
            }
          }
        ]
      });
      confirm.present();
    }
    else {
      this.load = true
      this.account.updateabsence(this.selected_student.id, { "reasons": this.student_reasons, "status": false })
        .then((data) => {
          this.load = false
          console.log(data)
          if (this.absent_students.length - 1 == this.index) {
            this.navCtrl.pop()
          }
          else {
            this.nextstudent()
          }

        })
        .catch((error) => {
          this.load = false
          console.log(error)
        })
    }

  }
}


