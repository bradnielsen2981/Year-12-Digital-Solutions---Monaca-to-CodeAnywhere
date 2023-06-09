<?php
    /* ALLOWS CROSS ORIGIN (COMMUNICATION BETWEEN TWO SYSTEMS) */
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    if(isset($_POST['email'])) {
        //attempted a login

        //USE ERROR LOG TO GET ERRORS
        error_log("GETTING TO MOBILE LOGIN", 3, "../error.log");

        //retrieve and cleanup user input
        $email = trim(stripslashes(htmlspecialchars($_POST['email'])));
        $password = sha1($_POST['password']);//hash the password

        //handshake with db
        require('../connect.php');

        //go get nominated users data
        $row = DB::queryFirstRow('SELECT * FROM users WHERE email = %s', $email);

        $response = null;

        if (!$row){
            //nothing came back, therefore username not registered
            $response = array("result"=>"Error", "message"=>"No user found!");
            echo json_encode($response);
        } else {
            if($password == $row['password']){

                error_log("PASSWORD CHECK SUCCESSFUL", 3, "../error.log");
                $response = array("result"=>"Success", "username"=> ($row['firstname'].' '.$row['lastname']), "userid"=>$row['userid'] ); //password correct
                echo json_encode($response); //return response to mobile
                
            } else {
                $response = array("result"=>"Error", "message"=>"Password incorrect!"); 
                echo json_encode($response); //return response to mobile
            }
        }
    } else {
        $response = array("result"=>"Error", "message"=>"Email field not found!");
        echo json_encode($response);
    }
    
?>