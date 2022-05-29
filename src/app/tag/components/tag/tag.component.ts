import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITag } from '../../models/tag';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  @Input() tag: string;

  @Output() deleteEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  delete(): void {
    this.deleteEvent.emit(this.tag);
  }

}
