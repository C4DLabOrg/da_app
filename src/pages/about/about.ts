import { Component, OnInit } from '@angular/core';

import { NavController, AlertController, PopoverController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { AccountService } from '../login/account.services'
import { TakeAttendance } from '../home/takeattendance'
import { Classes, Student } from '../home/classes'
import { ClassPopoverPage } from "../home/classpopover.component"
// import { CallNumber } from '@ionic-native/call-number';
declare var window;
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
 // providers:[CallNumber]

})
export class AboutPage implements OnInit {
  user: any
  takeattendance = new TakeAttendance()
  selectedclass: Classes
  classes: Classes[]
  index: number = 0
  toast: any
  constructor(public navCtrl: NavController, private account: AccountService,
    private popoverCtrl: PopoverController,
    private storage: Storage, private alertctrl: AlertController,
    // private call: CallNumber,
    private toastctrl: ToastController) {

  }
  ngOnInit() {
    this.getprofile()
    this.getclasses()
    this.onStudentsChange()
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
    this.account.newclasslist$.subscribe((data) => {
      this.getclasses()

    });
  }
  getclasses() {
    this.storage.get("classes").then((data) => {
      this.classes = data
       if(this.classes.length>0){
          this.selectclass(0)
      }
    
    })
  }
  showtoast(message: string, position: string) {
    if (this.toast) {
      if (this.toast.position == position) {
        this.toast.dismiss()
      }

    }
    this.toast = this.toastctrl.create({
      message: message,
      duration: 3000,
      position: position
    });
    this.toast.onDidDismiss(() => {
      this.toast = null
    });

    this.toast.present()
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
    if (student.guardian_phone) {
      let confirm = this.alertctrl.create({
        title: 'Call  Guardian',
        message: 'Place a call to ' + student.guardian_name + " ?",
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
              this.makecall(student.guardian_phone)
              console.log('Agree clicked');
            }
          }
        ]
      });
      confirm.present();
    }
    else {
      this.showtoast("No Contact information Found", "bottom")

    }
  }
  makecall(phone: string) {
      // this.call.callNumber(phone, true)
      //   .then(() => console.log('Launched dialer!'))
      //   .catch(() => console.log('Error launching dialer'));
       window.location = "tel:"+phone;

  }
  callIT(passedNumber){
    //You can add some logic here
    
    }



}
