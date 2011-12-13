from flask import Flask, request, jsonify, render_template

app = Flask(__name__)


PRODUCTION = False #more configurable in the future.
if PRODUCTION:
    from service_api import ServiceApi
else:
    from dummy_service_api import ServiceApi


@app.route('/')
def index():
    return render_template("index.html")

@app.route('/dashboard')
def dashboard():
    return render_template("dashboard.html")

@app.route('/structure')
def structure():
    return render_template("structure.html")

@app.route('/dataresource', methods=["GET", "POST"])
def data_resource():
    resp_data = ServiceApi.data_resource(request.args)
    return jsonify(resp_data)

@app.route('/dataresource/<data_resource_id>', methods=["GET", "POST"])
def data_resource_details(data_resource_id):
    resp_data = ServiceApi.data_resource_details(data_resource_id)
    return jsonify(resp_data)

@app.route('/subscription', methods=["GET", "POST"])
def subscription():
    resp_data = ServiceApi.subscription(request.args)
    return jsonify(resp_data)


if __name__ == '__main__':
    app.run(debug=True)
