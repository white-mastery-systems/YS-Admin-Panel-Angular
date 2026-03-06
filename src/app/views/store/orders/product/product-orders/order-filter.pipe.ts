import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderFilter'
})

export class OrderFilterPipe implements PipeTransform {

  transform(items: any[], value : string): any[] {

    if (!items) return [];
    if (!value || value.length == 0 || value=='all') return items;
    return items.filter(it => it.order_status==value);
    
  }

}