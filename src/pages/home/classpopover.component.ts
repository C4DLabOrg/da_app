import {Component,} from '@angular/core'
import {ViewController,NavParams} from 'ionic-angular'
import {Classes} from './classes'

@Component({
  templateUrl:'classpopover.component.html'
})
export class ClassPopoverPage {
    classes:Classes[]
  constructor(public viewCtrl: ViewController,private params:NavParams) {
      this.classes=this.params.get("classes")
  }
    
  close(id) {
    this.viewCtrl.dismiss({"id":id});
  }ion
}