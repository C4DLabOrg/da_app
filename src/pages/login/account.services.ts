import Moment from 'moment';
import { Injectable, EventEmitter } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Link } from '../../app/link'
import { Token } from '../../app/token'
import 'rxjs'
import { AlertController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage'
import { TakeAttendance } from '../home/takeattendance'
import { ChangePassword } from '../password/changepassword'
import { Classes, Student, Teacher } from '../home/classes'
import { Offline } from './offline'
import { ToastController } from 'ionic-angular';
import { LocalNotifications } from 'ionic-native';
import jsSHA from 'jssha'


@Injectable()
export class AccountService {
    link: string
    token: Token
    client_id: string
    toast: any
    offlines: Offline[]
    classes: Classes[]
    clock: any
    offcreds: any
    syncstarted: boolean = false
    totalrequests: number = 0
    completedrequests: number = 0
    errorrequests: number = 0
    username: string
    password: string
    private loader: any
    access_token: string
    showattendanceprogress: boolean = false
    nonetnotification: boolean = true
    private headers = new Headers({ "Content-Type": "application/x-www-form-urlencoded" })
    jheaders: Headers
    newofflineattendance$: EventEmitter<any> = new EventEmitter()
    studentsChange$: EventEmitter<Student> = new EventEmitter<Student>()
    studentDelete$: EventEmitter<Student> = new EventEmitter<Student>()
    updateStatus$: EventEmitter<string> = new EventEmitter<string>()
    newclasslist$: EventEmitter<any> = new EventEmitter()
    teacherchange$: EventEmitter<Teacher> = new EventEmitter<Teacher>()
    classeschange$: EventEmitter<Classes> = new EventEmitter<Classes>()
    teacherdelete$: EventEmitter<Teacher> = new EventEmitter<Teacher>()
    constructor(private http: Http,
        private loadctrl: LoadingController,
        private toastctrl: ToastController
        , private alertcrtl: AlertController,
        private url: Link, private storage: Storage) {
        this.newofflineattendance$ = new EventEmitter()
        this.link = url.uri
        this.client_id = url.client_id
        this.getauth()

    }
    login(username: string, password: string) {
        return Observable.fromPromise(this.storage.get("offlinecreds")).mergeMap(thecreds => {
            this.offcreds = thecreds
            this.password = password
            this.username = username

            return this.http.post(this.link + "o/token/",
                "username=" + username + "&password=" + password + "&grant_type=password&client_id=" + this.client_id,
                { headers: this.headers })
                .mergeMap(resp => {
                    let token = resp.json().access_token
                    let offlinecred: any = {}
                    offlinecred.username = username
                    this.access_token = token
                    offlinecred.password = this.gethash(token, password);
                    offlinecred.access_token = token
                    return Observable.fromPromise(this.storage.set("offlinecreds", offlinecred))
                        .map(() => resp.json())
                        .catch(this.observableerror)
                })
                .catch(error => {
                    console.log(error)
                    if (error.url == null) {
                        if (this.offcreds) {
                            if (this.offcreds.username == this.username && this.offcreds.password == this.gethash(this.offcreds.access_token, this.password)) {
                                return Observable.create((observer) => {
                                    observer.next("offline");
                                    observer.complete();
                                })
                            }
                            else if (this.offcreds.username != this.username) {
                                return Observable.throw({ title: "Offline Login Failed", message: "Offline login only available  to  username " + this.offcreds.username })

                            }
                            return Observable.throw({ title: "Offline Login Failed", message: "Wrong  password provided for  username " + this.offcreds.username })
                        }
                        else {
                            return Observable.throw({ title: "Offline Login Failed", message: "No offline Credentials found!" });
                        }

                    }
                    else if (error.status > 500) {
                        return Observable.throw({ title: "Server Offline", message: "Could not connect to server" })
                    }
                    else {
                        return Observable.throw(error)
                    }
                })
        })
    }
    loaderpresent(message: string) {
        this.loader = this.loadctrl.create({ content: message })
        this.loader.present();
    }
    loaderdismiss() {
        if (this.loader)
            this.loader.dismiss();
    }
    observableerror(error: any) {
        return Observable.throw(error.json())
    }
    handleloginerror(error: any) {
        console.log(error)
        // console.log(this.offcreds)
        // if (error.url == null) {
        //     if (this.offcreds) {
        //         if (this.offcreds.username == this.username && this.offcreds.password == this.gethash(this.access_token, this.password))
        //             return Observable.create((observer) => {
        //                 observer.next({ res: "offf" });
        //                 observer.complete();
        //             })
        //         return Observable.throw("Offline login failed, use the last login username and password")
        //     }
        //     else {
        //         return Observable.throw("No internet connection or  offline Credentials found!");
        //     }

        // }
        // else {
        //     return Observable.throw(error)
        // }

    }
    newclasslist() {
        this.newclasslist$.emit("new list");
    }

    gethash(password, access_token) {
        var shaObj = new jsSHA("SHA-256", "TEXT");
        shaObj.setHMACKey(access_token, "TEXT");
        shaObj.update(password);
        var hmac = shaObj.getHMAC("HEX");
        return hmac
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
            every: "day"
        })

    }
    attendancelocalnot() {
        var dat = Moment().set({ 'second': 0, 'minute': 0, 'hour': 8 }).toISOString()
        let date = new Date(dat)
        LocalNotifications.schedule({
            id: 3,
            title: "Digital Attendance",
            text: "Please Remember to Take Attendance",
            // at: new Date(new Date().getTime() + 1 * 1000 * 60 * 60 * 24 * 1),
            at: new Date(date.getTime() + 1 * 1000 * 60 * 60 * 24 * 1),
            every: "day"
        });

    }
    profile(): Promise<any> {
        //this.jheaders = new Headers({ "Content-Type": "application/json", "Authorization": "Bearer " + token })
        return this.http.get(this.link + "api/teacher", { headers: this.jheaders })
            .toPromise()
            .then((response) => this.saveall(response))
            .then(response => response)
            .catch(this.error)
    }
    profilev2() {
        return this.http.get(this.link + "api/teacher", { headers: this.jheaders })
            .mergeMap(resp => {
                return Observable.fromPromise(this.saveall(resp))
                    .map(res => resp.json())
                    .catch(this.error)
            })
            .catch(this.observableerror)
    }
    encrypt() {

    }
    createpromotion(promotion) {
        return this.http.post(this.link + "api/schools/promote", promotion, { headers: this.jheaders })
            .mergeMap(resp => {
                return Observable.fromPromise(this.storagesavepromotion(resp.json()))
                    .map(res => resp.json())
                    .catch(this.observableerror)
            })
            .catch(this.observableerror)
        // .map(resp => resp.json())
    }
    updatepromotion(id, promotion) {
        return this.http.patch(this.link + "api/schools/promote/" + id, promotion, { headers: this.jheaders })
            .mergeMap(resp => {
                return Observable.fromPromise(this.storagesavepromotion(resp.json()))
                    .map(res => resp.json())
                    .catch(this.observableerror)
            })
            .catch(this.observableerror)
        // .map(resp => resp.json())
    }
    completepromotion(id, action) {
        return this.http.post(this.link + "api/schools/promote/" + id + "/complete", action, { headers: this.jheaders })
            .mergeMap(resp => {
                return Observable.fromPromise(this.storagesavepromotion(resp.json()))
                    .mergeMap(res => {
                        return this.profilev2()
                            .map(r => resp.json())
                            .catch(this.observableerror)
                    })
                    .catch(this.observableerror)
            })
            .catch(this.observableerror)
        // .map(resp => resp.json())
    }

    storagesavepromotion(promotion) {
        return this.storage.set("promotion", promotion)
    }
    storagegetpromotion() {
        return this.storage.get("promotion")
    }

    storagetprofile() {
        return this.storage.get("profile")
    }
    saveall(response) {
        let data = response.json() as any
        console.log(data.classes)
        // return Promise.all([
        //     this.storage.set("profile", data.profile),
        //     this.storage.set("subjects", data.subjects),
        //     this.storage.set("reasons", data.reasons),
        //     this.storage.set("teachers", data.teachers),
        //     this.storage.set("schoolinfo", data.schoolinfo),
        //     this.storage.set("classes", data.classes)
        // ])
        return new Promise(resolve => {
            console.log("saving all ");
            let data = response.json() as any
            this.storage.set("profile", data.profile)
            this.storage.set("subjects", data.subjects)
            this.storage.set("reasons", data.reasons)
            this.storage.set("teachers", data.teachers)
            this.storage.set("promotion", data.promotion)
            this.storage.set("schoolinfo", data.schoolinfo)
            this.storage.set("classes", data.classes).then(() => {
                console.log("done saving them")
                this.newclasslist()
                resolve(response.json())
            })
        });
    }
    takeattendance(data: TakeAttendance): Promise<any> {
        this.totalrequests++
        return this.http.post(this.link + "api/attendance", data, { headers: this.jheaders }).toPromise()
            .then((respose) => {
                this.attendancelocalnot()
                this.saveattendancehistory(data)
                this.completedrequests++;
                if (this.showattendanceprogress) {
                    let per = (this.completedrequests + this.errorrequests) / this.totalrequests
                    this.updateStatus$.emit(Math.round(per * 100) + " %");
                }
                return respose.json()

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
    changepassword(data: any): Promise<any> {
        //   console.log(this.jheaders)
        return this.http.put(this.link + "api/change-password", data, { headers: this.jheaders }).toPromise()
            .then(response => response.json())
            .catch(this.error)
    }
    updatestudent(id, data: any, student: Student): Promise<any> {
        return this.http.patch(this.link + "api/students/" + id, data, { headers: this.jheaders }).toPromise()
            .then((response) => {
                this.storageupdatestudent(student, response.json())
                return response.json()
            })
            .catch(this.error)
    }
    private Observableerror(error: any) {
        console.log("This is ", error);
        if (!error.url) {
            return Observable.throw("No internet Connection ");
        }
        else if (error.status == 401) {
            return Observable.throw("Token Expired");
        }
        else if (error.json().detail) {
            return Observable.throw(error.json().detail);
        }
        else {
            return Observable.throw(error.json() || "Error ")
        }
        //  this.error(error);
        // this.presentAlert("Observable Api Error", JSON.stringify(error));

    }
    presentAlert(title, message) {
        let alert = this.alertcrtl.create({
            title: title,
            subTitle: message,
            buttons: ['Dismiss']
        });
        alert.present();
    }
    updateclass(id, data: any): Promise<any> {
        return this.http.patch(this.link + "api/streams/" + id, data, { headers: this.jheaders }).toPromise()
            .then((response) => {
                this.storageupdateclass(response.json())
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
    createstream(data: any): Promise<any> {
        return this.http.post(this.link + "api/streams", data, { headers: this.jheaders }).toPromise()
            .then(resp => {
                this.storageaddstream(resp.json())
                return resp.json()
            })
            .catch(this.error)
    }
    deletestream(id) {
        return this.http.delete(this.link + "api/streams/" + id)
            .mergeMap(resp => {
                return Observable.fromPromise(this.storagedeletestream(id))
                    .map(resp => {
                        console.log("deleting class done");
                    })
            })
            .catch(this.Observableerror)
    }
    createteacher(data: any): Promise<any> {
        return this.http.post(this.link + "api/teacher", data, { headers: this.jheaders }).toPromise()
            .then(resp => {
                this.storageaddteacher(resp.json())
                return resp.json()
            }).catch(this.error)
    }
    storageaddteacher(teacher: Teacher) {
        // console.log(teacher)
        this.storage.get("teachers").then(data => {
            let teachers = data as Teacher[]
            teachers.push(teacher);
            this.storage.set("teachers", teachers).then((data) => {
                this.teacherchange$.emit(teacher);
            })
            //let teachindex=teachers.indexOf(teachers.filter(teach=> teach.id===teacher.id)[0])

        })
    }
    updateteacher(id: number, data: any): Promise<any> {
        return this.http.patch(this.link + "api/teachers/" + id, data, { headers: this.jheaders }).toPromise()
            .then(resp => {
                this.storageupdateteacher(resp.json())
                return resp.json()
            })
            .catch(this.error)
    }
    movestudents(data) {
        return this.http.post(this.link + "api/students/bulkmove", data, { headers: this.jheaders })
            .mergeMap(resp => {
                return this.profilev2()
                    .map(res => resp.json())
                    .catch(this.observableerror)
            })
            // .map(resp => resp.json())
            .catch(this.observableerror)
    }
    storageupdateteacher(teacher: Teacher) {
        this.storage.get("teachers").then(data => {
            let teachers = data as Teacher[]
            let teachindex = teachers.indexOf(teachers.filter(tc => tc.id === teacher.id)[0])
            teachers[teachindex] = teacher
            this.storage.set("techers", teachers).then(data => {
                this.teacherchange$.emit(teacher);
            })

        })
    }
    storageupdateclass(stream: Classes) {
        this.storage.get("classes").then(data => {
            let classes = data as Classes[]
            let streamindex = classes.indexOf(classes.filter(tc => tc.id === stream.id)[0])

            //Back up the students list and add it after the update
            stream.students = classes[streamindex].students
            classes[streamindex] = stream
            this.storage.set("classes", classes).then(data => {
                this.classeschange$.emit(stream);
            })

        })
    }
    deleteteacher(teacher: Teacher): Promise<any> {
        return this.http.delete(this.link + "api/teachers/" + teacher.id, { headers: this.jheaders })
            .toPromise()
            .then(resp => {
                this.storagedeleteteacher(teacher)
                return resp.json()
            })
            .catch(this.error)
    }
    storagedeleteteacher(teacher: Teacher) {
        this.storage.get("teachers").then(data => {
            let teachers = data as Teacher[]
            let teachindex = teachers.indexOf(teachers.filter(tc => tc.id === teacher.id)[0])
            teachers.splice(teachindex, 1)
            this.storage.set("techers", teachers).then(data => {
                this.teacherdelete$.emit(teacher);
            })
        })

    }
    deletestudent(student: Student, reason: String): Promise<any> {
        console.log(student)
        return this.http.delete(this.link + "api/students/" + student.id + "?reason=" + reason, { headers: this.jheaders }).toPromise()
            .then(resp => {
                this.storagedeletestudent(student)
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
            theclass.students.sort(function (a, b) {
                if (a.gender < b.gender) return -1;
                if (a.gender > b.gender) return 1;
                return 0;
            });
            classes[clindex] = theclass
            // let thestud=classes.filter(cl=>cl.id == student.class_id)[0]
            //                 .students.filter(stud=>stud.id==student.id)[0];
            this.storage.set("classes", classes).then((data) => {
                this.studentsChange$.emit(student);
            });

        })
    }
    storagedeletestream(id) {
        return this.storage.get("classes").then(data => {
            let classes = data as Classes[]
            let streamindex = classes.indexOf(classes.filter(tc => tc.id === id)[0])
            let stream = classes[streamindex]
            classes.splice(streamindex, 1)
            this.storage.set("classes", classes).then(data => {
                this.classeschange$.emit(stream);
            })
        })
    }
    storageaddstream(new_stream: Classes) {
        let stream = new_stream
        stream.students = []
        this.storage.get("classes").then((data) => {
            let classes = data as Classes[]
            classes.unshift(stream)
            classes.sort(function (a, b) {
                if (a.class_name < b.class_name) return -1;
                if (a.class_name > b.class_name) return 1;
                return 0;
            });
            // let thestud=classes.filter(cl=>cl.id == student.class_id)[0]
            //                 .students.filter(stud=>stud.id==student.id)[0];
            this.storage.set("classes", classes).then((data) => {
                this.classeschange$.emit(stream);
                console.log("emmitted the new class");
            });
        })
    }
    storagedeletestudent(student: Student) {
        console.log("deleting ..student", student)
        this.storage.get("classes").then((data) => {
            let classes = data as Classes[]
            let theclasses = classes.filter(cl => cl.id === student.class_id)
            let clindex = classes.indexOf(classes.filter(cl => cl.id === student.class_id)[0])
            console.log("clindex", clindex, theclasses.length)
            let theclass = classes[clindex]
            let studentindex = theclass.students.indexOf(theclass.students.filter(stud => stud.id === student.id)[0])
            console.log("student index", studentindex)
            theclass.students.splice(studentindex, 1)
            classes[clindex] = theclass
            // let thestud=classes.filter(cl=>cl.id == student.class_id)[0]
            //                 .students.filter(stud=>stud.id==student.id)[0];
            console.log("deledee ..student")
            this.storage.set("classes", classes).then((data) => {
                this.studentDelete$.emit(student);
            });

        })
    }
    storageupdatestudent(student: Student, newstudent: Student) {
        this.storage.get("classes").then((data) => {
            let changeclass = false
            let classes = data as Classes[]
            let clindex = classes.indexOf(classes.filter(cl => cl.id === student.class_id)[0])
            let theclass = classes[clindex]
            let studinedx = theclass.students.indexOf(theclass.students.filter(stud => stud.id === student.id)[0])
            if (student.class_id != newstudent.class_id) {
                console.log("new class")
                theclass.students.splice(studinedx, 1)
                let nwclindex = classes.indexOf(classes.filter(cl => cl.id === newstudent.class_id)[0])
                let nwtheclass = classes[nwclindex]
                nwtheclass.students.push(newstudent)
                nwtheclass.students.sort(function (a, b) {
                    if (a.gender < b.gender) return -1;
                    if (a.gender > b.gender) return 1;
                    return 0;
                });
                classes[clindex] = theclass
                Classes[nwclindex] = nwtheclass
                changeclass = true;
            }
            else {
                console.log("Old class")
                theclass.students[studinedx] = newstudent
                classes[clindex] = theclass
            }

            // let thestud=classes.filter(cl=>cl.id == student.class_id)[0]
            //                 .students.filter(stud=>stud.id==student.id)[0];
            this.storage.set("classes", classes).then((data) => {

                if (changeclass) {
                    this.studentDelete$.emit(student);
                    this.studentsChange$.emit(newstudent);
                }
                else {
                    this.studentsChange$.emit(newstudent);
                }
            });
        })
    }

    private handleattendance(error: any, attendance: TakeAttendance): Promise<any> {
        this.errorrequests++;
        //console.log(error)
        if (error.url == null) {
            console.log("No internet", attendance)
            this.saveoffline(attendance)
            this.attendancelocalnot()
            this.saveattendancehistory(attendance)
            return Promise.resolve([])
        }
        else {
            return Promise.reject(error.message || error)
        }

    }
    // offlineattendance() {
    //     this.saveoffline(attendance)
    //     this.attendancelocalnot()
    //     this.saveattendancehistory(attendance)
    // }
    saveattendancehistory(attendance: TakeAttendance) {
        this.storage.get(attendance.class_name).then((data: TakeAttendance[]) => {
            data == null ? data = [] : data = data;
            if (data.length >= 24) {
                data.splice(0, 1)
            }
            if (data.length == 0) {
                data.push(attendance)
            }
            else {
                let attends = data.filter(attend => attend.date == attendance.date)
                if (attends.length > 0) {
                    let index = data.indexOf(attends[0])
                    data[index] = attendance
                }
                else {
                    data.push(attendance)
                }
            }
            this.storage.set(attendance.class_name, data);
            console.log("Saved Attendances ", data)
        })
    }
    getreport(id, date: any, school): Promise<any> {
        return this.http.get(this.link + "api/attendances/daily?_class=" + id + "&date=" + date + "&school=" + school).toPromise()
            .then(resp => resp.json())
            .catch(this.error)
    }
    getstudentweeklyreport(id, start_date, end_date): Promise<any> {
        return this.http.get(this.link + "api/attendances/weekly?start_date=" + start_date + "&end_date=" + end_date + "&student=" + id).toPromise()
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
            }
            let offs: Offline[] = offlines as Offline[]
            let off = new Offline()
            off.date = new Date()
            off.attendance = data
            off.link = this.link + "api/attendance"
            offs.push(off)
            this.storage.set("offline", offs).then((data) => {
                this.newofflineattendance$.emit("new")
                this.startsync()

            })

            this.showtoast("No Internet. Saved Offline")
            console.log(data)
        }, (error) => {
            console.log(error)
        });
    }
    startsync() {
        if (!this.syncstarted) {

            this.initiatesync()
        }
        else {
            console.log("Sync Already started");
        }
    }
    sync(data: Offline, index: number): Promise<any> {
        return this.takeattendance(data.attendance).then(data => data).catch(this.error)
        // return this.http.post(data.link, data.attendance, this.jheaders).toPromise()
        //     .then((response) => {
        //         //this.deleteoffline(index)
        //         response.json()
        //     })
        //     .catch(this.error)
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
        return this.http.options(this.link + "api/ping").toPromise()
            .then((resp) => resp.json())
            .catch(this.error)
    }

    initiatesync() {
        // this.nonetnotification=true
        this.syncstarted = true
        this.storage.get("offline").then((data) => {
            if (data == null) {
                data = []
                console.log("No offlines")
                this.syncstarted = false
            }
            else {
                this.ping().then((data) => {
                    this.performsyncv2()
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

        }, (error) => {
            console.log(error);
        })
    }
    dosync() {
        // this.storage.get("offline").then((data) => {
        //     if (data == null) {
        //         data = []
        //     }
        //     else {
        //         this.showattendanceprogress = true
        //         this.updateStatus$.emit("Attendance Sync Started ...");
        //     }
        //     console.log(data)
        //     this.offlines = data
        //     let d = this.offlines.length
        //     let comp = 0
        //     let compl = 1;
        //     let promises_array: Array<any> = [];

        //     for (let i = 0; i < this.offlines.length; i++) {
        //         console.log("Starting ...", i)
        //         promises_array.push(this.sync(this.offlines[i], i))
        //     }
        //     Promise.all(promises_array).then(() => {
        //         console.log("Done one")
        //     }, (error) => {
        //         console.log("Eroro")
        //     }).then(() => {
        //         console.log("Done everything");
        //         this.showattendanceprogress = false
        //         this.storage.set("offline", null)
        //         this.storage.set("lastsync", new Date())
        //         this.storage.set("lastsyncdata", this.offlines)
        //         this.offlines = []
        //         this.updateStatus$.emit("Attendance sync Completed");
        //     });;
        //     //Close
        // });
    }
    performsyncv2() {
        console.log("Starting sync ...");
        this.completedrequests = 0;
        this.updateStatus$.emit("Attendance Sync Started ...");
        this.dosyncv2().subscribe(data => {
            console.log("Sync V2 :", data);
            if (data.status == 201) {
                this.completedrequests++;
                let per = (this.completedrequests) / this.totalrequests
                this.updateStatus$.emit("Attendance sync at " + Math.round(per * 100) + " %");
            }
        }, error => {
            console.log("error")
        }, () => {
            this.showattendanceprogress = false
            this.syncstarted = false
            this.storage.set("offline", null)
            this.storage.set("lastsync", new Date())
            this.storage.set("lastsyncdata", this.offlines)
            this.offlines = []
            this.updateStatus$.emit("Attendance sync Completed");

        })
    }
    dosyncv2() {
        return Observable.fromPromise(this.storage.get("offline"))
            .mergeMap(data => {
                if (data && data.length > 0) {
                    this.totalrequests = data.length
                    let urls = []
                    data.forEach(at => {
                        urls.push(this.sync2(at.link, at.attendance))
                    })
                    return Observable.from(
                        urls
                    ).flatMap(data => data)
                        .catch(this.error)
                }
                return Observable.from([])
            }).catch(this.error)
    }
    sync2(link, attendance) {
        return this.http.post(link, attendance, { headers: this.jheaders })
            .map(resp => {
                return { link: link, class: attendance.class_name, date: attendance.date, resp: resp.json(), status: resp.status }
            })
            .catch(this.error);
    }



    ///Get the absent students
    getabsentstudents(id, date: any, school): Promise<any> {
        return this.http.get(this.link + "api/students/absent?_class=" + id + "&date=" + date + "&school=" + school).toPromise()
            .then(resp => resp.json())
            .catch(this.error)

    }


}