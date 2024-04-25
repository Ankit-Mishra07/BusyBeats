import { Component, OnInit } from '@angular/core';
import { Task } from 'src/models/task.model';
import { TaskService } from 'src/services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public taskService: TaskService) { }

  currentData:Task = {Date: new Date(), Tasks: []}

  ngOnInit() {
    this.taskService.getPreviousTaskAndCurrentDate();
    this.setCurrentData(new Date())
  }

  setCurrentData(date:Date) {
    this.currentData = this.taskService.AllDateTask.find(v => new Date(v.Date).toDateString() == new Date(date).toDateString());
    console.log(this.currentData)
  }


}
