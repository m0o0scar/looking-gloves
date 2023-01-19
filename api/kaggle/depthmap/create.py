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
  project_title = 'boost-monocular-depth'
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
  print('[%s] creating new project ...' % project_name)

  # save image to dataset folder
  image_file = request.files['image']
  image_file.save(os.path.join(dataset_folder, image_file.filename))
  print('[%s] images received' % project_name)

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
  dataset_list = kaggle.dataset_list(mine=True, search=dataset_id)
  if len(dataset_list) > 0:
    print('[%s] updating dataset version ...' % project_name)
    kaggle.dataset_create_version(dataset_folder, version_notes=project_name, delete_old_versions=True)
  else:
    print('[%s] creating dataset ...' % project_name)
    kaggle.dataset_create_new(dataset_folder)

  # check the status of the dataset every 3 seconds, until it is ready
  while True:
    time.sleep(3)
    status = kaggle.dataset_status(dataset_id)
    print('[%s] dataset status: %s' % (project_name, status))
    if status == 'ready':
      break

  # pull notebook from kaggle
  print('[%s] pulling notebook from kaggle ...' % project_name)
  kaggle.kernels_pull('moscartong/boost-monocular-depth', notebook_folder, metadata=True)

  # update content of notebook
  print('[%s] updating notebook script ...' % project_name)
  with open(os.path.join(notebook_folder, 'boost-monocular-depth.ipynb'), 'r+') as f:
    content = f.read()
    content = content.replace('/kaggle/input/rgbd-test-images', '/kaggle/input/%s' % dataset_title)
    f.seek(0)
    f.write(content)
    f.truncate()
    f.close()

  # update notebook metadata
  print('[%s] updating notebook metadata ...' % project_name)
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
    
    # print the metadata to console
    print(metadata)

    f.seek(0)
    json.dump(metadata, f, indent=2)
    f.truncate()
    f.close()

  # push notebook to kaggle
  print('[%s] pushing notebook to kaggle ...' % project_name)
  kaggle.kernels_push(notebook_folder)
  
  print('[%s] done' % project_name)
  return {
    'notebook_id': notebook_id,
    'notebook_slug': notebook_title,
  }
