import { Component,OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';


@Component({
  selector: 'individual',
  templateUrl: 'individual.html'
})
export class IndividualPage implements OnInit {

  text: string;
  options: any;

  constructor() {
    console.log('Hello Individual Component');
    this.text = 'Hello World';
  }

  ngOnInit(){
    this.graph();
  }

  graph(){
  this.options = {
      chart: { type: 'column' },
      title: { text: '' },
      xAxis: {
        categories: [
            'Week1',
            'Week2',
            'Week3',
            'Week4',
        ],
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
        data: [3, 1, 2, 0]

    }, {
        name: 'Absent',
        data: [2, 4, 3, 5]

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
