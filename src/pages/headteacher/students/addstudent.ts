import  Moment  from 'moment';


import { Component } from '@angular/core'
import { ViewController, NavParams } from 'ionic-angular'
import { Student, Classes } from '../../home/classes'
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AccountService } from '../../login/account.services'
import { DatePicker } from '@ionic-native/date-picker';
// import { DatePicker } from "../../ionic2-date-picker/date-picker";
@Component({
    selector: 'add-student',
    templateUrl: 'addstudent.html'
})
export class AddStudentModal {
    student: Student
    type: string
    studform: FormGroup
    class_id: number
    classes: Classes[]
    event: string = new Date().toDateString()
    load: boolean = false
    maxdate: string = new Date().toISOString()
    constructor(private viewCtrl: ViewController, private params: NavParams
        , private formBuilder: FormBuilder, private account: AccountService,
        public datePicker: DatePicker
    ) {
        this.type = this.params.get("type")
        this.student = this.params.get("student")
        this.class_id = this.params.get("class")
        this.classes = this.params.get("classes")
        //console.log(this.student, this.type,this.classes)

        this.studform = this.formBuilder.group({
            fstname: ['', Validators.required],
            lstname: [''],
            midname: [''],
            class_id: ['', Validators.required],
            student_id: [''],
            gender: ['', Validators.required],
            guardian_name: [''],
            guardian_phone: [''],
            is_oosc: [''],
            date_enrolled: ['', Validators.required]
        });
        if (this.student) {
            if (this.student.date_enrolled) {
                this.event = new Date(this.student.date_enrolled).toDateString()
            }
            this.studform.setValue({
                fstname: this.student.fstname,
                lstname: this.student.lstname,
                midname: this.student.midname,
                student_id: this.student.student_id,
                class_id: this.class_id,
                is_oosc: this.student.is_oosc,
                gender: this.student.gender,
                guardian_phone: this.student.guardian_phone,
                guardian_name: this.student.guardian_name,
                date_enrolled: this.student.date_enrolled
            })
        }
        else {
            this.studform.setValue({
                fstname: "",
                lstname: "",
                midname: "",
                student_id: "",
                class_id: this.class_id,
                gender: "",
                is_oosc: false,
                guardian_phone: "",
                guardian_name: "",
                date_enrolled: this.djangodate(this.event)
            })

        }
        // this.datePicker.onDateSelected.subscribe(
        //     (date) => {
        //         this.event = date
        //         //  console.log("Date changed ", date);
        //     });
    }
    djangodate(date) {
        // let d = new Date(date)
        // let g = d.toLocaleDateString()
        // let f = g.split("/")
        // return f[2] + "-" + f[0] + "-" + f[1]
        return Moment(date).format("YYYY-MM-DD");
    }

    dismiss() {
        let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(data);
    }
    datechange(value) {
        let d = new Date(value)
        this.event = Moment(d).format("YYYY-MM-DD")
    }
    addstud(type) {
        //  console.log(this.studform.value)
        let data = this.studform.value
        data.date_enrolled = this.djangodate(this.event)
        if (isNaN(data.student_id)) {
            data.student_id = 0
        }
        else if (data.student_id == "") {
            data.student_id = 0
        }

        console.log(JSON.stringify(data));
        if (this.type == "add") {
            // console.log("This is ite")
            this.newstudent(data)
        } else {
            this.updatestudent(data)
        }
    }
    addDays(theDate, days) {

        return new Date(theDate.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
    }
    showCalendar() {
        let date = new Date().toDateString()
        if (this.student) {
            date = this.student.date_enrolled
        }
        this.datePicker.show({
            date: new Date(date),
            mode: 'date',
            maxDate: Date.parse(this.addDays(new Date(), -1)),
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
        }).then(
            date => {
                console.log('Got date: ', date)
                this.datechange(date)
            },
            err => console.log('Error occurred while getting date: ', err)
            );
        // this.datePicker.showCalendar(date);
    }

    newstudent(data) {
        this.load = true
        this.account.createstudent(data).then((resp) => {
            this.load = false
            console.log(resp)
            this.dismiss()
        },
            (error) => {
                this.load = false
                console.log(JSON.stringify(error))
            })
    }
    updatestudent(data) {
        this.load = true
        data.date_enrolled = this.djangodate(this.event)
        this.account.updatestudent(this.student.id, data, this.student).then((resp) => {
            this.load = false
            console.log("Updated student", resp)
            this.dismiss()
        }, (error) => {
            this.load = false
            console.log(JSON.stringify(error))
        })
    }

}