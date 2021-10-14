/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

package com.epam.gcp.blackfriday.mlfinishhandler;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutureCallback;
import com.google.api.core.ApiFutures;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.common.util.concurrent.MoreExecutors;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executor;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.Nullable;
import javax.annotation.Resource;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Firestore DAO.
 */
public class FirestoreDao {

  @Autowired
  private Logger logger;

  @Autowired
  private Firestore firestore;

  @Resource(name = "users")
  private CollectionReference users;

  enum ModelStatus {
    SUCCESS(2),
    ERROR(-1);

    private final int statusId;

    ModelStatus(int statusId) {
      this.statusId = statusId;
    }
  }

  public void setModelStatus(String mlEndpointId, ModelStatus status)
      throws InterruptedException, DaoException {
    setModelStatus(mlEndpointId, status, null);
  }

  public void setModelStatus(String mlEndpointId, ModelStatus status, @Nullable String error)
      throws InterruptedException, DaoException {
    Executor executor = MoreExecutors.directExecutor();

    final FutureResult<Throwable> queryException = new FutureResult<>();
    final FutureResult<List<QueryDocumentSnapshot>> queryResult = new FutureResult<>();
    final CountDownLatch queryLatch = new CountDownLatch(1);

    ApiFuture<QuerySnapshot> future = users.whereEqualTo("ml_endpoint_id", mlEndpointId)
        .limit(1).get();

    ApiFutures.addCallback(future, new ApiFutureCallback<>() {

      @Override
      public void onSuccess(QuerySnapshot result) {
        queryResult.setValue(result.getDocuments());
        queryLatch.countDown();
      }

      @Override
      public void onFailure(Throwable t) {
        logger.log(Level.SEVERE,
            String.format("Error while retrieving the document with ML endpoint %s",
                mlEndpointId), t);
        queryException.setValue(t);
        queryLatch.countDown();
      }
    }, executor);

    queryLatch.await();

    if (queryException.getValue() != null) {
      throw new DaoException(queryException.getValue());
    }
    if (queryResult.getValue() == null) {
      throw new DaoException(String.format("Query result for %s has not been found.",
          mlEndpointId));
    }
    if (queryResult.getValue().isEmpty()) {
      throw new DaoException(String.format("ML Endpoint %s has not been found.",
          mlEndpointId));
    }

    Map<String, Object> modelState = new HashMap<>();
    modelState.put("status", status.statusId);
    modelState.put("error", error);

    final FutureResult<Throwable> updateException = new FutureResult<>();
    final FutureResult<WriteResult> updateResult = new FutureResult<>();
    final CountDownLatch updateLatch = new CountDownLatch(1);

    ApiFuture<WriteResult> updateFuture = queryResult.getValue().get(0).getReference()
        .update("model_state", modelState);

    ApiFutures.addCallback(updateFuture, new ApiFutureCallback<>() {

      @Override
      public void onSuccess(WriteResult result) {
        updateResult.setValue(result);
        updateLatch.countDown();
      }

      @Override
      public void onFailure(Throwable t) {
        logger.log(Level.SEVERE,
            String.format("Error while updating ML endpoint status (%s)", mlEndpointId), t);
        updateException.setValue(t);
        updateLatch.countDown();
      }
    }, executor);

    updateLatch.await();

    if (updateException.getValue() != null) {
      throw new DaoException(updateException.getValue());
    }
  }

  /**
   * FirestoreDao Exception.
   */
  class DaoException extends Exception {

    DaoException(String msg) {
      super(msg);
    }

    DaoException(Throwable t) {
      super(t);
    }
  }

  /**
   * Wrapper class. Keeps the results returned by async calls to Firestore.
   */
  @Data
  class FutureResult<T> {
    private T value;
  }
}
