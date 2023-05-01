#BasicPitch Google Cloud Function
#Customised Boilerplate for Python Google Cloud Function

#Matthew Smith - 12004210
#May 2023
import os
import tempfile
import numpy as np
import json
import functions_framework

from werkzeug.utils import secure_filename
from basic_pitch.inference import predict
from basic_pitch import ICASSP_2022_MODEL_PATH

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

# Helper function that computes the filepath to save files to
def get_file_path(filename):
    # Note: tempfile.gettempdir() points to an in-memory file system
    # on GCF. Thus, any files in it must fit in the instance's memory.
    file_name = secure_filename(filename)
    return os.path.join(tempfile.gettempdir(), file_name)

# Register an HTTP function with the Functions Framework
@functions_framework.http
def basicPitch(request):
    #CORS Handling
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Authorization,Content-Type,Referer,Origin',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
  # Your code here
    # This code will process each file uploaded
    try:
      files = request.files.to_dict()
      for file_name, file in files.items():

          file.save(get_file_path(file_name))
          #Run Predictor
          model_output, midi_data, note_activations = predict(get_file_path(file_name))
          print('Processed file: %s' % file_name)

      # Clear temporary directory
      for file_name in files:
          file_path = get_file_path(file_name)
          os.remove(file_path)
  
      response = {
        "data":{
          "note_activations": note_activations
        }  
      }
      print(note_activations)
      # Return an HTTP response with JSON encoded
      return (json.dumps(response, cls=NpEncoder), 200, headers)
    except:
      return ("", 400, headers)
