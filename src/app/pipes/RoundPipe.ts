import {Pipe} from "@angular/core";
@Pipe({standalone: true, name: 'round'})
export class RoundPipe {
  transform (input:number) {
    return Math.round(input);
  }
}
