/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

package com.epam.gcp.blackfriday.mlfinishhandler;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import java.io.IOException;
import java.util.logging.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Spring Framework configuration.
 * Cloud Functions only finds injection binding if it's configured in a provider method.
 */
@Configuration
@ComponentScan("com.epam.gcp.blackfriday.mlfinishhandler")
public class Config {

  private Firestore firestore;

  public Config() throws IOException {
    GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
    FirebaseOptions options = FirebaseOptions.builder()
        .setCredentials(credentials)
        .setProjectId(System.getenv("project"))
        .build();
    FirebaseApp.initializeApp(options);
  }

  @Bean
  public Logger createLogger() {
    return Logger.getLogger(MlFinishFunctionPubSubEvent.class.getName());
  }

  @Bean
  public MlFinishHandler createMlFinishHandler() {
    return new MlFinishHandler();
  }

  @Bean
  public FirestoreDao createFirestoreDao() {
    return new FirestoreDao();
  }

  @Bean
  public Firestore createFirestore() {
    if (firestore == null) {
      firestore = FirestoreClient.getFirestore();
    }
    return firestore;
  }

  @Bean("users")
  public CollectionReference createUsersCollectionReference() {
    return createFirestore().collection("users");
  }
}
