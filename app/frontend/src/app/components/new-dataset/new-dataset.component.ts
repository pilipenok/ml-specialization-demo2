import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-dataset',
  templateUrl: './new-dataset.component.html',
  styleUrls: ['./new-dataset.component.css']
})
export class NewDatasetComponent implements OnInit {

value = "Clear Me"

  constructor() { }

  ngOnInit(): void {
  }

}
