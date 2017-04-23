import { Component, OnInit } from '@angular/core';
import { ClassPopoverPage } from '../../home/classpopover.component'
import { NavController, PopoverController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { AccountService } from '../../login/account.services'
import { Classes } from '../../home/classes'
import { Report } from './report'
@Component({
  selector: 'page-about',
  templateUrl: 'reports.html'
})
export class HDReportPage implements OnInit {
  user: any
  index: number = 0
  classes: Classes[]
  event: string
  resp: Report
  options: any
  options2: any
  loader: any
  if_report:boolean=false
  selectedclass: Classes
  constructor(public navCtrl: NavController,
    private storage: Storage, private account: AccountService,
    private popoverCtrl: PopoverController,
    private loaderctrl: LoadingController,
    private alertctrl: AlertController) {

  }
  ngOnInit() {
    this.getprofile()
    this.getclasses()
    this.event = new Date().toISOString()
  }
  datechange(value) {
    console.log(this.event)
    this.getreports()
  }
  showloader(message) {
    this.loader = this.loaderctrl.create({
      content: message
    });

    this.loader.present();
  }

  getprofile() {
    this.storage.get("profile").then((data) => {
      this.user = data
    })
  }
  graph(resp) {
     let data = []
     let data2 = []
    if (resp.length > 0) {
      this.if_report=true
      this.resp = resp[0]
      data.push({ name: "Present Males", y: this.resp.present_males })
      data.push({ name: "Absent Males", y: this.resp.absent_males })
      data.push({ name: "Present Females", y: this.resp.present_females })
      data.push({ name: "Absent Females", y: this.resp.absent_females })
      
      data2.push({ name: "Students Present", y: this.resp.present_females + this.resp.present_males })
      data2.push({ name: "Students Absent", y: this.resp.absent_females + this.resp.absent_males })
      //console.log(data)
    }
    else {
      this.if_report=false
      this.showalert("No Reports", "Attendance was not taken for this day")
    }
    this.options = {
      chart: { type: 'pie' },
      title: { text: '' },
      series: [{ name: "Attendance", data: data }],
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
           showInLegend: false,
          dataLabels: {
            enabled: true,
            distance: -30,
           // format: '<b>{point.name}</b>: {point.percentage:.1f} %',
           format: '{point.percentage:.1f} %',

          }
        }
      },
    };
    this.options2 = {
      chart: { type: 'pie' },
      title: { text: '' },
      series: [{ name: "Attendance", data: data2 }],
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
         
          dataLabels: {
            enabled: false,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',

          }
        }
      },
    };

  }
  selectclass(id) {
    this.selectedclass = this.classes[id]
    for (let i = 0; i < this.selectedclass.students.length; i++) {
      this.selectedclass.students[i].status = false
    }
    this.getreports()
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
  getclasses() {
    this.storage.get("classes").then((data) => {
      this.classes = data
      //Add the class to represent all the classes 
      let cl=new Classes()
      cl.id=0
      cl.class_name="All Classes"
      cl.students=[]
      this.classes.unshift(cl);
      console.log(this.classes);
      this.selectclass(0)
    })
  }
  showalert(title, message) {
    let alert = this.alertctrl.create({
      title: title,
      subTitle: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  getreports() {
    this.showloader("Generating reports")
    let id:any=this.selectedclass.id
    //IF id ==0 it means it represents all the classes thus set it to ""
    if(id==0)id="";
    this.account.getreport(id, this.event.split("T")[0]).then((resp) => {
      this.loader.dismiss();
      console.log(resp)
      this.resp=resp
      this.graph(resp)

    }, (error) => {
      this.loader.dismiss();
      if (error.url == null) {
        this.showalert("NO Internet Connection", "Turn on your wifi or data")
      }
      console.log(error)
      console.log(error)
    })
  }



}
