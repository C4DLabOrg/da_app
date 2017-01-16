import { Component,OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';
import {Storage} from '@ionic/storage'

@Component({
  selector: 'absence-about',
  templateUrl: 'absence.component.html'
})
export class AbsencePage{
  user:any
  constructor(public navCtrl: NavController,private storage:Storage) {

  }
}
