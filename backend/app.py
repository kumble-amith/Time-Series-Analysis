from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from model import predict
import base64
from werkzeug.utils import secure_filename
import json

app = Flask(__name__)
CORS(app)


def send_response():
    reqData = request.get_json()
    if reqData is None:
        return jsonify({"error": "No json data found or Invalid content-type"}), 400

    if reqData["file"] != "":
        recovered = base64.urlsafe_b64decode((reqData["file"].split(",")[1]))
        img_file = open(f"./files/{reqData['fileName']}.csv", "wb")
        img_file.write(recovered)
        img_file.close()

    predict(files=f"./files/{reqData['fileName']}.csv", op=reqData["op"],
            scalerUser=reqData["scalerUser"], epoch=reqData["epoch"], predDays=reqData["predDays"])

    # image = preprocess_image("./image.jpeg")
    # value = model.predict(image)
    # confidence = value.tolist()
    # confidence = confidence[0]
    # return jsonify({"success": "Uploaded", "result": {"confidence": confidence[0]}}), 200
    return jsonify({"success": "Uploaded"}), 200


@app.route("/test", methods=["POST"])
def test():
    print("Here")
    t = {'a': 1}

    return jsonify(t), 200


@app.route("/predict", methods=["POST"])
def response():

    # Get the CSV file
    file = request.files['file']
    destination = f"./files/{secure_filename(file.filename)}"
    file.save(destination)
    reqData = json.loads(request.form.get('values', -1))

    # print(reqData, reqData['op'])


    res = predict(files=f"{reqData['fileName']}", op=reqData["op"],
                  scalerUser=reqData["scalerUser"], epoch=int(reqData["epoch"]), predDays=int(reqData["predDays"]), ip=reqData["ip"])
    # print(res)
    # res = predict()
    response = make_response(jsonify(res))
    response.headers['Content-Type'] = 'application/json'
    print(response)
  
    return jsonify(res),200


if __name__ == "__main__":
    app.run(debug=True)
