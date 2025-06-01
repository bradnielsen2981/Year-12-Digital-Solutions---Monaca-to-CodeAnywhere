// This is a JavaScript file

userid = null;
username = null;
permission = null;
lat = 27.4698; // Brisbane
long = 153.0251; // Brisbane

// GET LONG AND LAT COORDINATES FROM MOBILE - need Location Services on and allowed
var isdeviceready = false;
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  isdeviceready = true;
  navigator.geolocation.getCurrentPosition(onGPSSuccess, onGPSError); //JQUERY MOBILE
}
function onGPSSuccess(position) {
  long = position.coords.longitude;
  lat = position.coords.latitude;
  alert("GPS coordinates received: Long: " + String(long) + " Lat: " + String(lat)); 
};
function onGPSError(position)
{
    console.log("Error");
}

// LOGIN CODE
document.getElementById('loginbutton').onclick = login;
function login()
{
    alert("Login button clicked");
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
    var formobject = new FormData(); 
    formobject.append("email", email);
    formobject.append("password", password);
    new_ajax_helper('https://bradnielsen.pythonanywhere.com/login', receivelogin, formobject,'POST');
}
function receivelogin(response)
{
    alert(response.message);

    if (response.success == true)
    {
        userid = response.userid;
        username = response.username;
        permission = response.permission;

        $.mobile.changePage( "#menupage", { transition: "flip" }); 
    }
}

//On load of chart search page - query the api
$(document).on("pageshow","#chartsearchpage", chartsearch); 
function chartsearch()
{
    alert("HERE");
    var formobject = new FormData(); 
    formobject.append("long", long);
    formobject.append("lat", lat);

    new_ajax_helper('https://bradnielsen.pythonanywhere.com/chartsearch', receivechart, formobject,'POST');
}
function receivechart(response)
{
    image = response.data.imageUrl;
    alert(image);
    imgtag = document.createElement('img');
    imgtag.src = image;
    imgtag.width = 300;
    imgtag.height = 300;

    chart = document.getElementById('starchart');
    chart.appendChild(imgtag);
}
