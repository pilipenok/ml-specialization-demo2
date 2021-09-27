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

@Injectable({
  providedIn: 'root'
})
export class PredictionsService {

  readonly callable = this.fns.httpsCallable('getPrediction');

  constructor(private fns: AngularFireFunctions) { }

  getPrediction() {
    const res: Observable<any> = this.callable({ name: 'some-data' });
    res.subscribe(v => { console.log(v.prediction); });
  }
}
