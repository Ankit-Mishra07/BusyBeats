import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskView'
})
export class TaskViewPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value == 'https://idsnextbusinesssolutions.atlassian.net/browse/') {
      return 'Jira Id'
    }
    return value.replace('https://idsnextbusinesssolutions.atlassian.net/browse/', '');
  }

}
