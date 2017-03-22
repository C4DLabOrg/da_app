import { Injectable, EventEmitter } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Link } from '../../app/link'
import { Token } from '../../app/token'
import 'rxjs'
import { Storage } from '@ionic/storage'
import { TakeAttendance } from '../home/takeattendance'
import { ChangePassword } from '../password/changepassword'
import { Classes, Student } from '../home/classes'
import { Offline } from './offline'
import { ToastController } from 'ionic-angular';
import { LocalNotifications } from 'ionic-native';

@Injectable()
export class AccountService {
    link: string
    token: Token
    client_id: string
    toast: any
    offlines: Offline[]
    classes: Classes[]
    clock: any
    nonetnotification: boolean = true
    private headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" })
    jheaders: Headers
    newofflineattendance$: EventEmitter<any> = new EventEmitter()
    studentsChange$: EventEmitter<Student> = new EventEmitter<Student>()
    studentDelete$: EventEmitter<Student> = new EventEmitter<Student>()
    updateStatus$: EventEmitter<string> = new EventEmitter<string>()

    constructor(private http: Http, private toastctrl: ToastController,
        private url: Link, private storage: Storage) {
        this.newofflineattendance$ = new EventEmitter()
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
    setlocalnot() {
        LocalNotifications.schedule({
            id: 1,
            title: "Digital Attendance",
            text: "Please sync your attendance",
            at: new Date(new Date().getTime() + 1 * 1000 * 60 * 60 * 24 * 5),
            every: "everyday"
        })

    }
    attendancelocalnot() {
        LocalNotifications.schedule({
            id: 3,
            title: "Digital Attendance",
            text: "Please Remember to Take Attendance",
            at: new Date(new Date().getTime() + 1 * 1000 * 60 * 60 * 24 *1),
            every: "everyday"
        });
        alert("set")

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
                this.attendancelocalnot()
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
            .then((response) => {
                this.storageupdatestudent(response.json())
                return response.json()
            })
            .catch(this.error)
    }
    createstudent(data: any): Promise<any> {
        return this.http.post(this.link + "api/students", data, { headers: this.jheaders }).toPromise()
            .then(resp => {
                this.storageaddstudent(resp.json())
                return resp.json()
            })
            .catch(this.error)
    }
    deletestudent(student: Student): Promise<any> {
        return this.http.delete(this.link + "api/students/" + student.id, { headers: this.jheaders }).toPromise()
            .then(resp => {
                this.storageaddstudent(resp.json())
                return resp.json()
            })
            .catch(this.error)
    }
    storageaddstudent(student: Student) {
        this.storage.get("classes").then((data) => {
            let classes = data as Classes[]
            let clindex = classes.indexOf(classes.filter(cl => cl.id === student.class_id)[0])
            let theclass = classes[clindex]
            theclass.students.push(student)
            classes[clindex] = theclass
            // let thestud=classes.filter(cl=>cl.id == student.class_id)[0]
            //                 .students.filter(stud=>stud.id==student.id)[0];
            this.storage.set("classes", classes).then((data) => {
                this.studentsChange$.emit(student);
            });

        })
    }
    storagedeletestudent(student: Student) {
        this.storage.get("classes").then((data) => {
            let classes = data as Classes[]
            let clindex = classes.indexOf(classes.filter(cl => cl.id === student.id)[0])
            let theclass = classes[clindex]
            let studentindex = theclass.students.indexOf(student)
            theclass.students.splice(studentindex, 1)
            classes[clindex] = theclass
            // let thestud=classes.filter(cl=>cl.id == student.class_id)[0]
            //                 .students.filter(stud=>stud.id==student.id)[0];
            this.storage.set("classes", classes).then((data) => {
                this.studentDelete$.emit(student);
            });

        })
    }
    storageupdatestudent(student: Student) {
        this.storage.get("classes").then((data) => {
            let classes = data as Classes[]
            let clindex = classes.indexOf(classes.filter(cl => cl.id === student.class_id)[0])
            let theclass = classes[clindex]
            let studinedx = theclass.students.indexOf(theclass.students.filter(stud => stud.id === student.id)[0])
            theclass.students[studinedx] = student
            classes[clindex] = theclass
            let thestud = theclass.students[studinedx]
            // let thestud=classes.filter(cl=>cl.id == student.class_id)[0]
            //                 .students.filter(stud=>stud.id==student.id)[0];
            this.storage.set("classes", classes).then((data) => {
                this.studentsChange$.emit(student);
            });
        })
    }

    private handleattendance(error: any, attendance: TakeAttendance): Promise<any> {
        //console.log(error)
        if (error.url == null) {
            console.log("No internet", attendance)
            this.saveoffline(attendance)
            this.attendancelocalnot()
            return Promise.resolve([])
        }
        else {
            return Promise.reject(error.message || error)
        }

    }
    saveattendancehostory(attendance: TakeAttendance) {
        this.storage.get("attendancehistory").then((data: TakeAttendance[]) => {
            data == null ? data = [] : data = data;
            console.log("Saved Attendances ", data)
        })
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
        this.storage.get("offline").then((offlines) => {
            console.log(data)
            if (offlines == null) {
                offlines = []
                this.setlocalnot()
                //Inititate Watchout for internet Connection
                this.initiatesync()

            }
            let offs: Offline[] = offlines as Offline[]
            let off = new Offline()
            off.date = new Date()
            off.attendance = data
            off.link = this.link + "api/attendance"
            offs.push(off)
            this.storage.set("offline", offs).then((data) => {
                this.newofflineattendance$.emit("new")

            })

            this.showtoast("No Internet. Saved Offline")
            console.log(data)
        }, (error) => {
            console.log(error)
        });
    }
    sync(data: Offline, index: number): Promise<any> {
        return this.http.post(data.link, data.attendance, this.jheaders).toPromise()
            .then((response) => {
                //this.deleteoffline(index)
                response.json()
            })
            .catch(this.error)
    }
    private deleteoffline(index: number) {
        this.storage.get("offline").then((offlines) => {
            let offs = offlines as Offline[]
            if (offs.length > 0) {
                console.log("Deleting ...", index, offs.length)
                offs.splice(index, 1)
                console.log("Deleted ...", offs.length)
                this.storage.set("offline", offs)
            }
            else {
                console.log("Index not in range")
            }
        });
    }
    ping(): Promise<any> {
        return this.http.options(this.link + "api/attendance").toPromise()
            .then((resp) => resp.json())
            .catch(this.error)
    }
    initiatesync() {
        // this.nonetnotification=true
        this.ping().then((data) => {
            this.dosync()
        }, (error) => {
            if (error.url == null) {
                setTimeout(() => {
                    this.initiatesync()
                    console.log("retrying to connect ..")
                }, 2000);
                if (this.nonetnotification) {
                    this.updateStatus$.emit("No Internet Connection");
                    this.nonetnotification = false
                }


            }
        })
    }
    dosync() {
        this.storage.get("offline").then((data) => {
            if (data == null) {
                data = []
            }
            else {
                this.updateStatus$.emit("Attendance Sync Started ...");
            }
            console.log(data)
            this.offlines = data

            let d = this.offlines.length
            let comp = 0
            for (let i = 0; i < this.offlines.length; i++) {
                console.log("Starting ...", i)
                this.sync(this.offlines[i], i).then((data) => {
                    //this.offlines.splice(i, 1)
                    comp++;
                    if (d == comp) {
                        this.storage.set("offline", null)
                        this.storage.set("lastsync", new Date())
                        this.storage.set("lastsyncdata", this.offlines)
                        this.offlines = []
                        this.updateStatus$.emit("Attendance sync Completed");
                        console.log("Done syncing..", i)
                    }

                }, (error) => {
                    false

                    if (error.url == null) {
                        this.updateStatus$.emit("No Internet Connection");
                    }
                    console.log(error)
                });
            }
            //Close
        });
    }


}