import { Component, OnInit } from '@angular/core';

import { NavController, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { Classes } from './classes'
import { ClassPopoverPage } from './classpopover.component'
import {TakeAttendance} from './takeattendance'
import {AccountService} from '../login/account.services'
import {ResultPage} from '../result/result.component'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class AttendancePage implements OnInit {
  content: any
  text: any
  classes: Classes[]
  index: number = 0
  takeattendance=new TakeAttendance()
  selectedclass:Classes
  constructor(public navCtrl: NavController,
    private popoverCtrl: PopoverController,
     private storage: Storage,private account:AccountService) {

  }
  ngOnInit() {
    this.getclasses()
  }
  getclasses() {
    this.storage.get("classes").then((data) => {
      this.classes = data
      this.selectclass(0)
    })
  }
  selectclass(id){
    this.selectedclass=this.classes[id]
    for (let i=0;i<this.selectedclass.students.length;i++){
      this.selectedclass.students[i].status=true
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
  attendance(){
    if(this.selectedclass){
      this.takeattendance.absent=[]
      this.takeattendance.present=[]
      let students=this.selectedclass.students
      for(let i=0;i<students.length;i++){
        let stud=students[i]
        if(stud.status){
          this.takeattendance.present.push(stud.id)
        }else{
          this.takeattendance.absent.push(stud.id)
        }
      }
      console.log(this.takeattendance)
      this.account.takeattendance(this.takeattendance).then((response)=>{
          console.log(response)
          this.navCtrl.push(ResultPage)
      }).catch((er)=>{
          console.log(er)
      })
    }
    else{
      //console.log("No selected class")
    }
  }




}

