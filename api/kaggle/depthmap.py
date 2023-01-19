from flask import Flask, request
import os
import json
import time
import tempfile
import requests

from kaggle.api.kaggle_api_extended import KaggleApi
from kaggle.api_client import ApiClient

app = Flask(__name__)

def get_root_folder():
  # return tempfile.gettempdir()
  return '/Users/tangqh/Downloads/taggle'

def create_kaggle_client(request):
  # create a new kaggle api instance
  kaggle = KaggleApi(ApiClient())

  # initialize credentials
  username = request.form['username']
  api_key = request.form['key']
  config = {'username': username, 'key': api_key}
  kaggle._load_config(config)
  return kaggle, username

@app.route('/api/kaggle/depthmap', methods=['POST'])
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

@app.route('/api/kaggle/depthmap', methods=['PUT'])
def check_notebook_status():
  kaggle, username = create_kaggle_client(request)
  notebook_id = request.form['notebook_id']

  # check notebook status
  status = kaggle.kernels_status(notebook_id)

  if status['status'] == 'complete':
    # download output
    root_folder = get_root_folder()
    download_folder = os.path.join(root_folder, "downloads", notebook_id)
    kaggle.kernels_output(notebook_id, download_folder, force=True)

    # update all images file to a temporary online storage
    outputs = []
    output_folder = os.path.join(download_folder, 'outputs')
    for file in os.listdir(output_folder):
      if file.endswith('.png'):
        with open(os.path.join(output_folder, file), 'rb') as f:
          response = requests.post('https://tmpfiles.org/api/v1/upload', files={'file': f})
          download_url = response.json()['data']['url']
          download_url = download_url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/')
          outputs.append(download_url)

  return {
    'status': status,
    'outputs': outputs,
  }