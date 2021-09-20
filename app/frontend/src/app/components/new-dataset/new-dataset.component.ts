import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatasetDaoService } from '../../services/dataset-dao.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-dataset',
  templateUrl: './new-dataset.component.html',
  styleUrls: ['./new-dataset.component.css']
})
export class NewDatasetComponent {

  value = "Clear Me";
  
  name = new FormControl('', [Validators.required]);
  description = new FormControl('');
  file = new FormControl('', [Validators.required]);

  constructor(private authService: AuthService, private dao : DatasetDaoService) { }
  
  onSubmit() {
    if (this.name.errors == null && this.description.errors == null) {
      let datasetId = this.dao.generateId();
      this.dao.createDataset(datasetId, this.name.value, this.description.value);
    }
  }
}

