from flask import *
import sys, os, logging, datetime
from interfaces.databaseinterface import Database
from interfaces.hashing import *
from interfaces.helpers import *
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import requests
import json

#---CONFIGURE APP---------------------------------------------------
app = Flask(__name__)
cors = CORS(app)
logging.basicConfig(filename='logs/flask.log', level=logging.INFO)
sys.tracebacklimit = 10

# Configure the upload folder and allowed file extensions
UPLOAD_FOLDER = 'profilephotos'
QRCODE_FOLDER = 'qrcodes'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['QRCODE_FOLDER'] = QRCODE_FOLDER
app.config['SECRET_KEY'] = "Type in secret line of text"

# Function to check the file extension
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

DATABASE = Database("database/test.db", app.logger)

#use @cross_origin() after @app.route to allow external access 
#---VIEW FUNCTIONS----------------------------------------------------
@app.route('/backdoor')
def backdoor():
    userdetails = DATABASE.ViewQuery("SELECT * FROM users")
    return jsonify(results)

@app.route('/logout')
def logout():
    app.logger.info("Log out")
    session.clear()
    return redirect('./')

#admin page
@app.route('/admin', methods=["GET","POST"])
def admin():

    if 'permission' not in session:
        return redirect("./")
    else:
        if session['permission'] != 'admin':
            return redirect("./")

    results = DATABASE.ViewQuery("SELECT * FROM users")

    if request.method == "POST":
        selectedusers = request.form.getlist("selectedusers")
        for userid in selectedusers:
            if int(userid) != 1:
                DATABASE.ModifyQuery("DELETE FROM users WHERE userid = ?", (userid,))
        return redirect("./admin")

    app.logger.info("Admin")
    return render_template("admin.html", results=results)

#return a profile photo
@app.route('/profilephotos/<filename>')
def serve_profilephoto(filename):
    if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)): # Ensure the file exists
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    else:
        abort(404) # If the file does not exist, return a 404 error
    return

# Exit the web server
@app.route('/exit', methods=['GET','POST'])
def exit():
    app.logger.info("Exiting")
    func = request.environ.get('werkzeug.server.shutdown')
    func()
    return jsonify({'message':'Exiting'})

@app.route('/apisearch', methods=["GET","POST"])
@cross_origin()
def apisearch():
    data = {}
    request.method = 'POST'
    if request.method == 'POST':
        songtitle = 'Lucy in the sky with diamonds'
        songartist = 'Beatles'
        query = songtitle + " " + songartist
        url = "https://spotify23.p.rapidapi.com/search/"
        querystring = {"q":query,"type":"multi","offset":"0","limit":"5","numberOfTopResults":"5"}
        headers = {
            "X-RapidAPI-Key": "63a6d49d67mshf59bc1bb51752acp169684jsnd91195bff2b6",
            "X-RapidAPI-Host": "spotify23.p.rapidapi.com"
        }
        response = requests.get(url, headers=headers, params=querystring)
        dictionary = response.json()
        data = dictionary['albums']['items']
    return jsonify(data)

#login page
@app.route('/mobilelogin', methods=["GET","POST"])
@cross_origin()
def mobilelogin():
    app.logger.info("Mobile Login")
    data = {}
    if request.method == "POST":
        email = request.form['email']
        password = request.form['password']
        results = DATABASE.ViewQuery("SELECT * FROM users WHERE email = ?", (email,))
        if results:
            userdetails = results[0] #row in the user table (Python Dictionary)
            if check_password(userdetails['password'], password):
                #create a token using simple hash function
                data['userid'] = userdetails['userid']
                data['permission'] = userdetails['permission']
                data['name'] = userdetails['firstname'] + " " + userdetails['lastname']
                data['status'] = 'success'
                data['message'] = 'Login successful'
            else: 
                data['status'] = 'failure'
                data['message'] = 'Password incorrect!'
        else:
            data['status'] = 'failure'
            data['message'] = 'Email does not match existing users'
    return jsonify(data)


#main method called web server application
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True) #runs a local server
