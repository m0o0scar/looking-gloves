import os
import tempfile

class FakePool:
  pass

from multiprocessing import pool
pool.ThreadPool = FakePool

from kaggle.api.kaggle_api_extended import KaggleApi
from kaggle.api_client import ApiClient

def get_root_folder():
  env = os.environ.get('VERCEL_ENV', 'development')
  if env == 'development':
    print('I am in development mode, will use temp folder as root')
    return tempfile.gettempdir()
  else:
    print('I am in production mode, will use /tmp as root')
    return '/tmp'

def create_kaggle_client(request):
  # create a new kaggle api instance
  kaggle = KaggleApi(ApiClient())

  # initialize credentials
  username = request.form['username']
  api_key = request.form['key']
  config = {'username': username, 'key': api_key}
  kaggle._load_config(config)
  return kaggle, username
