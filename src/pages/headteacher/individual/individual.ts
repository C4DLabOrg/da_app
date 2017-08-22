import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { AccountService } from '../../login/account.services'
import { Student } from '../../home/classes'
@Component({
    selector: 'individual',
    templateUrl: 'individual.html'
})
export class IndividualPage implements OnInit {

    text: string;
    options: any;
    student: Student
    load: boolean = false
    presentpercentage: any = "---"
    absentpercentage: any = "---"
    month: any = (new Date().getMonth()+1).toString()
    year: any = new Date().getFullYear()

    constructor(private account: AccountService, private navparams: NavParams) {

    }

    ngOnInit() {
        // this.graph();
    }

    getstudentreport(month,year) {
        let start_date=year+"-"+month+"-1"
        let lstday=new Date(parseInt(year),parseInt(month),0).getDate()
        console.log(lstday)
        let end_date=year+"-"+month+"-"+lstday        
        let student = this.navparams.get("student");
        this.student = student
        console.log("student ", student, this.month, this.year);
        this.load = true
        this.account.getstudentweeklyreport(student.id,start_date,end_date).then((data => {
            let count=data.count
            data = data.results
            let presents = []
            let absents = []
            let categories = []
            let totalpresent = 0
            let totalabsent = 0
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                let d = data[i]
                presents.push(d["present"])
                totalabsent += d["absent"]
                totalpresent += d["present"]
                absents.push(d["absent"])
                categories.push(new Date(d["value"]).toDateString())
            }
            if (count != 0) {
                this.presentpercentage = Math.round(totalpresent / (totalabsent + totalpresent) * 100)
                this.absentpercentage = 100 - this.presentpercentage
            }
            else{
                console.log("nod data")
                  this.presentpercentage = "---"
                  this.absentpercentage = "---"
            }
            this.load = false
            let graphdata = {}
            graphdata["present"] = presents
            graphdata["absent"] = absents
            graphdata["categories"] = categories
            console.log(graphdata)
            if (presents.length != 0 && absents.length != 0) {
                this.graph(graphdata)
            }


        }), (error) => {
            this.load = false
            console.log(error)
        })
    }
    ngAfterViewInit() {
        this.getstudentreport(this.month,this.year)

    }
    onmonthyearchange(month,year){
          this.getstudentreport(month,year)
    }
    graph(data) {
        this.options = {
            chart: { type: 'column' },
            title: { text: '' },
            xAxis: {
                categories: data["categories"],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number'
                }


            },
            series: [{
                name: 'Present',
                data: data["present"]

            }, {
                name: 'Absent',
                data: data["absent"]

            }],


            tooltip: {
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
        };

    }

}
