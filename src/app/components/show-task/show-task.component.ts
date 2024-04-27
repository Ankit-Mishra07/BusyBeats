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

  maxDate = new Date();
  minDate = new Date();

  constructor(public taskService: TaskService, public localStorageService: LocalStorageService) { }
  @Input('currentData') currentData;

  ngOnInit() {
    console.log(this.currentData)
    this.currentData.Date = new Date(this.taskService.formatDateYYYYMMDD(this.currentData.Date));

    this.minDate = new Date(this.taskService.AllDateTask[0].Date);

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
  copyTasksFromPreviousDateToCurrentDate() {
    let curDate = new Date(this.currentData.Date);
    let previousDate = new Date(curDate.setDate(new Date(curDate).getDate() - 1));
    let previousDateObj = this.taskService.AllDateTask.find(v => new Date(v.Date).toDateString() == new Date(previousDate).toDateString());
    if(!previousDateObj) return;

    this.taskService.AllDateTask.forEach(v =>  {
      if(new Date(v.Date).toDateString() == new Date(this.currentData.Date).toDateString()) {
        v.Tasks = JSON.parse(JSON.stringify(previousDateObj.Tasks))
      }
    });

    this.localStorageService.setItem(this.taskService.taskKey, this.taskService.AllDateTask);
    this.updateCurrentData();
  }

  filerBasedOnDate() {
    this.taskService.AllDateTask.forEach(v =>  {
      if(new Date(v.Date).toDateString() == new Date(this.currentData.Date).toDateString()) {
        this.currentData = JSON.parse(JSON.stringify(v))
      }
    });
  }

  copySingleTask(item) {
    let output = item.Summary + ' -- ' + item.Link + ' -- ' + item.Status;
    this.taskService.copyToClipboard(output)
  }
}
