
import { Component } from '@angular/core'
import { ViewController, NavParams } from 'ionic-angular'
import { Student ,Classes} from '../../home/classes'
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
    classes:Classes[]
    load:boolean=false
    constructor(private viewCtrl: ViewController, private params: NavParams
        , private formBuilder: FormBuilder,private account:AccountService) {
        this.type = this.params.get("type")
        this.student = this.params.get("student")
        this.class_id = this.params.get("class")
        this.classes=this.params.get("classes")
        //console.log(this.student, this.type,this.classes)
        this.studform = this.formBuilder.group({
            fstname: ['', Validators.required],
            lstname: [''],
            midname: [''],
            class_id: ['', Validators.required],
            student_id: [''],
            gender: ['' ],
            guardian_name: ['' ],
            guardian_phone: ['' ],
            date_enrolled:['',Validators.required]
        });
        if(this.student){
            this.studform.setValue({
                fstname:this.student.fstname,
                lstname:this.student.lstname,
                midname:this.student.midname,
                student_id: this.student.student_id,
                class_id:this.class_id,
                gender:this.student.gender,
                guardian_phone:this.student.guardian_phone,
                guardian_name:this.student.guardian_name,
                date_enrolled:this.student.date_enrolled
            })
        }
        else{
                this.studform.setValue({
                fstname:"",
                lstname:"",
                midname:"",
                student_id: "",
                class_id:this.class_id,
                gender:"",
                guardian_phone:"",
                guardian_name:"",
                date_enrolled:""
            })
            
        }
    }

    dismiss() {
        let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(data);
    }
    addstud(type){
      //  console.log(this.studform.value)
        if(this.type=="add"){
           // console.log("This is ite")
            this.newstudent(this.studform.value)
        }else{
           
            this.updatestudent(this.studform.value)
        }
    }
    newstudent(data){
        this.load=true
        this.account.createstudent(data).then((resp)=>{
             this.load=false
           console.log(resp)
           this.dismiss()
        },
        (error)=>{
            this.load=false
            console.log(error)})
    }
    updatestudent(data){
         this.load=true
        this.account.updatestudent(this.student.id,data,this.student).then((resp)=>{
            this.load=false
            console.log("Updated student",resp)
             this.dismiss()
        },(error)=>{
            this.load=false
            console.log(error)
        })
    }

}