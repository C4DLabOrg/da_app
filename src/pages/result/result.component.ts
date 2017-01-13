import { Component, OnInit, AfterViewInit } from '@angular/core';

import { NavController,NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'

@Component({
  selector: 'page-result',
  templateUrl: 'result.component.html'
})
export class ResultPage implements AfterViewInit {
  user: any
  options: any
  constructor(public navCtrl: NavController,
   private storage: Storage,private navparams:NavParams) {

  }
  ngAfterViewInit() {
    
    this.options = {
      chart: { type: 'pie' },
      title: { text: 'dynamic data example' },
      series: [{ data: [{name:"one",y:2},{name:"two",y:3}] }],
    };
  }


}
