import {Pipe} from "@angular/core";
@Pipe({standalone: true, name: 'hour'})
export class HourPipe {
  transform (input:string) {
    let result = input.split(':');
    return `${result[0]}:${result[1]}`
  }
}
