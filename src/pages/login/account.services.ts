import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Link } from '../../app/link'
import { Token } from '../../app/token'
import 'rxjs'
import { Storage } from '@ionic/storage'
import { TakeAttendance } from '../home/takeattendance'
import { ChangePassword } from '../password/changepassword'
import { Classes } from '../home/classes'
import { Offline } from './offline'
import {ToastController} from 'ionic-angular';
@Injectable()
export class AccountService {
    link: string
    token: Token
    client_id: string
    toast:any
    classes: Classes[]
    private headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" })
    jheaders: Headers
    constructor(private http: Http,private toastctrl:ToastController,
     private url: Link, private storage: Storage) {
        this.link = url.uri
        this.client_id = url.client_id
        this.getauth()

    }
    login(username: string, password: string): Promise<Token> {
        return this.http.post(this.link + "o/token/",
            "username=" + username + "&password=" + password + "&grant_type=password&client_id=" + this.client_id,
            { headers: this.headers })
            .toPromise()
            .then(response => response.json() as Token)
            .catch(this.error)
    }
    public getauth() {
        this.storage.get("user").then((data) => {
            //  console.log("the token",data)
            if (data != null) {
                this.token = data
                this.jheaders = new Headers({ "Content-Type": "application/json", "Authorization": "Bearer " + data.access_token })
            }
            else {
                this.jheaders = new Headers({ "Content-Type": "application/json" })
            }
        });
    }
    private error(error: any): Promise<any> {
        return Promise.reject(error.message || error)
    }

    profile(): Promise<any> {
        //this.jheaders = new Headers({ "Content-Type": "application/json", "Authorization": "Bearer " + token })
        return this.http.get(this.link + "api/teacher", { headers: this.jheaders }).toPromise()
            .then(response => response.json() as any)
            .catch(this.error)
    }
    takeattendance(data: TakeAttendance): Promise<any> {
        return this.http.post(this.link + "api/attendance", data, { headers: this.jheaders }).toPromise()
            .then((respose) => {

                respose.json()
            })
            .catch((error) => this.handleattendance(error, data))
    }

    //Update reason for absent

    updateabsence(id, data: any): Promise<any> {
        return this.http.patch(this.link + "api/absent/" + id, data, { headers: this.jheaders }).toPromise()
            .then(response => response.json())
            .catch(this.error);
    }
    //Change password
    changepassword(data: ChangePassword): Promise<any> {
        //   console.log(this.jheaders)
        return this.http.put(this.link + "api/change-password", data, { headers: this.jheaders }).toPromise()
            .then(response => response.json())
            .catch(this.error)
    }
    updatestudent(id, data: any): Promise<any> {
        return this.http.patch(this.link + "api/students/" + id, data, { headers: this.jheaders }).toPromise()
            .then(response => response.json())
            .catch(this.error)
    }
    storageupdatestudent(dat) {
        this.storage.get("classes").then((data) => {
            this.classes = data

        })
    }
    private handleattendance(error: any, attendance: TakeAttendance): Promise<any> {
        console.log(error)
        if (error.url == null) {
            console.log("No internet", attendance)
            this.saveoffline(attendance)
            return Promise.resolve([])
        }
        else {
            return Promise.reject(error.message || error)
        }

    }
    getreport(id, date: any): Promise<any> {
        return this.http.get(this.link + "api/attendances/daily?_class=" + id + "&date=" + date).toPromise()
            .then(resp => resp.json())
            .catch(this.error)
    }
    showtoast(message: string) {
        if (this.toast) {
            this.toast.dismiss()
        }
        this.toast = this.toastctrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        this.toast.onDidDismiss(() => {
            this.toast = null
        });

        this.toast.present()
    }
    saveoffline(data: TakeAttendance) {
        this.storage.get("offline").then((data) => {
            console.log(data)
            if (data == null) {
                data = []
            }
            let offs: Offline[] = data as Offline[]
            let off = new Offline()
            off.date = new Date()
            off.attendance = data
            off.link = this.link + "api/attendance"
            offs.push(off)
            this.storage.set("offline", offs)
            this.showtoast("No Internet. Saved Offline")
            console.log(data)
        }, (error) => {
            console.log(error)
        });
    }


}