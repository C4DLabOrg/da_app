import { Component,OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';
import {Storage} from '@ionic/storage';
import { HDStudentPage} from '../students/students'
import {HDClassesPage} from '../classes/classes'
import {HDTeachersPage} from '../teachers/teachers'
import {AboutPage} from '../../about/about'

@Component({
  selector: 'page-about',
  templateUrl: 'school.html'
})
export class HDSchoolPage implements OnInit {
  user:any
  constructor(public navCtrl: NavController,private storage:Storage) {

  }
  ngOnInit(){
    this.getprofile()
  }
  getprofile(){
    this.storage.get("profile").then((data)=>{
      this.user=data
    })
  }

   students(){
    this.navCtrl.push(HDStudentPage)
  }
   studentdetails(){
    this.navCtrl.push(AboutPage)
  }
    teachers(){
    this.navCtrl.push(HDTeachersPage)
  }
    goclasses(){
    this.navCtrl.push(HDClassesPage)
  }


}
