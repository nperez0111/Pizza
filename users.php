<!doctype html>
<html>
<head>
<style>
	.row{
		max-width:1080px;
		margin:0 auto;
		border:1px solid black;
	}
	.column{padding:15px;border:1px solid black;display:inline-block;box-sizing:border-box;white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;}
	.wemail{width:30%;}
	.name{width:20%;}
</style>
</head>
<body>
<?php 
include 'includes/database.php';
$c=0;
foreach($db->query('SELECT * FROM '.$table) as $row) {
	if($c==0){
		echo '<div class="row"><div class="column name">Name:&nbsp;&nbsp;'.$row['fname'].' '.$row['lname'].'</div><div class="column wemail">Email:&nbsp;&nbsp;'.$row['email'].'</div>';
		$c=1;
	}
	else{
	    echo '<div class="column name">Name:&nbsp;&nbsp;'.$row['fname'].' '.$row['lname'].'</div><div class="column wemail">Email:&nbsp;&nbsp;'.$row['email'].'</div></div> ';
		$c=0;
	}
}

 ?>
</body>
</html>