/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Observable } from 'rxjs';

export interface Row {
  position: number;
  item: string;
  prediction: number;
}

@Injectable({
  providedIn: 'root'
})
export class PredictionsService {

  readonly getPredictionsFunction = this.fns.httpsCallable('getPredictions');

  constructor(private fns: AngularFireFunctions) { }

  getPrediction(gender: string, age: string, maritalStatus: number, occupation: number,
                cityCategory: string, stayInCityYears: string,
                onSuccessFn: (values: Row[]) => void,
                onErrorFn: (error: string) => void,
                onComplete: () => void) {
    const response: Observable<any> = this.getPredictionsFunction({
      gender: gender,
      age: age,
      maritalStatus: maritalStatus,
      occupation: occupation,
      cityCategory: cityCategory,
      stayInCityYears: stayInCityYears
    });

    response.subscribe(
      (encodedPromise) => {
        const values = this.extractValues(encodedPromise);
        onSuccessFn(values);
      },
      (error) => {
        onErrorFn(error);
      },
      () => {
        onComplete();
      });
  }

  extractValues(encodedPromise: any): Row[] {
    const [a] = encodedPromise;
    const [predictions] = a.predictions;
    const v1 = predictions.structValue.fields.output_1.listValue.values;
    const v2 = predictions.structValue.fields.output_2.listValue.values;
    let result:Row[] = [];
    for (let i = 0; i < v1.length; i++) {
      result[i] = {
          position: i + 1,
          item: v2[i].stringValue,
          prediction: v1[i].numberValue
        };
    }
    return result;
  }
}
