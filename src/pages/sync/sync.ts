import { Component, OnInit } from '@angular/core';
import { AccountService } from '../login/account.services'
import { NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Offline } from '../login/offline'

@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html'
})
export class HDSync implements OnInit {
  offlines: Offline[]
  load: boolean=false
  alert: any
  comp:number=0
  constructor(public navCtrl: NavController, private alertctrl: AlertController,
    private storage: Storage, private account: AccountService) {

  }
  ngOnInit() {
    this.getoffline()
    this.account.newofflineattendance$.subscribe((data)=>{
      this.getoffline()
    })
  }
  getoffline() {
    this.storage.get("offline").then((data) => {
      if(data==null){
        data=[]
      }
      console.log(data)
      this.offlines = data
    });
  }
  showalert(title, message) {
    if (this.alert) {
      this.alert.dismiss()
    }
    this.alert = this.alertctrl.create({
      title: title,
      subTitle: message,
      buttons: ['Dismiss']
    });
    this.alert.present();
  }
  sync() {
    this.load=true
    let d = this.offlines.length
    this.comp=0
    for (let i = 0; i < this.offlines.length; i++) {
      console.log("Starting ...",i)
      this.account.sync(this.offlines[i], i).then((data) => {
        //this.offlines.splice(i, 1)
        this.comp++;
        if(d ==this.comp){
          this.load=false
          this.storage.set("offline",[])
          this.offlines=[]
          console.log("Done syncing..",i)
        }
       
      }, (error) => {false
         this.load=false
        if (error.url == null) {
          this.showalert("No Internet Connection", "Turn on wifi or data")
        }
        console.log(error)
      });
    }
  }

}
