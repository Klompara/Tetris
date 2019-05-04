<?php

	function getUserIP()
	{
		$client  = @$_SERVER['HTTP_CLIENT_IP'];
		$forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
		$remote  = $_SERVER['REMOTE_ADDR'];

		if(filter_var($client, FILTER_VALIDATE_IP))
		{
			$ip = $client;
		}
		elseif(filter_var($forward, FILTER_VALIDATE_IP))
		{
			$ip = $forward;
		}
		else
		{
			$ip = $remote;
		}
		return $ip;
	}
	
	$servername = ""; // Semml
	$username = "";
	$password = "";
	$dbname = "";
	
	$hash = $_POST['hash'];
	$level = $_POST['levell'];
	$name = $_POST['name'];
	$name = str_replace(' ', '', $name);
	$score = $_POST['score'];
	$ip = getUserIP();
	$playtime = $_POST['playtime'];
	date_default_timezone_set('Europe/Vienna'); // aender dass beim insert die systemzeit vom datenbank bims
	$timePlay = date('m/d/Y h:i:s a', time());

	$con = mysqli_connect($servername, $username, $password, $dbname);
	if (!$con) {
		die("MYSQL Verbindungsfehler: " . mysqli_connect_error());
	}
	
	header("location#:/games/tetris/scoreboard.php");
	
	if($name != '' && $score != 0 && $hash/13-$level == $score) {
		$sqlstr="INSERT INTO scoreboard (id, name, score, ip, playTime, timeplayed) VALUES (NULL,'$name','$score', '$ip', '$playtime', '$timePlay')";
		mysqli_query($con, $sqlstr);
	}
	
	if($hash/13-$level != $score) {
		echo "y u do this";
		exit;
	}
	mysqli_close($con);
	header("Location: /games/tetris/scoreboard.php?showAll=false");
	exit;
?>