import functions_framework
import numpy as np
from scipy.spatial.distance import euclidean
from flask import jsonify
from fastdtw import fastdtw

# Register an HTTP function with the Functions Framework
@functions_framework.http
def dtw_euclidean(request):
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
    print(request.get_json().get("data"))
    x = np.array(request.get_json().get("data").get("base"))
    y = np.array(request.get_json().get("data").get("over"))
    distance, path = fastdtw(x, y, dist=euclidean)
    response = {
      "data":{
        "distance": distance,
        "path": path
      }  
    }
  # Return an HTTP response
    return (jsonify(response), 200, headers)