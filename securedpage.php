<?PHP
session_start();

if(!isset($_SESSION['loggedin'])||!$_SESSION['loggedin']==true){
   header("Location: signin.php");
}
 echo"Welcome ".$_SESSION['fname'];

?>
