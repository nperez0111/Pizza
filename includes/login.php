<?PHP
/*

  _      ____   _____ _____ _   _       __  _      ____   _____  ____  _    _ _______            _____ _____
 | |    / __ \ / ____|_   _| \ | |     / / | |    / __ \ / ____|/ __ \| |  | |__   __|     /\   |  __ \_   _|
 | |   | |  | | |  __  | | |  \| |    / /  | |   | |  | | |  __| |  | | |  | |  | |       /  \  | |__) || |
 | |   | |  | | | |_ | | | | . ` |   / /   | |   | |  | | | |_ | |  | | |  | |  | |      / /\ \ |  ___/ | |
 | |___| |__| | |__| |_| |_| |\  |  / /    | |___| |__| | |__| | |__| | |__| |  | |     / ____ \| |    _| |_
 |______\____/ \_____|_____|_| \_| /_/     |______\____/ \_____|\____/ \____/   |_|    /_/    \_\_|   |_____|


*/
function checkPrivileges( $tableName ) {
    global $adminRequired;
    if ( in_array( $tableName, $adminRequired ) ) {
        if ( !isAdmin() ) {
            rest_error( "Invalid privileges, not an Admin", 401 );
            return false;
        }
    }
    return true;
}

function loginWJson() {
    global $JSON;
    $json=$JSON;
    //echo "json is";
    //echo json_encode($JSON);
    //echo (checkUser(@$json['login']['Email'],@$json['login']['password']))?"TRUE":"FALSE";
    return checkUser( @$json['login']['Email'], @$json['login']['password'] );
}

function checkUser( $userName, $password ) {
    if ( !isset( $userName )&& !isset( $password ) ) {
        return false;
    }

    include '../../includes/database.php';
    // Retrieve username and password from database according to user's input
    $stmt = $db->prepare( "SELECT * FROM "."users"." WHERE (`Email` = :Email)" );

    $resul = $stmt->execute( array( ':Email'=>$userName ) );
    $result = $stmt->fetch();
    $num_rows = $stmt->rowCount();
    // Check username and password match
    //echo $num_rows > 0 &&validate_password($password,$result['password'])?"pasword is real...\n":"not the right pass?\n";
    if ( $num_rows > 0 && validate_password( $password, $result['password'] ) ) {
        // Set username session variable
        $_SESSION['Email'] = $userName;
        $_SESSION['loggedin'] = true;
        $_SESSION['FName'] = $result['FName'];
        $_SESSION['LName'] = $result['LName'];
        $_SESSION['Index'] = $result['Index'];
        $_SESSION['verified'] = @$result['verified'];
        return true;
    }
    else {
        return false;
    }
}

function isAdmin() {
    if ( !isset( $_SESSION['Email'] )||!isset( $_SESSION['loggedin'] )||$_SESSION['loggedin']==false ) {
        return false;
    }
    global $db;
    $stmt = $db->prepare( "SELECT * FROM users WHERE (`Email` = :Email)" );

    $resul = $stmt->execute( array( ':Email'=>$_SESSION['Email'] ) );
    $result = $stmt->fetch();
    $num_rows = $stmt->rowCount();
    if ( $num_rows > 0&&$result['verified']=="1" ) {
        return true;
    }
    return false;
}


/*

  ______ _   _ _____     ____  ______   _      ____   _____ _____ _   _       __  _      ____   _____  ____  _    _ _______            _____ _____
 |  ____| \ | |  __ \   / __ \|  ____| | |    / __ \ / ____|_   _| \ | |     / / | |    / __ \ / ____|/ __ \| |  | |__   __|     /\   |  __ \_   _|
 | |__  |  \| | |  | | | |  | | |__    | |   | |  | | |  __  | | |  \| |    / /  | |   | |  | | |  __| |  | | |  | |  | |       /  \  | |__) || |
 |  __| | . ` | |  | | | |  | |  __|   | |   | |  | | | |_ | | | | . ` |   / /   | |   | |  | | | |_ | |  | | |  | |  | |      / /\ \ |  ___/ | |
 | |____| |\  | |__| | | |__| | |      | |___| |__| | |__| |_| |_| |\  |  / /    | |___| |__| | |__| | |__| | |__| |  | |     / ____ \| |    _| |_
 |______|_| \_|_____/   \____/|_|      |______\____/ \_____|_____|_| \_| /_/     |______\____/ \_____|\____/ \____/   |_|    /_/    \_\_|   |_____|


*/
?>