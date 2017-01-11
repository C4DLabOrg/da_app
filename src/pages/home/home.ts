import { Component, OnInit } from '@angular/core';

import { NavController, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { Classes } from './classes'
import { ClassPopoverPage } from './classpopover.component'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class AttendancePage implements OnInit {
  content: any
  text: any
  classes: Classes[]
  index: number = 0
  constructor(public navCtrl: NavController,
    private popoverCtrl: PopoverController, private storage: Storage) {

  }
  ngOnInit() {
    this.getclasses()
  }
  getclasses() {
    this.storage.get("classes").then((data) => {
      this.classes = data
    })
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ClassPopoverPage, { "classes": this.classes });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss((data) => {
      if (data != null) {
        this.index = data.id
      }
    })
  }




}

