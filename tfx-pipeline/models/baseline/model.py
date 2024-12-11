import tensorflow as tf

import tensorflow_recommenders as tfrs

from tfx import v1 as tfx
# import tfx
from tfx_bsl.public import tfxio
from tensorflow_metadata.proto.v0 import schema_pb2
from tensorflow_transform.tf_metadata import schema_utils


TRAIN_BATCH_SIZE = 128
EVAL_BATCH_SIZE = 128
EPOCHS = 1
TRAIN_NUM_STEPS = 100
EVAL_NUM_STEPS = 10

CATEGORICAL_FEATURE_KEYS = [
    'User_ID', 'Product_ID', 'Gender', 'Age', 'Occupation', 'City_Category', 'Stay_In_Current_City_Years',
    'Marital_Status', 'Product_Category_1', 'Product_Category_2', 'Product_Category_3', 'Purchase'
]

FEATURE_SPEC = {
#     **{
#         feature: tf.io.FixedLenFeature(shape=[1], dtype=tf.string)
#         for feature in CATEGORICAL_FEATURE_KEYS
#     },
    'User_ID': tf.io.FixedLenFeature([], tf.int64),
    'Product_ID': tf.io.FixedLenFeature([], tf.string),
}


class UserProductModel(tfrs.Model):
    # We derive from a custom base class to help reduce boilerplate. Under the hood,
    # these are still plain Keras Models.

    def __init__(
            self,
            user_model: tf.keras.Model,
            product_model: tf.keras.Model,
            task: tf.keras.layers.Layer  # tfrs.tasks.Retrieval
    ):
        super().__init__()
        self.user_model = user_model
        self.product_model = product_model
        self.task = task

    def compute_loss(self, features: dict[str, tf.Tensor], training=False) -> tf.Tensor:
        print("features:", features)

        user_embeddings = self.user_model(features['User_ID'])
        print("user_embeddings:", user_embeddings)

        product_embeddings = self.product_model(features['Product_ID'])
        print("product_embeddings:", product_embeddings)

        result = self.task(user_embeddings, product_embeddings)
        print("result:", result)

        return result


def _build_recommendation_system(users_data: tf.data.Dataset, products_data: tf.data.Dataset) -> tf.keras.Model:
    print("BUILD ML RECOMMENDATION SYSTEM")

    print("CREATE INPUT LAYER FOR USERS.")
    # user_ids_vocabulary = tf.keras.layers.StringLookup(mask_token=None)
    user_ids_vocabulary = tf.keras.layers.IntegerLookup(mask_token=None)
    user_ids_vocabulary.adapt(users_data) # Cast string to int64 is not supported

    print("CREATE INPUT LAYER FOR PRODUCTS")
    product_ids_vocabulary = tf.keras.layers.StringLookup(mask_token=None)
    product_ids_vocabulary.adapt(products_data)

    # Define user and product models.
    print("DEFINE USER 'TOWER'")
    user_model = tf.keras.Sequential([
        #tf.keras.layers.Input(shape=(1,), name='userId', dtype=tf.string),
        user_ids_vocabulary,
        tf.keras.layers.Embedding(user_ids_vocabulary.vocabulary_size(), 64)
    ])
    # user_model.summary()

    print("DEFINE PRODUCT 'TOWER'")
    product_model = tf.keras.Sequential([
        #tf.keras.layers.Input(shape=(1,), name='productId', dtype=tf.string),
        # tf.keras.layers.Lambda(lambda x: tf.as_string(x)),
        product_ids_vocabulary,
        tf.keras.layers.Embedding(product_ids_vocabulary.vocabulary_size(), 64)
    ])
    # product_model.summary()

    # Define your objectives.
    print("DEFINE RETRIEVAL TASK")

    candidates=products_data.batch(TRAIN_BATCH_SIZE).map(product_model) # .map(reshape)
    print("candidates: ", candidates)
    # print("candidates:", list(candidates.as_numpy_iterator()))

    task = tfrs.tasks.Retrieval(
        metrics=tfrs.metrics.FactorizedTopK(candidates=candidates)
    )

    # Create a retrieval model.
    print("CREATE USER-PRODUCT RECOMMENDATION MODEL")
    model = UserProductModel(user_model, product_model, task)
    # model.summary()  # not yet been built

    return model


def reshape(features_dict: dict[str, tf.Tensor]):
    return {k: tf.reshape(v, [-1]) for k,v in features_dict.items()}


def _input_fn(
        file_pattern: list[str],
        data_accessor: tfx.components.DataAccessor,
        schema: schema_pb2.Schema,
        batch_size: int) -> tf.data.Dataset:
    """Generates features and label for training.

    Args:
      file_pattern: List of paths or patterns of input tfrecord files.
      data_accessor: DataAccessor for converting input to RecordBatch.
      schema: schema of the input data.
      batch_size: representing the number of consecutive elements of returned
        dataset to combine in a single batch

    Returns:
      A dataset that contains (features, indices) tuple where features is a
        dictionary of Tensors, and indices is a single Tensor of label indices.
    """
    return data_accessor.tf_dataset_factory(
        file_pattern,
        tfxio.TensorFlowDatasetOptions(batch_size=batch_size),
        schema
    ).repeat()


def _input_fn_lookup(
        file_pattern: list[str],
        data_accessor: tfx.components.DataAccessor,
        schema: schema_pb2.Schema,
        batch_size: int) -> tf.data.Dataset:

    return data_accessor.tf_dataset_factory(
        file_pattern,
        tfxio.TensorFlowDatasetOptions(batch_size=batch_size, num_epochs=1, shuffle=False),
        schema
    ) # .map(reshape)


# TFX Trainer will call this function.
def run_fn(fn_args: tfx.components.FnArgs):
    """Train the model based on given args.

    Args:
    fn_args: Holds args used to train the model as name/value pairs.
    """
    print("ENTERING MODEL TRAINING SCRIPT 999")

    print("GET SCHEMA")
    schema = schema_utils.schema_from_feature_spec(FEATURE_SPEC)
    print("schema:", schema)

    print("GET LOOKUP DATASET")
    lookup_dataset = _input_fn_lookup(fn_args.train_files, fn_args.data_accessor, schema, TRAIN_BATCH_SIZE)

    print("GET TRAIN DATASET")
    train_dataset = _input_fn(fn_args.train_files, fn_args.data_accessor, schema, TRAIN_BATCH_SIZE)

    print("GET VALIDATION DATASET")
    eval_dataset = _input_fn(fn_args.eval_files, fn_args.data_accessor, schema, EVAL_BATCH_SIZE)

    # mirrored_strategy = tf.distribute.MirroredStrategy()
    # with mirrored_strategy.scope():

    print("LOOKUP DATASET:", lookup_dataset)
    print("EXTRACT USERS DATA FROM TRAIN DATASET")
    users = lookup_dataset.map(lambda x: x['User_ID']).unbatch().unique() # .map(lambda x: tf.as_string(x))
    print("users:", sorted(list(users.as_numpy_iterator())))

    print("EXTRACT PRODUCT DATA FROM TRAINING DATASET")
    products = lookup_dataset.map(lambda x: x['Product_ID']).unbatch().unique()
    print("products:", sorted(list(products.as_numpy_iterator())))

    print("BUILD MODEL")
    model = _build_recommendation_system(users, products)

    print("COMPILE MODEL")
    model.compile(optimizer=tf.keras.optimizers.Adagrad(0.5))

    # model.summary() # not yet been built
    # tb_logdir = os.path.join(
    #     fn_args.model_run_dir[:fn_args.model_run_dir.rfind('/')],
    #     f"baseline-({fn_args.model_run_dir[fn_args.model_run_dir.rfind('/') + 1:]})"
    # )
    tensorboard_callback = tf.keras.callbacks.TensorBoard(
        # log_dir=tb_logdir,
        update_freq=10,
        histogram_freq=1,
        embeddings_freq=1,
    )

    print(f"TRAIN MODEL FOR {EPOCHS} EPOCHS")
    model.fit(
        train_dataset,
        epochs=EPOCHS,
        steps_per_epoch=TRAIN_NUM_STEPS,
        validation_data=eval_dataset,
        validation_steps=EVAL_NUM_STEPS,
        callbacks=[
            # earlystopping_callback,
            # tensorboard_callback,
        ]
    )


    index = tfrs.layers.factorized_top_k.BruteForce(model.user_model)
    index.index_from_dataset(
        products.batch(TRAIN_BATCH_SIZE).map(lambda x: (x, model.product_model(x))))
    # index.summary()

    #index.save(fn_args.serving_model_dir, save_format='tf')

    tf.saved_model.save(
        index,
        fn_args.serving_model_dir,
        # options=tf.saved_model.SaveOptions(namespace_whitelist=["Scann"])
    )
