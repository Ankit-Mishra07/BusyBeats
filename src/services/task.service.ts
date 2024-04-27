import { Injectable } from '@angular/core';
import { Task } from 'src/models/task.model';
import { LocalStorageService } from './local-storage.service';
import swal from 'sweetalert'

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  taskKey:string = 'Tasks'
  AllDateTask:Task[] = [];
  statusList:string[] = [
    'Todo',
    'In Progress',
    'Code Review',
    'QA Testing',
    'Ready for Staging',
    'Moved to Staging',
    'Confirmed for Production',
    'Done'
  ]

  constructor(public localStorageService: LocalStorageService) { }



  currentDateEmptyTask() {
    return {
      Date: new Date().toDateString(),
      Tasks: []
    }
  }

  getPreviousTaskAndCurrentDate() {
    let allTasks:any[] = this.getAllTaskList();

    let curDateData = allTasks.filter(v => new Date(v.Date).toDateString() == new Date().toDateString());
    if(!curDateData.length) {
      allTasks.push(this.currentDateEmptyTask());
    }
    this.localStorageService.setItem(this.taskKey, allTasks);
    this.AllDateTask = allTasks;
  }
  getAllTaskList() {
    return this.localStorageService.getItem(this.taskKey) || [];
  }

  formatDateYYYYMMDD(date) {
    let d = new Date(date);
    let yyyy = d.getFullYear();
    let mm:any = d.getMonth() + 1;
    if(mm <= 9) {
      mm = `0${mm}`
    }
    let dd = d.getDate();

    return `${yyyy}-${mm}-${dd}`
  }

  copyCurrentDataAllTasks(currentData) {
    let output = '';
    output += new Date(currentData.Date).toDateString() + '\n';
    currentData.Tasks.forEach((v, i) => {
      output += i + 1 + '. ' + v.Summary + ' -- ' + v.Link + ' -- ' + v.Status + '\n';
    });
    this.copyToClipboard(output);
  }
    copyToClipboard(content: string): void {
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    swal({
      icon: "success",
      title: "Your work has been copied",
      timer: 1500
    });

  }
}
