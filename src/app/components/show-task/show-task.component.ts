import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/services/local-storage.service';
import { TaskService } from 'src/services/task.service';
import * as _swal from 'sweetalert'
import { SweetAlert } from 'sweetalert/typings/core';
@Component({
  selector: 'app-show-task',
  templateUrl: './show-task.component.html',
  styleUrls: ['./show-task.component.css']
})
export class ShowTaskComponent implements OnInit {

  IsShowNewTask:boolean = false;
  newTaskMode:string = 'Add';

  IsShowNotes = false;

  selectedTask:any = null;
  selectedTaskIndexForEdit:any = null;

  maxDate = new Date();
  minDate = new Date();

  swal:SweetAlert = _swal as any;

  constructor(public taskService: TaskService, public localStorageService: LocalStorageService) { }
  @Input('currentData') currentData;

  ngOnInit() {
    console.log(this.currentData)
    this.currentData.Date = new Date(this.taskService.formatDateYYYYMMDD(this.currentData.Date));

    this.maxDate = new Date(this.taskService.AllDateTask[this.taskService.AllDateTask.length - 1].Date);
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
    this.taskService.checkIsLocalStorageFull();

    if(event && this.newTaskMode == 'Add') {
      this.addOneTaskToTaskArray(event);
    }else if(event && this.newTaskMode == 'Update') {
      this.updateTaskInTaskArray(event);
    }
    this.IsShowNewTask = false;
    this.newTaskMode = 'Add';
    this.selectedTaskIndexForEdit = null;
    this.taskService.checkIsLocalStorageFull();
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
    let curDate2 = new Date(this.currentData.Date);
    let previousDate = new Date(curDate.setDate(new Date(curDate).getDate() - 1));

    if(this.currentData.Tasks && this.currentData.Tasks.length) {
      this.swal({
        title: "Are you sure?",
        text: `Once forwarded tasks from ${previousDate.toDateString()}, you will not be able to recover ${curDate2.toDateString()} tasks!`,
        icon: "warning",
        buttons: ['Cancel', 'Yes'],
        dangerMode: true,
      }).then((willForward) => {
        if(willForward) {
          this.forwardData();
        }else {}
      })
    }else {
      this.forwardData();
    }
  }
  forwardData() {
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
  OpenNotes() {
    this.IsShowNotes = true;
  }
  closeNotesPopup(text) {
    this.IsShowNotes = false;
    this.currentData.Notes = text;
    this.taskService.AllDateTask.forEach(v =>  {
      if(new Date(v.Date).toDateString() == new Date(this.currentData.Date).toDateString()) {
        v.Notes = JSON.parse(JSON.stringify(text))
      }
    });
    this.localStorageService.setItem(this.taskService.taskKey, this.taskService.AllDateTask);
  }
}
