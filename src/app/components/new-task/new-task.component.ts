import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input('selectedTask') selectedTask:any;
  @Output('backToParent') backToParent: EventEmitter<Object> = new EventEmitter();

  newTaskForm:EachTask = {
    Summary: '',
    Link: '',
    Status: ''
  }

  constructor(public taskService: TaskService) { }

  ngOnInit() {
    if(this.mode == 'Add') {
      this.resetForm();
      this.newTaskForm.Link = 'https://idsnextbusinesssolutions.atlassian.net/browse/'
    }else if(this.mode == 'Update' && this.selectedTask) {
      this.newTaskForm = JSON.parse(JSON.stringify(this.selectedTask));
    }
  }
  resetForm() {
    this.newTaskForm = {
      Summary: '',
      Link: '',
      Status: ''
    }
  }

  addNewTasktoList() {
    if(!this.newTaskForm.Summary || !this.newTaskForm.Status) {
      return;
    }
    this.backToParent.emit(this.newTaskForm);
  }
  closePopup() {
    this.resetForm();
    this.backToParent.emit(null);
  }

}
