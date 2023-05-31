console.log("HERE");

var SKIPLOGIN = true; //set this to true if you wish to skip logging on
//----GLOBAL VARIABLES-----------
var isDeviceReady = false;
var username = null;
var longitude = null;
var latitude = null;

//---DEVICE READY - (Mobile functionality is not available until device is ready) --------------
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("Device Ready");
  isDeviceReady = true;
  checkGPS(); //get GPS locations
}

//--LOGIN-------------------------------------------------------------
function login()
{
    
    if (SKIPLOGIN) //using for test purposes
    { 
        $.mobile.changePage( "#menupage", { transition: "slideup" }); 
    }
    else {
        //get form fields
        email = document.getElementById("email").value.trim();
        password = document.getElementById("password").value.trim();

        //create a form object to send via AJAX
        formobject = new FormData(); //create a form object
        formobject.append("email", email);
        formobject.append("password", password);

        //send form object to server using POST request
        new_ajax_helper('https://php-black-lizard-bradnielsen702.codeanyapp.com/mobile/mobilelogin.php', loginReceived, formobject, 'POST'); 
    } 
}

//callback function from ajax
function loginReceived(response)
{
    if (response.result == "Success")
    {
        userid = response.userid; //might be better to store this cookies, or internal storage
        username = response.username;
        //alert("Welcome " + username);
        $.mobile.changePage( "#menupage", { transition: "slideup" }); 
        
    } else if (response.result == "Error")
    {
        console.log(response.message);
    }
}

//--GET GPS---------------------------------------------------------
function checkGPS()
{
  if (isDeviceReady)
  {
    navigator.geolocation.getCurrentPosition(onGPSSuccess, onError);
  }
}

//save GPS coordinates globally
function onGPSSuccess(position) {
  longitude = position.coords.longitude;
  latitude = position.coords.latitude;
  alert("GPS coordinates received: Long: " + String(longitude) + " Lat: " + String(latitude)); 
};

// onError Callback receives a PositionError object
function onError(error) {
    alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
}



//--GET BOOK INFORMATION--------------------------------------
function findbook()
{
    //create a form object to send via AJAX
    formobject = new FormData(); //create a form object
    formobject.append("booktitle", "Carrie");
    formobject.append("bookauthor", "");
    formobject.append("genre", "");

    //send form object to server using POST request
    new_ajax_helper('https://php-black-lizard-bradnielsen702.codeanyapp.com/mobile/findbook.php', findBookReceived, formobject, 'POST'); 
}

function findBookReceived(response)
{
    bookdata.innerHTML = JSON.stringify(response);
}

//load the meetings page
$(document).on("pageshow","#meetingspage", findmeetings);

function findmeetings()
{
    //create a form object to send via AJAX
    formobject = new FormData(); //create a form object
    formobject.append("userid", userid);

    //send form object to server using POST request
    new_ajax_helper('https://php-black-lizard-bradnielsen702.codeanyapp.com/mobile/findmeetings.php', receivemeetings, formobject, 'POST'); 
}
function receivemeetings(response)
{
    meetings.innerHTML = JSON.stringify(response);
    //output_table(response, "meetings");
}

//FROM CHATGPT
function output_table(data, tagid)
{
    // Create table element
    var table = document.createElement("table");
    // Create header row element
    var headerRow = document.createElement("tr");

    // Add header cells to header row element
    for (var key in data[0]) {
        var headerCell = document.createElement("th");
        var headerText = document.createTextNode(key);
        headerCell.appendChild(headerText);
        headerRow.appendChild(headerCell);
    }

    // Add header row element to table element
    table.appendChild(headerRow);

    // Add data rows to table element
    for (var i = 0; i < data.length; i++) {
        var dataRow = document.createElement("tr");
        for (var key in data[i]) {
            var dataCell = document.createElement("td");
            var dataText = document.createTextNode(data[i][key]);
            dataCell.appendChild(dataText);
            dataRow.appendChild(dataCell);
        }
        table.appendChild(dataRow);
    }

    // Add table element to HTML body
    document.getElementById(tagid).appendChild(table);
}