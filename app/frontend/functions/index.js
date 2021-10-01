/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

const functions = require("firebase-functions");

async function predictCustomTrainedModel() {
  const util = require('util');
  const {PredictionServiceClient} = require('@google-cloud/aiplatform');

  const clientOptions = {
    apiEndpoint: 'us-central1-aiplatform.googleapis.com',
  };
  const predictionServiceClient = new PredictionServiceClient(clientOptions);

  const endpoint = `projects/877218744686/locations/us-central1/endpoints/4478530762257203200`;
  const parameters = {
    structValue: {
      fields: {},
    },
  };
  const instance = {
    structValue: {
      fields: {
        input_1: {numberValue: 1},
      },
    },
  };

  const instances = [instance];
  const request = {
    endpoint,
    instances,
    parameters,
  };

  const response = await predictionServiceClient.predict(request);
  return response;
}

exports.getPredictions = functions.https.onCall(async(data, context) => {
  if (!context.auth || !context.auth.uid) {
    return {
      error: 'Unauthorized'
    };
  }
  const res = predictCustomTrainedModel();
  return res;
});
