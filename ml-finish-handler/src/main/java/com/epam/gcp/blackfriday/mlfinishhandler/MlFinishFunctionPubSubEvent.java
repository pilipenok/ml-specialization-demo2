/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

package com.epam.gcp.blackfriday.mlfinishhandler;

import com.epam.gcp.blackfriday.mlfinishhandler.FirestoreDao.DaoException;
import com.google.cloud.functions.BackgroundFunction;
import com.google.cloud.functions.Context;
import com.google.events.cloud.pubsub.v1.Message;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

/**
 * Cloud Function with a Pub/Sub trigger. The function receives a message containing
 * ML training result, and updates corresponding user data in Firestore.
 */
public class MlFinishFunctionPubSubEvent implements BackgroundFunction<Message> {

  private final MlFinishHandler mlFinishHandler;

  public MlFinishFunctionPubSubEvent() {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(Config.class);
    mlFinishHandler = ctx.getBean(MlFinishHandler.class);
  }

  @Override
  public void accept(Message message, Context context) throws InterruptedException, DaoException {
    String data = new String(
        Base64.getDecoder().decode(message.getData().getBytes(StandardCharsets.UTF_8)),
        StandardCharsets.UTF_8);
    JsonObject jsonObject = JsonParser.parseString(data).getAsJsonObject();

    String endpointId = jsonObject.get("endpoint_id").getAsString();
    String error = null;
    if (jsonObject.has("error")) {
      error = jsonObject.get("error").getAsString();
    }

    if (error == null || error.isBlank()) {
      mlFinishHandler.onTrainingSuccess(endpointId);
    } else {
      mlFinishHandler.onTrainingError(endpointId, error);
    }
  }
}
