// This is a JavaScript file

function login()
{
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
    var formobject = new FormData(); 
    formobject.append("email", email);
    formobject.append("password", password);
    new_ajax_helper('https://python-yellow-bear-bradnielsen702.codeanyapp.com/mobilelogin', receivelogin, formobject,'POST');
}
function receivelogin(response)
{
    alert(response.status);
}


