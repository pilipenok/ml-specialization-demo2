/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Component, OnInit } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardModule,
  MatCardTitle
} from '@angular/material/card';
import { PredictionsService, Row } from '../../services/predictions.service';
import { DatasetDaoService, User } from '../../services/dataset-dao.service';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatOption} from "@angular/material/autocomplete";
import {MatError, MatFormField, MatSelect} from "@angular/material/select";
import {MatLabel} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatButton} from "@angular/material/button";

interface Item {
  value: string;
  viewValue: string;
}
interface ItemShort {
  value: string;
}
interface ItemNumber {
  value: number;
  viewValue: string;
}
interface ItemNumberShort {
  value: number;
}

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css'],
  imports: [
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatTable,
    MatProgressBar,
    MatCardFooter,
    MatCardActions,
    MatOption,
    MatSelect,
    MatLabel,
    MatFormField,
    FormsModule,
    CommonModule,
    MatRow,
    MatHeaderRow,
    MatCell,
    MatHeaderCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatButton,
    MatHeaderRowDef,
    MatRowDef
  ]
})
export class ModelComponent implements OnInit {

  selectedGender!: string;
  selectedAge!: string;
  selectedMaritalStatus!: number;
  selectedOccupation!: number;
  selectedCityCategory!: string;
  selectedStayInCity!: string;

  requestError: string | null = null;
  queryInProgress: boolean = false;

  displayedColumns: string[] = ['position', 'item', 'prediction'];
  dataSource: Row[] = [];
  modelStatus!: number | undefined;
  modelError: string | undefined;

  constructor(private predictionsService: PredictionsService, private dao: DatasetDaoService) { }

  ngOnInit(): void {
    let userData = this.dao.getUserData();
    userData.subscribe(
          (value:User | undefined) => {
            this.modelStatus = value?.model_state?.status;
            this.modelError = value?.model_state?.error;
          },
          (error) => {
            console.log(error);
          });
  }

  onSubmit(): void {
    if (this.selectedGender == undefined || this.selectedAge == undefined
        || this.selectedMaritalStatus == undefined || this.selectedOccupation == undefined
        || this.selectedCityCategory == undefined || this.selectedStayInCity == undefined) {
      return;
    }
    this.queryInProgress = true;
    this.dataSource = [];
    this.requestError = null;
    this.predictionsService.getPrediction(this.selectedGender, this.selectedAge,
                  this.selectedMaritalStatus, this.selectedOccupation,
                  this.selectedCityCategory, this.selectedStayInCity,
                  (values: Row[]) => {
                    this.dataSource = values;
                  },
                  error => {
                    this.requestError = error;
                  },
                  () => {
                    this.queryInProgress = false;
                  });
  }

  genderList: Item[] = [
    {value: 'M', viewValue: 'Male'},
    {value: 'F', viewValue: 'Female'},
  ];

  ageList: ItemShort[] = [
    {value: '0-17'},
    {value: '18-25'},
    {value: '26-35'},
    {value: '36-45'},
    {value: '46-50'},
    {value: '51-55'},
    {value: '55+'},
  ];

  maritalStatusList: ItemNumber[] = [
    {value: 0, viewValue: 'Single'},
    {value: 1, viewValue: 'Married'},
  ];

  occupationList: ItemNumberShort[] = [
    {value: 0},
    {value: 1},
    {value: 2},
    {value: 3},
    {value: 4},
    {value: 5},
    {value: 6},
    {value: 7},
    {value: 8},
    {value: 9},
    {value: 10},
    {value: 11},
    {value: 12},
    {value: 13},
    {value: 14},
    {value: 15},
    {value: 16},
    {value: 17},
    {value: 18},
    {value: 19},
    {value: 20},
  ];

  cityCategoryList: ItemShort[] = [
    {value: 'A'},
    {value: 'B'},
    {value: 'C'},
  ];

  stayInCityList: ItemShort[] = [
    {value: '0'},
    {value: '1'},
    {value: '2'},
    {value: '3'},
    {value: '4+'},
  ];
}
