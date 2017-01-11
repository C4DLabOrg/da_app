import { Component,OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';
import {Storage} from '@ionic/storage'

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage implements OnInit {
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


}
