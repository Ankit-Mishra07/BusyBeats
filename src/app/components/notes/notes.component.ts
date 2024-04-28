import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  @Input('currentData') currentData;
  @Output('backToParent') backToParent: EventEmitter<string> = new EventEmitter();

  notes = '';

  constructor() { }

  ngOnInit() {
    if(this.currentData) {
      this.notes = this.currentData.Notes;
    }
  }

  onClosepopup() {
    this.backToParent.emit(this.notes);
  }



}
