import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numOrderAsc',
    standalone: false
})

export class NumOrderAscPipe implements PipeTransform {

  transform(array: any[], field: string): any[] {
    if(!Array.isArray(array) || !field) {
      return array;
    }

    return array.sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      if(valueA < valueB) return -1;
      else if(valueA > valueB) return 1;
      else return 0;
    });
  }

}