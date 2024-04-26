import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/services/local-storage.service';
import { TaskService } from 'src/services/task.service';

@Component({
  selector: 'app-show-task',
  templateUrl: './show-task.component.html',
  styleUrls: ['./show-task.component.css']
})
export class ShowTaskComponent implements OnInit {

  IsShowNewTask:boolean = false;
  newTaskMode:string = 'Add';

  selectedTask:any = null;
  selectedTaskIndexForEdit:any = null;

  constructor(public taskService: TaskService, public localStorageService: LocalStorageService) { }
  @Input('currentData') currentData;

  ngOnInit() {
    console.log(this.currentData)
  }
  showNewTask(mode) {
    this.IsShowNewTask =  true;
    this.newTaskMode = mode;
  }
  editSelectedTask(mode, data, index) {
    this.IsShowNewTask =  true;
    this.newTaskMode = mode;
    if(mode == 'Update') {
      this.selectedTask = data;
      this.selectedTaskIndexForEdit = index;
    }
  }
  closeNewTask(event) {
    if(event && this.newTaskMode == 'Add') {
      this.addOneTaskToTaskArray(event);
    }else if(event && this.newTaskMode == 'Update') {
      this.updateTaskInTaskArray(event);
    }
    this.IsShowNewTask = false;
    this.newTaskMode = 'Add';
    this.selectedTaskIndexForEdit = null;
  }
  addOneTaskToTaskArray(obj) {
    this.taskService.AllDateTask.forEach(v =>  {
      if(new Date(v.Date).toDateString() == new Date(this.currentData.Date).toDateString()) {
        v.Tasks.push(obj);
      }
    });
    
    this.localStorageService.setItem(this.taskService.taskKey, this.taskService.AllDateTask);
    this.updateCurrentData();

  }
  updateTaskInTaskArray(obj) {
    this.taskService.AllDateTask.forEach(v =>  {
      if(new Date(v.Date).toDateString() == new Date(this.currentData.Date).toDateString()) {
        if(this.selectedTaskIndexForEdit !== null) {
          v.Tasks[this.selectedTaskIndexForEdit] = obj;
        }
      }
    });
     this.localStorageService.setItem(this.taskService.taskKey, this.taskService.AllDateTask);
    this.updateCurrentData();

  }
  deleteSelectedTask(mode, data, index) {
    this.taskService.AllDateTask.forEach(v =>  {
      if(new Date(v.Date).toDateString() == new Date(this.currentData.Date).toDateString()) {
        v.Tasks.splice(index, 1)
      }
    });
    this.localStorageService.setItem(this.taskService.taskKey, this.taskService.AllDateTask);
    this.updateCurrentData();
  }
  updateCurrentData() {
    this.taskService.AllDateTask.forEach(v =>  {
      if(new Date(v.Date).toDateString() == new Date(this.currentData.Date).toDateString()) {
        this.currentData = JSON.parse(JSON.stringify(v))
      }
    });
  }
}
