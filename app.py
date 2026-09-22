from flask import Flask, render_template, jsonify

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/status")
def status():
    return jsonify({
        "status": "running",
        "application": "Application Layer Protocol Visualizer"
    })


if __name__ == "__main__":
    app.run(debug=True)