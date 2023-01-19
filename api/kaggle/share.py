import tempfile

from kaggle.api.kaggle_api_extended import KaggleApi
from kaggle.api_client import ApiClient

def get_root_folder():
  return tempfile.gettempdir()

def create_kaggle_client(request):
  # create a new kaggle api instance
  kaggle = KaggleApi(ApiClient())

  # initialize credentials
  username = request.form['username']
  api_key = request.form['key']
  config = {'username': username, 'key': api_key}
  kaggle._load_config(config)
  return kaggle, username