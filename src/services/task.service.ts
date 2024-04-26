import { Injectable } from '@angular/core';
import { Task } from 'src/models/task.model';
import { LocalStorageService } from './local-storage.service';

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
      Date: new Date(),
      Tasks: []
    }
  }

  getPreviousTaskAndCurrentDate() {
    let allTasks:any[] = this.getAllTaskList();

    allTasks = allTasks.filter(v => new Date(v.Date).toDateString() == new Date().toDateString());
    if(!allTasks.length) {
      allTasks.push(this.currentDateEmptyTask());
    }
    this.localStorageService.setItem(this.taskKey, allTasks);
    this.AllDateTask = allTasks;
  }
  getAllTaskList() {
    return this.localStorageService.getItem(this.taskKey) || [];
  }
}
