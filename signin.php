<!doctype html>
<html lang="en">

<head>
    <meta charset="Utf-8">
    <title>Sign In</title>
    <meta name="Author" content="Nicholas Perez" />
    <meta name="HandheldFriendly" content="True">
    <!--<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">-->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        html, body, #a {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
            background-color: dodgerblue;
}#a {
    display: table;
}

#b {
    display: table-cell;
    margin: 0;
    padding: 0;

    text-align: center;
    vertical-align: middle;
}

form {
    width: 40%;
    height: 40%;
    margin: auto;
    background-color: white;
    padding:0;
    text-align: left;
    padding:40px;
    border-radius:10px;
}
        h1{text-align: center}
        input{width:100%;display:block;}
        label{width:100%;}
        input[type="submit"]{float: right;width:auto;}
        a{display:block;margin-top:30px;}
    </style>
</head>

<body>
   <div id="a">
       <div id="b">
           
            <form action="logincheck.php" method="post" id="content">
               <h1>Log In </h1>
                <label for="email">Email:</label>
                <input type="email" name="email" tabindex="1" placeholder="You@email.com" size="50">
                <label for="password">Password:</label>
                <input type="password" name="password" tabindex="4" size="50">
                <input type="submit" name="Submit" value="Submit">
                <a href="signup.php">Click here if you haven't signed up yet!</a>
            </form>
       </div>
    </div>
</body>

</html>