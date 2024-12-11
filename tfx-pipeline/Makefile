GOOGLE_CLOUD_PROJECT ?= ml-spec-black-friday-46176
ENDPOINT ?= https://4e0115c7a3a887cd-dot-us-central1.pipelines.googleusercontent.com
PIPELINE_NAME ?= tfx-pipeline-ml-demo2-black-friday
PIPELINE_IMAGE = us.gcr.io/${GOOGLE_CLOUD_PROJECT}/${PIPELINE_NAME}-vertex

create:
	tfx pipeline create --pipeline-path=kubeflow_runner.py --endpoint=${ENDPOINT} --build-image

update:
	tfx pipeline update --pipeline-path=kubeflow_runner.py --endpoint=${ENDPOINT} --build-image
    
run:
	tfx run create --pipeline-name ${PIPELINE_NAME} --endpoint=${ENDPOINT}
    
build:
	gcloud builds submit --tag us.gcr.io/${GOOGLE_CLOUD_PROJECT}/${PIPELINE_NAME}-vertex --timeout 3600

go:
	docker images ${PIPELINE_IMAGE} -q | xargs -r docker rmi
	docker build --tag ${PIPELINE_IMAGE} .
	docker push ${PIPELINE_IMAGE}
	uv run vertex_compile.py
	uv run vertex_run_new.py

go2: go go

create-run: create run
update-run: update run
