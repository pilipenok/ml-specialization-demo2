"""TFX taxi template configurations.
This file defines environments for a TFX taxi pipeline.
"""

import tfx

PIPELINE_NAME = 'tfx-pipeline-ml-demo2-black-friday'
MODEL_NAME = 'black_friday_model'
GOOGLE_CLOUD_PROJECT = 'or2--epm-gcp-by-meetup2-t1iylu'
GCS_BUCKET_NAME = 'epm-spec-black-friday'
GOOGLE_CLOUD_REGION = 'us-central1'

# Specifies data file directory. DATA_PATH should be a directory containing CSV files for CsvExampleGen in this example.
DATA_PATH = f'gs://{GCS_BUCKET_NAME}/data/'
LOCAL_DATA_PATH = '.'

# Following image will be used to run pipeline components run if Kubeflow
# Pipelines used.
# This image will be automatically built by CLI if we use --build-image flag.
# PIPELINE_IMAGE = f'gcr.io/{GOOGLE_CLOUD_PROJECT}/{PIPELINE_NAME}'
PIPELINE_IMAGE = f'gcr.io/{GOOGLE_CLOUD_PROJECT}/{PIPELINE_NAME}-vertex'

# See here https://cloud.google.com/vertex-ai/docs/predictions/pre-built-containers
VERTEX_IMAGE = 'us-docker.pkg.dev/vertex-ai/prediction/tf2-cpu.2-6:latest'

PREPROCESSING_FN = 'models.preprocessing.preprocessing_fn'
RUN_FN = 'models.baseline.model.run_fn'
MODULE_FILE = f'gs://{GCS_BUCKET_NAME}/model.py'
SERVING_MODEL_DIR = f'gs://{GCS_BUCKET_NAME}/serving_model'

TRAIN_NUM_STEPS = 1
EVAL_NUM_STEPS = 1
# EVAL_ACCURACY_THRESHOLD = 0.6
# TRAIN_BATCH_SIZE = 16
# EVAL_BATCH_SIZE = 16

USE_GPU = False
# A dict which contains the training job parameters to be passed to Google
# Cloud AI Platform. For the full set of parameters supported by Google Cloud AI
# Platform, refer to https://cloud.google.com/ml-engine/reference/rest/v1/projects.jobs#Job
GCP_AI_PLATFORM_TRAINING_ARGS = {
    'project': GOOGLE_CLOUD_PROJECT,
    'region': GOOGLE_CLOUD_REGION,
    # Starting from TFX 0.14, training on AI Platform uses custom containers:
    # https://cloud.google.com/ml-engine/docs/containers-overview
    # You can specify a custom container here. If not specified, TFX will use
    # a public container image matching the installed version of TFX.
    'masterConfig': {
        'imageUri': PIPELINE_IMAGE
    },
    # Note that if you do specify a custom container, ensure the entrypoint
    # calls into TFX's run_executor script (tfx/scripts/run_executor.py)
}

# A dict which contains the serving job parameters to be passed to Google
# Cloud AI Platform. For the full set of parameters supported by Google Cloud AI
# Platform, refer to https://cloud.google.com/ml-engine/reference/rest/v1/projects.models
GCP_VERTEX_SERVING_ARGS = {
    # 'model_name': MODEL_NAME,
    'project_id': GOOGLE_CLOUD_PROJECT,
    # The region to use when serving the model. See available regions here:
    # https://cloud.google.com/ml-engine/docs/regions
    # Note that serving currently only supports a single region:
    # https://cloud.google.com/ml-engine/reference/rest/v1/projects.models#Model
    'regions': [GOOGLE_CLOUD_REGION],
    'endpoint_name': f'{MODEL_NAME}_endoint',
    'min_replica_count': 1,
    'max_replica_count': 2,
    'machine_type': 'n1-standard-4'
}
GCP_CAIP_SERVING_ARGS = {
    'model_name': MODEL_NAME,
    'project_id': GOOGLE_CLOUD_PROJECT,
    # The region to use when serving the model. See available regions here:
    # https://cloud.google.com/ml-engine/docs/regions
    # Note that serving currently only supports a single region:
    # https://cloud.google.com/ml-engine/reference/rest/v1/projects.models#Model
    'regions': [GOOGLE_CLOUD_REGION],
    'machine_type': 'mls1-c1-m2'
}
# If you are looking for the url to query the Endpoint,
# that's in a property pushed_destination of the pushed_model output artifact:
# model_pushed_artifact = pusher.outputs[PUSHED_MODEL_KEY]
# pushed_destination = model_pushed_artifact.get_string_custom_property("pushed_destination")
# Together with the VERTEX_REGION_KEY, you can create the url with something like:
# f"https://{region}-aiplatform.googleapis.com/v1/{pushed_destination}:predict".


# TFX pipeline produces many output files and metadata. All output data will be
# stored under this OUTPUT_DIR.
OUTPUT_DIR = f'gs://{GCS_BUCKET_NAME}'
LOCAL_OUTPUT_DIR = './'

# TFX produces two types of outputs, files and metadata.
# - Files will be created under PIPELINE_ROOT directory.
PIPELINE_ROOT = f'{OUTPUT_DIR}/tfx_pipeline_output/{PIPELINE_NAME}'
LOCAL_PIPELINE_ROOT = f'{LOCAL_OUTPUT_DIR}/tfx_pipeline_output/{PIPELINE_NAME}'

# The last component of the pipeline, "Pusher" will produce serving model under
# SERVING_MODEL_DIR.
SERVING_MODEL_DIR = f'{PIPELINE_ROOT}/serving_model'
LOCAL_SERVING_MODEL_DIR = f'{LOCAL_PIPELINE_ROOT}/serving_model'

# NEW: Configuration for Vertex AI Training.
# This dictionary will be passed as `CustomJobSpec`.
GCP_VERTEX_AI_TRAINING_ARGS = {
    'project': GOOGLE_CLOUD_PROJECT,
    'region': GOOGLE_CLOUD_REGION,
    # Starting from TFX 0.14, training on AI Platform uses custom containers:
    # https://cloud.google.com/ml-engine/docs/containers-overview
    # You can specify a custom container here. If not specified, TFX will use
    # a public container image matching the installed version of TFX.
    'masterConfig': {
        'imageUri': PIPELINE_IMAGE
    },
    # Note that if you do specify a custom container, ensure the entrypoint
    # calls into TFX's run_executor script (tfx/scripts/run_executor.py)

    'worker_pool_specs': [{
        'machine_spec': {'machine_type': 'n1-standard-4', },
        'replica_count': 1,
        'container_spec': {
            'image_uri': PIPELINE_IMAGE,
        },
    }],
}

if USE_GPU:
    # See https://cloud.google.com/vertex-ai/docs/reference/rest/v1/MachineSpec#acceleratortype
    # for available machine types.
    GCP_VERTEX_AI_TRAINING_ARGS['worker_pool_specs'][0]['machine_spec'].update({
        'accelerator_type': 'NVIDIA_TESLA_K80',
        'accelerator_count': 1
    })

TUNE_NUM_PARALLEL_TRIALS = 3
# HYPERPARAMETERS = False
HYPERPARAMETERS = {
    "goal": 'MINIMIZE',
    "params": [
        {
            "parameterName": "es_patience",
            "type": "DISCRETE",
            "discreteValues": [1, 3, 5]
        },
        {
            "parameterName": "lr_epsilon",
            "type": "DISCRETE",
            "discreteValues": [1e-5, 1e-4, 1e-3, 1e-2]
        }
    ],
    "maxTrials": 3,
    "maxParallelTrials": 3,
    "maxFailedTrials": 1,
    "hyperparameterMetricTag": 'mse',
    "enableTrialEarlyStopping": True,
}

GCP_AI_PLATFORM_TUNING_ARGS = {
    'project': GOOGLE_CLOUD_PROJECT,
    'region': GOOGLE_CLOUD_REGION,
    'masterConfig': {
        'imageUri': PIPELINE_IMAGE
    },
    #'hyperparameters': HYPERPARAMETERS
}

pubsub_deploy_topic = 'black-friday-training-finish'
