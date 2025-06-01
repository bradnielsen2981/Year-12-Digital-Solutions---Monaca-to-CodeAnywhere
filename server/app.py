#---PYTHON LIBRARIES FOR IMPORT--------------------------------------
import uuid, sys, logging, math, time, os, re
from flask import Flask, render_template, session, request, redirect, url_for, flash, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from databaseinterface import Database
from datetime import datetime
import requests #needed for an external API
import helpers
from flask_cors import CORS, cross_origin #----------NEEDS TO BE INSTALLED to allow cross origin pip install flask-cors

# Function to check the file extension
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#---CONFIGURE APP---------------------------------------------------#
sys.tracebacklimit = 10 #Level of python traceback - useful for reducing error text
app = Flask(__name__) #Creates the Flask Server Object
app.config['SECRET_KEY'] = 'some random string' #used for session cookies
CORS(app) #enables cross domain scripting protection - necessary when communicating with the app
UPLOAD_FOLDER = 'photos'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = "Type in secret line of text"
app.logger.setLevel(logging.INFO)

DATABASE = Database('mysite/mydatabase.db', app.logger)

@app.route('/')
def home():
    app.logger.info("display users")
    userdetails = "Welcome"
    #userdetails = DATABASE.ViewQuery("SELECT * FROM users")
    return jsonify(userdetails)

@app.route('/login', methods=['GET','POST']) #default password is 'password'
@cross_origin()
def login():
    app.logger.info("Login")
    data = { "success":False, "message":"Login unsuccessful"}

    if request.method == "POST":
        email = request.form['email']
        password = request.form['password']

        users = DATABASE.ViewQuery("SELECT * FROM users WHERE email = ?", (email,))
        if users:
            user = users[0] #only get one user - hopefully
            if helpers.check_password(user[password], password):

                app.logger.info("SUCCESSFUL LOGIN")

                data['success'] = True
                data['message'] = "Login successful"
                data['userid'] = user['userid']
                data['username'] = user['firstname'] + " " + user['lastname']
                data['permission'] = user['permission']

                #create a token using hashing
                #save the token beside the userid in the database
                #send the token to the mobile app data['token'] = ?


    return jsonify(data) #returns the data to the app in JSON

@app.route('/logout', methods=['POST'])
def logout():
    if request.method == "POST":
        token = request.form.get('token')
        userid = request.form.get('userid')
        #search for user with token in database and delete token
    data = { "success":True, "message":"User token is cleared" }
    return jsonify(data)

@app.route('/chartsearch', methods=["GET","POST"])
@cross_origin()
def chartsearch():

    app.logger.info("Search for a star chart")

    current_date = datetime.today().strftime('%Y-%m-%d')
    latitude = -27.4698
    longitude = 153.0251

    url = "https://astronomy.p.rapidapi.com/api/v2/studio/star-chart"
    payload = {
    	"observer": {
    		"date": current_date,
    		"latitude": latitude,
    		"longitude": longitude
    	},
    	"style": "default",
            "view": {
                "type": "constellation",
                "parameters": {
                    "constellation": "sco"  # Orion, for example; can also use 'all' or others
                }
            }
    }
    headers = {
    	"x-rapidapi-key": "cb92ceb2dbmsh28774b29f8647f1p1af226jsndde6d5bc1c30",
    	"x-rapidapi-host": "astronomy.p.rapidapi.com",
    	"Content-Type": "application/json"
    }
    response = requests.post(url, json=payload, headers=headers)

    return response.json()

#app.route to post a photo

#return photos from the server folder
@app.route('/photos/<filename>')
def serve_profilephoto(filename):
    if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)): # Ensure the file exists
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    else:
        abort(404) # If the file does not exist, return a 404 error
    return

#main method called web server application
if __name__ == '__main__':
    app.run()

