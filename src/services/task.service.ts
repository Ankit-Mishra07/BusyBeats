import { Injectable } from '@angular/core';
import { Task } from 'src/models/task.model';
import { LocalStorageService } from './local-storage.service';
import * as _swal from 'sweetalert'
import { SweetAlert } from 'sweetalert/typings/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  taskKey:string = 'Tasks'
  AllDateTask:Task[] = [];
  statusList:string[] = [
    'TBD',
    'Todo',
    'In Progress',
    'Code Review',
    'Fixed(QA)',
    'QA Testing',
    'Confirmed for Staging',
    // 'Ready for Staging',
    'Moved to Staging',
    'Fixed(Staging)',
    'Staging Testing',
    'Confirmed for Production',
    'Shared for Production',
    'Done'
  ];

  swal:SweetAlert = _swal as any;


  constructor(public localStorageService: LocalStorageService) { }



  currentDateEmptyTask() {
    return {
      Date: new Date().toDateString(),
      Notes: '',
      Tasks: [],
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
    output += new Date(currentData.Date).toDateString() + '\n' + '\n';
    currentData.Tasks.forEach((v, i) => {
      output += i + 1 + '. ' + v.Summary + ' -- ' + v.Link + ' -- ' + v.Status + '\n' + '\n';
    });
    this.copyToClipboard(output);
  }
  copyAllDateallTasks() {
    let output = this.getAllDateTasksAsText();
    this.copyToClipboard(output);
  }
  getAllDateTasksAsText() {
    let output = '';
    this.AllDateTask.forEach((cur) => {
      output += new Date(cur.Date).toDateString() + '\n' + '\n';
      cur.Tasks.forEach((v, i) => {
        output += i + 1 + '. ' + v.Summary + ' -- ' + v.Link + ' -- ' + v.Status + '\n' + '\n';
      });
      output += '\n' + '\n'
    });
    return output;
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

    this.swal({
      icon: "success",
      title: "Your work has been copied",
      timer: 1500
    });

  }

  exportAllToTextFile() {
    let output = this.getAllDateTasksAsText();
    const link = document.createElement("a");
    const content = output;
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = `${new Date().toDateString()}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  deleteAllDateTasks() {
    this.swal({
        title: "Are you sure?",
        text: `Once you deleted all dates tasks, you will not be able to recover tasks!`,
        icon: "warning",
        buttons: ['Cancel', 'Yes'],
        dangerMode: true,
      }).then((willDelete) => {
        if(willDelete) {
          this.localStorageService.removeItem(this.taskKey);
          this.exportAllToTextFile();
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        }else {}
      })
  }

  checkIsLocalStorageFull() {
    const jsonString = JSON.stringify(this.localStorageService.getItem(this.taskKey));
    const jsonSizeInBytes = new Blob([jsonString]).size;
    const jsonSizeInMB = this.bytesToMB(jsonSizeInBytes);
    if(jsonSizeInMB < 4.8) {
      return false;
    }else {
      this.deleteDataWhenLocalStorageIsFull();
      return true;
    }
  }
  bytesToMB(bytes) {
    return bytes / (1024 * 1024);
  }

  deleteDataWhenLocalStorageIsFull() {
    this.swal({
        title: "Information!",
        text: `Please Allow us to delete previous date all tasks, data will get exported as text file!`,
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
            let curDateData = this.AllDateTask.filter(v => new Date(v.Date).toDateString() == new Date().toDateString());
            this.localStorageService.removeItem(this.taskKey);
            this.localStorageService.setItem(this.taskKey, curDateData)
            this.exportAllToTextFile();
            this.AllDateTask = this.localStorageService.getItem(this.taskKey);
            window.location.reload();
            
      })
  }

  sortByDatesAndSaveToLocal() {
    this.AllDateTask.sort((a:any, b:any) => {
      return  new Date(a.Date).getTime() - new Date(b.Date).getTime();
    });
    this.localStorageService.setItem(this.taskKey, this.AllDateTask);
  }

}
