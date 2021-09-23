import tfx
from tfx.orchestration.kubeflow.v2 import kubeflow_v2_dag_runner
from kfp.v2.google import client

from absl import logging

from pipeline import config
from pipeline import pipeline

PIPELINE_NAME = config.PIPELINE_NAME
PIPELINE_DEFINITION_FILE = PIPELINE_NAME + '_pipeline.json'


def run():
    runner_config = kubeflow_v2_dag_runner.KubeflowV2DagRunnerConfig(
        display_name='tfx-vertex-pipeline-{}'.format(PIPELINE_NAME),
        default_image='gcr.io/tfx-oss-public/tfx:{}'.format(tfx.__version__),
    )

    kubeflow_v2_dag_runner.KubeflowV2DagRunner(
        config=runner_config,
        output_filename=PIPELINE_DEFINITION_FILE
    ).run(
        pipeline.create_pipeline(
            pipeline_name=PIPELINE_NAME,
            pipeline_root=config.PIPELINE_ROOT,
            enable_vertex=True,
            enable_transform=False,
            enable_hyperparameters_tuning=False
        )
    )

    client.AIPlatformClient(
        project_id=config.GOOGLE_CLOUD_PROJECT,
        region=config.GOOGLE_CLOUD_REGION
    ).create_run_from_job_spec(
        PIPELINE_DEFINITION_FILE,
        enable_caching=False
    )


if __name__ == '__main__':
    logging.set_verbosity(logging.INFO)
    run()
