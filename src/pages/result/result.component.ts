import { Component, OnInit, AfterViewInit } from '@angular/core';

import { NavController,NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import {TakeAttendance} from '../home/takeattendance'
import {Student} from '../home/classes'
import {AbsencePage} from '../absence/absence.component'

@Component({
  selector: 'page-result',
  templateUrl: 'result.component.html'
})
export class ResultPage implements AfterViewInit {
  user: any
  options: any
  attendance:TakeAttendance
  teacher:any
  
  absent_students:Student[]
  constructor(public navCtrl: NavController,
   private storage: Storage,private navparams:NavParams) {

  }
  getuser(){
    this.storage.get("profile").then((data)=>{
      this.teacher=data
    })
  }

  absence(){
    this.navCtrl.push(AbsencePage,{"absent_students":this.absent_students})   
  }

  ngAfterViewInit() {
    this.getuser()
    this.attendance=this.navparams.get("attendance");
    this.absent_students=this.navparams.get("response")
    let data=[]
    data.push({name:"Present",y:this.attendance.present.length})
    data.push({name:"Absent",y:this.attendance.absent.length})
    //console.log(data)
    this.options = {
      chart: { type: 'pie' },
      title: { text: '' },
      series:[{name:"Attendance",data:data}],
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


}
