import Moment from 'moment';
// import { Moment } from 'moment';
import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { Classes } from './classes'
import { ClassPopoverPage } from './classpopover.component'
import { TakeAttendance } from './takeattendance'
import { AccountService } from '../login/account.services'
import { ResultPage } from '../result/result.component'
import { DatePipe } from '@angular/common'

// import { DatePicker } from 'ionic2-date-picker/ionic2-date-picker'
// import { DatePicker} from "../ionic2-date-picker/date-picker";
import { DatePicker } from '@ionic-native/date-picker';

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
  attendancetaken: boolean = false
  mindate: string = this.addDays(new Date(), 14)
  maxdate: string = this.addDays(new Date(), -1)
  constructor(public navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private storage: Storage, private account: AccountService,
    private toastctrl: ToastController, private alertctrl: AlertController,
    public datePicker: DatePicker
  ) {

  }
  djangodate(date) {
    // let d = new Date(date)
    // let g = d.toLocaleDateString()
    // let f = g.split("/")
    // return f[2] + "-" + f[0] + "-" + f[1]
    return Moment(date).format("YYYY-MM-DD")
  }
  addDays(theDate, days) {
    return new Date(theDate.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  }
  ngOnInit() {
    //My
    this.getclasses()
    this.event = new Date().toISOString()
    this.onStudentsChange()
    this.initiatesync()

    // this.datePicker.onDateSelected.subscribe(
    //   (date) => {
    //     this.datechange(date)
    //     console.log("Date changed ", date);
    //   });
  }

  initiatesync() {
    this.account.startsync()
    this.account.updateStatus$.subscribe((message) => {
      console.log(message);
      this.showtoast(message, false, "top")
    })
    //  this.account.saveattendancehostory()
  }
  simupdate() {
    this.account.startsync()
  }

  onStudentsChange() {
    this.account.studentsChange$.subscribe((student) => {
      let clindex = this.classes.indexOf(this.classes.filter(cl => cl.id === student.class_id)[0])
      let theclass = this.classes[clindex]
      let studs = theclass.students.filter(stud => stud.id === student.id)
      if (studs.length > 0) {
        let studinedx = theclass.students.indexOf(studs[0])
        theclass.students[studinedx] = student
        theclass.students.sort(function (a, b) {
          if (a.gender > b.gender) return -1;
          if (a.gender < b.gender) return 1;
          return 0;
        });
      }
      else {
        theclass.students.push(student)
        theclass.students.sort(function (a, b) {
          if (a.gender > b.gender) return -1;
          if (a.gender < b.gender) return 1;
          return 0;
        });
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
      console.log("new list");
    });
    this.account.classeschange$.subscribe((data) => {
      this.getclasses()
    });
  }
  getclassattendance() {

  }
  datechange(value) {
    let d = new Date(value)
    this.event = d.toDateString()
    console.log(d.toDateString(), d.toUTCString(), d.toLocaleDateString());
    this.clearattendance()
    console.log(this.event)
  }
  showtoast(name: string, status: boolean, position: string) {
    if (this.toast) {
      if (this.toast.position == position) {
        this.toast.dismiss()
      }

    }
    let message = ""
    if (status) {
      message = name + "  is Present";
    }
    else {
      message = name
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
  onchange(val, name) {
    console.log(val)
    if (val) {
      this.showtoast(name, val, "bottom")
    }
  }

  getclasses() {
    this.storage.get("classes").then((data) => {
      this.classes = data
      if (this.classes.length > 0) {
        this.selectclass(0)
      }

    })
  }
  selectclass(id) {
    this.selectedclass = this.classes[id]
    this.clearattendance()
  }
  clearattendance() {
    if (this.classes.length > 0) {
      this.storage.get(this.selectedclass.class_name).then((data: TakeAttendance[]) => {
        data == null ? data = [] : data = data;
        let takenattendances = data.filter(att => att.date == this.djangodate(this.event)).filter(att => att.class_name == this.selectedclass.class_name)
        if (takenattendances.length > 0) {
          this.attendancetaken = true
          let attend = takenattendances[0] as TakeAttendance
          for (let i = 0; i < this.selectedclass.students.length; i++) {
            let student = this.selectedclass.students[i]
            let index = attend.present.indexOf(student.id)
            if (index == -1) {
              this.selectedclass.students[i].status = false
            }
            else {
              this.selectedclass.students[i].status = true
            }


          }

        }
        else {
          this.attendancetaken = false
          if (this.selectedclass.students) {
            for (let i = 0; i < this.selectedclass.students.length; i++) {
              this.selectedclass.students[i].status = false
            }
          }

        }


      })
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
      this.takeattendance.date = this.djangodate(this.event)
      this.takeattendance.class_name = this.selectedclass.class_name
      this.account.takeattendance(this.takeattendance).then((response) => {

        this.load = false
        this.attendancetaken = true
        // this.clearattendance()
        //   console.log(response)
        this.navCtrl.push(ResultPage, { "attendance": this.takeattendance, "response": response })
      }, (error) => {
        this.load = false
        console.log(JSON.stringify(error))
      })
    }
    else {
      //console.log("No selected class")
    }
  }


  showCalendar() {
    // this.datePicker.showCalendar(this.djangodate(this.event));
    // alert(this.mindate+" "+this.maxdate);
    let mindate = Moment(this.mindate).locale('de').toDate();
    let maxdate = Moment(this.maxdate).locale('de').toDate();
    this.datePicker.show({
      date: new Date(this.event),
      mode: 'date',
      minDate: Date.parse(this.mindate),
      maxDate: new Date(this.maxdate).valueOf(),
      // titleText: "Class Attendance Date Select ",
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date => {
        this.datechange(date)
        console.log('Got date: ', date)
      },
      err => console.log('Error occurred while getting date: ', err)
      );

  }


}

