import { Component,OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';
import {Storage} from '@ionic/storage'

@Component({
  selector: 'page-result',
  templateUrl: 'result.component.html'
})
export class ResultPage{
  user:any
  constructor(public navCtrl: NavController,private storage:Storage) {

  }


}
