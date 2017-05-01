import { Injectable, EventEmitter } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Link } from '../../app/link'
import { Token } from '../../app/token'
import 'rxjs'
import { Storage } from '@ionic/storage'
import { TakeAttendance } from '../home/takeattendance'
import { ChangePassword } from '../password/changepassword'
import { Classes, Student, Teacher } from '../home/classes'
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
    newclasslist$: EventEmitter<any> = new EventEmitter()
    teacherchange$: EventEmitter<Teacher> = new EventEmitter<Teacher>()
    teacherdelete$: EventEmitter<Teacher> = new EventEmitter<Teacher>()
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
    newclasslist() {
        this.newclasslist$.emit("new list");
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
            at: new Date(new Date().getTime() + 1 * 1000 * 60 * 60 * 24 * 1),
            every: "everyday"
        });

    }
    profile(): Promise<any> {
        //this.jheaders = new Headers({ "Content-Type": "application/json", "Authorization": "Bearer " + token })
        return this.http.get(this.link + "api/teacher", { headers: this.jheaders }).toPromise()
            .then((response) => {
                let data=response.json() as any
                this.storage.set("profile", data.profile)
                this.storage.set("subjects", data.subjects)
                this.storage.set("reasons", data.reasons)
                this.storage.set("teachers", data.teachers)
                this.storage.set("classes", data.classes)
                this.storage.set("schoolinfo",data.schoolinfo)
                return  response.json() as any
            })
            .catch(this.error)
    }
    takeattendance(data: TakeAttendance): Promise<any> {
        return this.http.post(this.link + "api/attendance", data, { headers: this.jheaders }).toPromise()
            .then((respose) => {
                this.attendancelocalnot()
                this.saveattendancehistory(data)
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
    createstudent(data: any): Promise<any> {
        return this.http.post(this.link + "api/students", data, { headers: this.jheaders }).toPromise()
            .then(resp => {
                this.storageaddstudent(resp.json())
                return resp.json()
            })
            .catch(this.error)
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
            classes[clindex] = theclass
            // let thestud=classes.filter(cl=>cl.id == student.class_id)[0]
            //                 .students.filter(stud=>stud.id==student.id)[0];
            this.storage.set("classes", classes).then((data) => {
                this.studentsChange$.emit(student);
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


            }
            let offs: Offline[] = offlines as Offline[]
            let off = new Offline()
            off.date = new Date()
            off.attendance = data
            off.link = this.link + "api/attendance"
            offs.push(off)
            this.storage.set("offline", offs).then((data) => {
                this.newofflineattendance$.emit("new")
                this.initiatesync()

            })

            this.showtoast("No Internet. Saved Offline")
            console.log(data)
        }, (error) => {
            console.log(error)
        });
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
        return this.http.options(this.link + "api/attendance").toPromise()
            .then((resp) => resp.json())
            .catch(this.error)
    }
    initiatesync() {
        // this.nonetnotification=true
        this.storage.get("offline").then((data) => {
            if (data == null) {
                data = []
                console.log("No offlines")
            }
            else {
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



    ///Get the absent students
    getabsentstudents(id,date:any):Promise<any>{
        return this.http.get(this.link+"api/students/absent?_class="+id+"&date="+date).toPromise()
                .then(resp=>resp.json())
                .catch(this.error)

    }


}