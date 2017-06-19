import { Component,OnInit } from '@angular/core';
import { NavController, LoadingController,NavParams } from 'ionic-angular';
import {AccountService} from '../../login/account.services'
import {Student} from '../../home/classes'
@Component({
  selector: 'individual',
  templateUrl: 'individual.html'
})
export class IndividualPage implements OnInit {

  text: string;
  options: any;
  student:Student
  presentpercentage:number=0
  constructor(private account:AccountService,private navparams:NavParams) {
   
  }

  ngOnInit(){
   // this.graph();
  }

  getstudentreport(){
     // 
  }
    ngAfterViewInit() {
    let student=this.navparams.get("student");
    this.student=student
    console.log("student ",student);
    this.account.getstudentweeklyreport(student.id).then((data=>{
        data=data.results
        let presents=[]
        let absents=[]
        let categories=[]
        let totalpresent=0
        let totalabsent=0
         console.log(data)
        for(let i=0;i<data.length;i++){
            let d=data[i]
            presents.push(d["present"])
            totalabsent+=d["absent"]
            totalpresent+=d["present"]
            absents.push(d["absent"])
            categories.push(d["value"])
        }
        if(totalabsent !=0){
        this.presentpercentage=Math.round(totalpresent/(totalabsent+totalpresent)*100)
        }
       
        let graphdata={}
        graphdata["present"]=presents
        graphdata["absent"]=absents
        graphdata["categories"]=categories
        console.log(graphdata)
        if(presents.length !=0 && absents.length !=0){
             this.graph(graphdata)
        }
       
    }))

  }

  graph(data){
  this.options = {
      chart: { type: 'column' },
      title: { text: '' },
      xAxis: {
        categories:data["categories"],
        crosshair:true
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
