
import { Component } from '@angular/core'
import { ViewController, NavParams } from 'ionic-angular'
import { Student } from '../../home/classes'
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
@Component({
    selector: 'add-student',
    templateUrl: 'addstudent.html'
})
export class AddStudentModal {
    student: Student
    type: string
    studform: FormGroup
    class_id:number
    constructor(private viewCtrl: ViewController, private params: NavParams
        , private formBuilder: FormBuilder) {
        this.type = this.params.get("type")
        this.student = this.params.get("student")
        this.class_id = this.params.get("class")
        console.log(this.student, this.type)
        this.studform = this.formBuilder.group({
            fstname: ['', Validators.required],
            lstname: [''],
            midname: [''],
            class_id: ['', Validators.required],
            gender: ['' ],
        });
        if(this.student){
            this.studform.setValue({
                fstname:this.student.fstname,
                lstname:this.student.lstname,
                midname:this.student.midname,
                class_id:this.class_id,
                gender:'F'
            })
        }
    }

    dismiss() {
        let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(data);
    }
    addstud(){
        console.log(this.studform.value)
    }

}