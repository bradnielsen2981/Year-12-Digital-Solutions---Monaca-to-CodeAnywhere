<?php
    /* ALLOWS CROSS ORIGIN (COMMUNICATION BETWEEN TWO SYSTEMS) */
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    //error_log("Error message", 3, "../error.log");

    $_POST['book'] = "The Stand";

    if(isset($_POST['book'])) { //check the post data

        $book = urlencode($_POST['book']); //temporary call

        // Set the search term and API endpoint URL
        $url = "https://hapi-books.p.rapidapi.com/search/".$book;

        // Set the API key and API host
        $api_key = "c8eebaabf5msh2f0bbe43ca5cd76p120fa6jsnbd12fc790738";
        $api_host = "hapi-books.p.rapidapi.com";
        
        // Set the headers - get rapid api
        $headers = array(
            'Content-Type: application/json',
            'X-RapidAPI-Key: '.$api_key,
            'X-RapidAPI-Host: '.$api_host
        );
        
        // Set the options for the context
        $options = array(
            'http' => array(
                'header'  => $headers,
                'method'  => 'GET'
            )
        );
        
        // Create the context and pass the options
        $context  = stream_context_create($options);

        // Make the API request and parse the JSON response
        $bookjson = json_decode(file_get_contents($url, false, $context));

        echo json_encode($bookjson);
        
    }

?>
