<?php
    /* ALLOWS CROSS ORIGIN (COMMUNICATION BETWEEN TWO SYSTEMS) */
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    error_log("Getting to Find Meetings Page", 3, "../error.log");

    $_POST['userid'] = 2; //DUMMY DATA
    if (isset($_POST['userid']))
    {
        require('../connect.php');

        $userid = $_POST['userid'];

        //go get nominated users data
        $results = DB::query('SELECT * FROM meetings WHERE clubid in (SELECT clubid FROM clubmembership WHERE userid = %s)', $userid);
    
        echo json_encode($results);

    }
?>

