import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ standalone: true, name: 'hour' })
export class HourPipe implements PipeTransform {
  transform(input: string) {
    const result = input.split(':');
    return `${result[0]}:${result[1]}`;
  }
}
