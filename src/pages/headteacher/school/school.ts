import { Component, OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HDStudentPage } from '../students/students'
import { HDClassesPage } from '../classes/classes'
import { HDTeachersPage } from '../teachers/teachers'
import { AboutPage } from '../../about/about'
import {AccountService} from '../../login/account.services'

@Component({
  selector: 'page-about',
  templateUrl: 'school.html'
})
export class HDSchoolPage implements OnInit {
  user: any
  schoolinfo: any
  is_headteacher:boolean=false
  constructor(public navCtrl: NavController, 
  private storage: Storage,private account:AccountService) {

  }
  ngOnInit() {
    this.getprofile()
    this.getschoolinfo()
    this.onnewlist()
  }
  onnewlist(){
    this.account.newclasslist$.subscribe((data)=>{
      this.getschoolinfo()
    });
  }
  getprofile() {
    
    this.storage.get("profile").then((data) => {
      this.user = data
      this.is_headteacher=this.user.headteacher
      console.log(this.is_headteacher)
    })
  }
  getschoolinfo() {
    this.storage.get("schoolinfo").then((data) => {
      this.schoolinfo = data
    })
  }
  students() {
    this.navCtrl.push(HDStudentPage)
  }
  studentdetails() {
    this.navCtrl.push(AboutPage)
  }
  teachers() {
    this.navCtrl.push(HDTeachersPage)
  }
  goclasses() {
    this.navCtrl.push(HDClassesPage)
  }


}
