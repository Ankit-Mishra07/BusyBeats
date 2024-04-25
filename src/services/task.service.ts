import { Injectable } from '@angular/core';
import { Task } from 'src/models/task.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  taskKey:string = 'Tasks'
  AllDateTask:Task[] = [];

  constructor(public localStorageService: LocalStorageService) { }



  currentDateEmptyTask() {
    return {
      Date: new Date(),
      Tasks: []
    }
  }

  getPreviousTaskAndCurrentDate() {
    let allTasks:any[] = this.localStorageService.getItem(this.taskKey) || [];

    allTasks = allTasks.filter(v => v.Date.toDateString() == new Date().toDateString());
    if(!allTasks.length) {
      console.log(this.currentDateEmptyTask())
      allTasks.push(this.currentDateEmptyTask());
    }
    this.localStorageService.setItem(this.taskKey, allTasks);
    this.AllDateTask = allTasks;
  }
}
