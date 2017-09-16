import { Classes } from './../../home/classes';
import { Component, OnInit } from '@angular/core'
import { ViewController, NavParams } from 'ionic-angular'
import { Teacher } from '../../home/classes'
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AccountService } from '../../login/account.services'
import { Storage } from '@ionic/storage'
@Component({
    selector: 'add-teacher',
    templateUrl: 'addteacher.html'
})
export class AddTeacherModal implements OnInit {
    teacher: Teacher
    type: string
    classes: Classes[]
    teachform: FormGroup
    user: Teacher
    class_id: number
    status: any
    load: boolean = false
    constructor(private viewCtrl: ViewController, private params: NavParams
        , private storage: Storage
        , private formBuilder: FormBuilder, private account: AccountService) {
        this.type = this.params.get("type")
        this.teacher = this.params.get("teacher")
        this.classes = this.params.get("classes")
        this.class_id = this.params.get("class")
        console.log(this.teacher, this.type)
        this.teachform = this.formBuilder.group({
            fstname: ['', Validators.required],
            lstname: ['', Validators.required],
            gender: ['', Validators.required],
            classes: [[],],
            phone_no: ['', Validators.required],
            teacher_type: ['', Validators.required],
            headteacher: [false,]
        });
        if (this.teacher) {
            this.teachform.setValue({
                fstname: this.teacher.fstname,
                lstname: this.teacher.lstname,
                classes: this.teacher.classes,
                gender: this.teacher.gender,
                phone_no: this.teacher.phone_no,
                headteacher: this.teacher.headteacher,
                teacher_type: this.teacher.teacher_type,
            })
        }
    }

    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.getProfile()
    }
    getProfile() {
        this.storage.get("profile").then((data) => {
            this.user = data
        }, onerror => {
            console.log(onerror)
        })

    }
    dismiss() {
        let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(data);
    }
    addteach(type) {
        let data=this.teachform.value
         data.classes=data.classes.map(val=>{
            return parseInt(val)
        })
        console.log(data)
        if (this.type == "add") {
            // console.log("This is ite")
            this.newteach(data)
        } else {
            this.updateach(data)
        }
    }
    newteach(dat) {
        this.load = true
        let teach = dat as Teacher
        if (this.user) {
            teach.school = this.user.school
        }
        console.log(teach, this.user)
        let data = { "username": teach.phone_no, "details": teach }
        //console.log(data)
        this.account.createteacher(data).then((data) => {
            this.load = false
            this.dismiss()
            // console.log(data);
        }, (error) => {
            this.load = false
            console.log(error)
        })
    }
    updateach(dat) {
        this.load = true
        //this.load=true
        if (this.teacher) {
            this.account.updateteacher(this.teacher.id, dat).then(data => {
                this.load = false
                console.log(this.teacher.name + " Updated ");
                this.dismiss()
            }, error => {
                this.load = false
                console.log("Update failed ", error.data)
            })
        }

    }

}