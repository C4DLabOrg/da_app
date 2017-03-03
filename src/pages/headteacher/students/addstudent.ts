
import { Component } from '@angular/core'
import { ViewController, NavParams } from 'ionic-angular'
import { Student } from '../../home/classes'
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AccountService } from '../../login/account.services'
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
        , private formBuilder: FormBuilder,private account:AccountService) {
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
    addstud(type){
        console.log(this.studform.value)
        if(type=="add"){

        }else{
            this.updatestudent(this.studform.value)
        }
    }
    updatestudent(data){
        this.account.updatestudent(this.student.id,data).then((resp)=>{
            console.log(resp)
        },(error)=>{
            console.log(error)
        })
    }

}