<?PHP
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400'); 
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, ADD"); 
        header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding');
        http_response_code(200);
?>