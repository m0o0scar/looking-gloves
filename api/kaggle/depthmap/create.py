from flask import Flask, request
import os
import json
import time

from ..share import get_root_folder, create_kaggle_client

app = Flask(__name__)

@app.route('/api/kaggle/depthmap/create', methods=['POST'])
def create_new_depthmap_estimate_task():
  kaggle, username = create_kaggle_client(request)

  # use current timestamp as folder name
  project_name = str(round(time.time() * 1000))
  project_title = 'boost-monocular-depth-%s' % project_name
  dataset_title = 'dataset-%s' % project_title
  dataset_id = '%s/%s' % (username, dataset_title)
  notebook_title = 'notebook-%s' % project_title
  notebook_id = '%s/%s' % (username, notebook_title)

  # prepare dataset and notebook folders
  root_folder = get_root_folder()
  dataset_folder = os.path.join(root_folder, "datasets", project_name)
  notebook_folder = os.path.join(root_folder, "notebooks", project_name)
  os.makedirs(dataset_folder, exist_ok=True)
  os.makedirs(notebook_folder, exist_ok=True)

  # save image to dataset folder
  image_file = request.files['image']
  image_file.save(os.path.join(dataset_folder, image_file.filename))

  # init dataset
  kaggle.dataset_initialize(dataset_folder)
  with open(os.path.join(dataset_folder, 'dataset-metadata.json'), 'r+') as f:
    metadata = json.load(f)
    metadata['title'] = dataset_title
    metadata['id'] = dataset_id
    f.seek(0)
    json.dump(metadata, f, indent=2)
    f.truncate()
    f.close()
  
  # create dataset
  kaggle.dataset_create_new(dataset_folder)

  # pull notebook from kaggle
  kaggle.kernels_pull('moscartong/boost-monocular-depth', notebook_folder, metadata=True)

  # update content of notebook
  with open(os.path.join(notebook_folder, 'boost-monocular-depth.ipynb'), 'r+') as f:
    content = f.read()
    content = content.replace('/kaggle/input/rgbd-test-images', '/kaggle/input/%s' % dataset_title)
    f.seek(0)
    f.write(content)
    f.truncate()
    f.close()

  # update notebook metadata
  with open(os.path.join(notebook_folder, 'kernel-metadata.json'), 'r+') as f:
    metadata = json.load(f)
    metadata['title'] = notebook_title
    metadata['id'] = notebook_id
    metadata['dataset_sources'] = [
      "moscartong/boost-monocular-depth-code-and-models",
      dataset_id,
    ]
    metadata.pop('id_no', None)
    metadata.pop('keywords', None)
    f.seek(0)
    json.dump(metadata, f, indent=2)
    f.truncate()
    f.close()

  # push notebook to kaggle
  kaggle.kernels_push(notebook_folder)
  
  return {
    'notebook_id': notebook_id,
    'notebook_slug': notebook_title,
  }
