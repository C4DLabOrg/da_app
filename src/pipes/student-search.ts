import { Injectable, Pipe } from '@angular/core';
import {Student} from '../pages/home/classes'
/*
  Generated class for the AppSearch pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'student',
  pure:true
})
@Injectable()
export class StudentSearch {
  /*
    Takes a value and makes it lowercase.
   */
   transform(list: Student[], searchTerm: string): any[] {
     if (searchTerm) {
        searchTerm = searchTerm.toUpperCase();
        return list.filter(item => {
          return item.student_name.toLowerCase().includes(searchTerm.toLowerCase())  //.toUpperCase().indexOf(searchTerm) !== -1 
        });
      } else {
        return list;
      }
  }
}
