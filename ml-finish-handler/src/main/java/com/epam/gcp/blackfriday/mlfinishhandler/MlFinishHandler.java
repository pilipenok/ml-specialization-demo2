/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

package com.epam.gcp.blackfriday.mlfinishhandler;

import com.epam.gcp.blackfriday.mlfinishhandler.FirestoreDao.DaoException;
import com.epam.gcp.blackfriday.mlfinishhandler.FirestoreDao.ModelStatus;
import org.springframework.beans.factory.annotation.Autowired;

public class MlFinishHandler {

  @Autowired
  private FirestoreDao firestoreDao;

  public void onTrainingSuccess(String mlEndpointId)
      throws InterruptedException, DaoException {
    firestoreDao.setModelStatus(mlEndpointId, ModelStatus.SUCCESS);
  }

  public void onTrainingError(String mlEndpointId, String error)
      throws InterruptedException, DaoException {
    firestoreDao.setModelStatus(mlEndpointId, ModelStatus.ERROR, error);
  }
}
