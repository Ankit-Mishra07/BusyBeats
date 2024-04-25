import { Component, Input, OnInit } from '@angular/core';
import { EachTask, Task } from 'src/models/task.model';
import { TaskService } from 'src/services/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {

  @Input('currentData') currentData;
  @Input('mode') mode;

  newTaskForm:EachTask = {
    Summary: '',
    Link: '',
    Status: ''
  }

  constructor(public taskService: TaskService) { }

  ngOnInit() {
    if(this.mode == 'Add') {
      this.resetForm();
    }
  }
  resetForm() {
    this.newTaskForm = {
      Summary: '',
      Link: '',
      Status: ''
    }
  }

}
