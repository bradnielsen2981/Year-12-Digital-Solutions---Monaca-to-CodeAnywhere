// This is a JavaScript file
//GLOBAL VARIABLES
var userid = null;
var username = null;
var permission = null;

alert("Javascript linked");

function login()
{
    alert("Login button clicked");

    email = document.getElementById('email').value;
    password = document.getElementById('password').value;

    if (email == '' || password == '')
    {
        return;
    }
    if (!email.includes('@'))
    {
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

    } else {
        alert(response.message);
    }
}



function searchsong()
{
    alert("search song button clicked");

    songtitle = document.getElementById('songtitle').value;
    songartist = document.getElementById('songartist').value;

    var formobject = new FormData(); 
    formobject.append("songtitle", songtitle);
    formobject.append("songartist", songartist);

    new_ajax_helper('https://python-yellow-bear-bradnielsen702.codeanyapp.com/songsearch', receivesongresults, formobject, 'POST');
}

function receivesongresults(response)
{
    alert("Received results");
   
    const songResults = document.getElementById('songresults');
    songResults.innerHTML = " ";

    response.forEach(item => {
        const track = item.data;
        const album = track.albumOfTrack;
        const artist = track.artists.items[0].profile.name;
        const coverArt = album.coverArt.sources[0].url;

        const songDiv = document.createElement('div');
        songDiv.classList.add('song');

        const img = document.createElement('img');
        img.src = coverArt;
        img.alt = track.name;
        img.width = 100;
        img.height = 100;

        const songName = document.createElement('h3');
        songName.textContent = track.name;

        const artistName = document.createElement('p');
        artistName.textContent = `Artist: ${artist}`;

        const button = document.createElement('button');
        button.textContent = 'Add to Playlist';
        button.dataset.trackId = track.id;
        button.addEventListener('click', () => {
        alert(`Track ID: ${track.id}`);
        });

        songDiv.appendChild(img);
        songDiv.appendChild(songName);
        songDiv.appendChild(artistName);
        songDiv.appendChild(button);

        songResults.appendChild(songDiv);
    });

    $.mobile.changePage( "#songresultspage", { transition: "flip" }); 
}

