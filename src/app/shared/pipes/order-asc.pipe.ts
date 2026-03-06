import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderAsc'
})

export class OrderAscPipe implements PipeTransform {

  transform(array: any[], field: string): any[] {
    if(!Array.isArray(array) || !field) {
      return array;
    }

    return array.sort((a, b) => {
      const valueA = a[field]?.toString().toLowerCase();
      const valueB = b[field]?.toString().toLowerCase();
      if(valueA < valueB) return -1;
      else if(valueA > valueB) return 1;
      else return 0;
    });
  }

}