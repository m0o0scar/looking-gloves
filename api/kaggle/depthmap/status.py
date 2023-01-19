from flask import Flask, request
import os
import requests

from api.kaggle.share import get_root_folder, create_kaggle_client

app = Flask(__name__)

@app.route('/api/kaggle/depthmap/status', methods=['POST'])
def check_notebook_status():
  kaggle, username = create_kaggle_client(request)
  notebook_id = request.form['notebook_id']

  # check notebook status
  status = kaggle.kernels_status(notebook_id)

  outputs = []
  if status['status'] == 'complete':
    # download output
    root_folder = get_root_folder()
    download_folder = os.path.join(root_folder, "downloads", notebook_id)
    kaggle.kernels_output(notebook_id, download_folder, force=True)

    # update all images file to a temporary online storage
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