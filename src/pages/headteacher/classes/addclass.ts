import { Component } from '@angular/core'
import { ViewController, NavParams } from 'ionic-angular'
import { Classes } from '../../home/classes'
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AccountService } from '../../login/account.services'

@Component({
    selector: 'add-class',
    templateUrl: 'addclass.html'
})
export class AddClassModal {
    stream: Classes
    type: string
    classform: FormGroup
    class_id: number
    load: boolean = false
    school: number
    constructor(private viewCtrl: ViewController, private params: NavParams
        , private formBuilder: FormBuilder, private account: AccountService) {
        this.type = this.params.get("type")
        this.stream = this.params.get("stream")
        this.school = this.params.get("school")
        // console.log(this.stream, this.type)
        //console.log(this.school);
        this.classform = this.formBuilder.group({
            class_name: ['', Validators.required],
            _class: ['', Validators.required],
            school: ['', Validators.required],
        });
        if (this.stream) {
            this.classform.setValue({
                class_name: this.stream.class_name,
                school: this.stream.school,
                _class: this.stream._class
            })
        }
        else {
            this.classform.setValue({
                class_name: '',
                school: this.school,
                _class: ""
            })

        }
    }

    dismiss() {
        let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(data);
    }
    addclass() {
        console.log(this.classform.value)
        if (this.type == "add") {
            // console.log("This is ite")
            this.newclass(this.classform.value)
        } else {

            this.updateclass(this.classform.value)
        }
    }
    newclass(stream) {
        console.log("adding a class ", stream)
        this.load = true
        this.account.createstream(stream).then((resp) => {
            this.load = false
            console.log(resp)
            this.dismiss()
        },
            (error) => {
                this.load = false
                console.log(error)
            })
    }
    updateclass(stream) {
        console.log("updating a class")
        this.load = true
        this.account.updateclass(this.stream.id, stream).then((resp) => {
            this.load = false
            console.log("Updated student", resp)
            this.dismiss()
        }, (error) => {
            this.load = false
            console.log(error)
        })

    }


}