// This is a JavaScript file
//GLOBAL VARIABLES
var userid = null;
var username = null;
var permission = null;


function login()
{
    alert("Login button clicked");

    email = document.getElementById('email').value;
    password = document.getElementById('password').value;

    //validate input
    if (email == "" || password == "")
    {
        return;
    }
    if (!email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }


    var formobject = new FormData(); 
    formobject.append("email", email);
    formobject.append("password", password);
    new_ajax_helper('https://python-yellow-bear-bradnielsen702.codeanyapp.com/mobilelogin', receivelogin, formobject,'POST');
}

//JSON is turned into an OBJECT when it comes
function receivelogin(response)
{
    if (response.status == 'success')
    {
        alert("Welcome " + response.name);
        username = response.name;
        userid = response.userid;
        permission = response.permission;

        $.mobile.changePage( "#menupage", { transition: "flip" });

    } else
    {
        alert(response.message);
    }
}


