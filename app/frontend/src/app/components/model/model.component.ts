/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PredictionsService } from '../../services/predictions.service';

interface Item {
  value: string;
  viewValue: string;
}
interface ItemShort {
  value: string;
}

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent implements OnInit {

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

  maritalStatusList: Item[] = [
    {value: '0', viewValue: 'Single'},
    {value: '1', viewValue: 'Married'},
  ];

  occupationList: ItemShort[] = [
    {value: '0'},
    {value: '1'},
    {value: '2'},
    {value: '3'},
    {value: '4'},
    {value: '5'},
    {value: '6'},
    {value: '7'},
    {value: '8'},
    {value: '9'},
    {value: '10'},
    {value: '11'},
    {value: '12'},
    {value: '13'},
    {value: '14'},
    {value: '15'},
    {value: '16'},
    {value: '17'},
    {value: '18'},
    {value: '19'},
    {value: '20'},
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

  selectedGender!: string;
  selectedAge!: string;
  selectedMaritalStatus!: string;
  selectedOccupation!: string;
  selectedCityCategory!: string;
  selectedStayInCity!: string;

  predictionResult: string = '';

  constructor(private predictionsService: PredictionsService) { }

  ngOnInit(): void { }

  onSubmit(): void {
    if (!this.selectedGender || !this.selectedAge || !this.selectedMaritalStatus
        || !this.selectedOccupation || !this.selectedCityCategory || !this.selectedStayInCity) {
      return;
    }
    this.predictionsService.getPrediction(this.selectedGender, this.selectedAge,
                  this.selectedMaritalStatus, this.selectedOccupation,
                  this.selectedCityCategory, this.selectedStayInCity,
                  v => { this.predictionResult = v; });
  }
}
