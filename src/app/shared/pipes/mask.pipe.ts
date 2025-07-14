import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask',
  standalone: true
})
export class MaskPipe implements PipeTransform {
  transform(value: string, mask: string = 'X'): string {
    if (!value) return '';
    if (value.length <= 4) return value;
    return '****' + value.slice(-4);
  }
}
