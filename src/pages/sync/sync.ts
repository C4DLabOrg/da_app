import { Component, OnInit } from '@angular/core';
import { AccountService } from '../login/account.services'
import { NavController, AlertController, Alert, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Offline } from '../login/offline'
import { LocalNotifications, Network } from 'ionic-native';

@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html'
})
export class HDSync implements OnInit {
  offlines: Offline[]
  load: boolean = false
  alert: any
  comp: number = 0
  lastsync: Date
  connection: Boolean = false
  network: string
  navigator: any
  constructor(public navCtrl: NavController, private alertctrl: AlertController,
    private storage: Storage, private account: AccountService, private platform: Platform) {
    this.checkNetwork("n")
  }
  ngOnInit() {

    this.getoffline()
    this.account.newofflineattendance$.subscribe((data) => {
      this.getoffline()
    })

  }

  getoffline() {
    this.storage.get("lastsync").then((data) => {
      if (data == null) {
        this.lastsync = new Date()
      }
      else {
        this.lastsync = data
      }
    })
    this.storage.get("offline").then((data) => {
      if (data == null) {
        data = []
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
  cancellocalnot() {
    LocalNotifications.cancelAll()
  }
  checkNetwork(refresher) {

    this.connection = false
    this.account.ping().then((data) => {
      this.connection = true
      if (refresher != "n") {
        refresher.complete();
      }
    }, (error) => {
      if (refresher != "n") {
        refresher.complete();
      }
      this.connection = false
    })
  }
  showAlert() {
    this.storage.get("lastsyncdata").then((data) => {
      if (data == null) {
        data = []
      }
      console.log(data);
      let d: Offline[] = data
      let message = "<ion-list>"
      for (var i = 0; i < d.length; i++) {
        let cc = d[i] as Offline
        message += cc.attendance.class_name + "<small> &nbsp;(" + cc.attendance.date + ")</small><br> <small>Present="
        message += cc.attendance.present.length + " ,Absent="
        message += cc.attendance.absent.length + " </small><br><br>"

      }
      message += "</ion-list>"
      this.showalert("Last Sync", message);

    });
  }
  sync() {
    this.load = true
    let d = this.offlines.length
    this.comp = 0
    for (let i = 0; i < this.offlines.length; i++) {
      console.log("Starting ...", i)
      this.account.sync(this.offlines[i], i).then((data) => {
        //this.offlines.splice(i, 1)
        this.comp++;
        if (d == this.comp) {
          this.load = false
          this.storage.set("offline", null)
          this.storage.set("lastsync", new Date())
          this.storage.set("lastsyncdata", this.offlines)
          this.lastsync = new Date()
          this.offlines = []
          this.cancellocalnot()
          this.account.updateStatus$.emit("Update Completed")
          console.log("Done syncing..", i)
        }

      }, (error) => {
        false
        this.load = false
        if (error.url == null) {
          this.showalert("No Internet Connection", "Turn on wifi or data")
        }
        console.log(error)
      });
    }
  }

}
