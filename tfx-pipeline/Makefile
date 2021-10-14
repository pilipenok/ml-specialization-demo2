GOOGLE_CLOUD_PROJECT ?= or2--epm-gcp-by-meetup2-t1iylu
ENDPOINT ?= https://4e0115c7a3a887cd-dot-us-central1.pipelines.googleusercontent.com
PIPELINE_NAME ?= tfx-pipeline-ml


create:
	tfx pipeline create --pipeline-path=kubeflow_runner.py --endpoint=${ENDPOINT} --build-image

update:
	tfx pipeline update --pipeline-path=kubeflow_runner.py --endpoint=${ENDPOINT} --build-image

create:
	tfx pipeline create --pipeline-path=kubeflow_runner.py --endpoint=${ENDPOINT} --build-image
    
run:
	tfx run create --pipeline-name ${PIPELINE_NAME} --endpoint=${ENDPOINT}
    
build:
	gcloud builds submit --tag us.gcr.io/or2--epm-gcp-by-meetup2-t1iylu/black-friday-pipeline-vertex --timeout 3600


create-run: create run
update-run: update run
