<?php
    /* ALLOWS CROSS ORIGIN (COMMUNICATION BETWEEN TWO SYSTEMS) */
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    
    $_POST['book'] = "Eye Of the World";
    $_POST['author'] = "Robert Jordan";
    $_POST['series'] = "Wheel of Time";
    $_POST['category'] = "Science Fiction & Fantasy";

    if(isset($_POST['book'])) 
    { //check the post data

        $title = "title=".urlencode($_POST['book']);
        $author = "author=".urlencode($_POST['author']);
        $series = "series=".urlencode($_POST['series']);
        $category = "categories=".urlencode($_POST['category']);
        $fiction = "book_type=Fiction"; 

        error_log("Error message".$query, 3, "../error.log");

        // Set the search term and API endpoint URL
        $url = "https://book-finder1.p.rapidapi.com/api/search?".$title."&".$author."&".$series."&".$category."&".$fiction;

        // Set the API key and API host
        $api_key = "6da6e03ce9msh469aabfbb614233p110d95jsn4a9e601777f2";
        $api_host = "book-finder1.p.rapidapi.com";
        
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
        $context = stream_context_create($options);

        // Make the API request and parse the JSON response
        $bookjson = json_decode(file_get_contents($url, false, $context));

        $bookjson = $bookjson->results[0];

        echo json_encode($bookjson);
        
    }

    //openlibrary exampl
    // Set the search term and API endpoint URL
    /*
        $book = "Harry Potter";
        $url = "http://openlibrary.org/search.json?q=".urlencode($book);

        // Make the API request and parse the JSON response
        $bookjson = json_decode(file_get_contents($url));
        $response = array("result"=>"Success", "bookdata"=>$bookjson);
        echo json_encode($response);
    */
?>

