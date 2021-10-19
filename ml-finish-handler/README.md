# Deployment:  
gcloud functions deploy black-friday-on-training-complete \
    --entry-point=com.epam.gcp.blackfriday.mlfinishhandler.MlFinishFunctionPubSubEvent \
    --runtime=java11 \
    --trigger-topic=black-friday-training-finish \
    --region=us-central1 \
    --memory=256MB \
    --service-account=<SERVICE_ACCOUNT_EMAIL>  \
    --set-env-vars project=<PROJECT_ID>
