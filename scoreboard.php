<?php
	$servername = ""; // Semml
	$username = "";
	$password = "";
	$dbname = "";

	$con = mysqli_connect($servername, $username, $password, $dbname);
	if (!$con) {
		die("MYSQL Verbindungsfehler: " . mysqli_connect_error());
	}
	
	$showAll = $_GET['showAll'];
	
	if($showAll == 'false' || empty($_GET)) {
		$sqlstr="SELECT * FROM scoreboard ORDER BY score DESC LIMIT 10";
	}else{
		$sqlstr="SELECT * FROM scoreboard ORDER BY score DESC";
	}
	
	$result = mysqli_query($con, $sqlstr);

	if (mysqli_num_rows($result) > 0) {
		echo "<style> table { border-collapse: collapse; width: 322px; overflow-x:auto; } th, td { text-align: left; padding: 8px; } tr:nth-child(even){background-color: #f2f2f2} th { background-color: #4CAF50; color: white; } tbody { overflow: auto; } </style>";
		echo "<center>";
		echo "<table>";
		echo "<tr>";
		echo "<th>Place</th>";
		echo "<th>Score</th>";
		echo "<th>Name</th>";
		echo "<th>Play-Time</th>";
		echo "<th>Date</th>";
		echo "</tr>";
		echo "<tbody>";
		$counter = 1;
		while($row = mysqli_fetch_assoc($result)) {
			$playTime = $row["playTime"];
			if($playTime == '0') {
				$playTime = '-';
			}else{
				$playTime = $playTime / 1000;
				$mins = floor($playTime / 60 % 60);
				$secs = floor($playTime % 60);
				$secs = $secs < 10 ? "0" . $secs : $secs;
				$playTime = $mins . ":" . $secs;
			}
			echo "<tr>";
			echo "<td>" . $counter . ".</td>"; 
			echo "<td>" . $row["score"] . "</td>";
			echo "<td>" . $row["name"] . "</td>";
			echo "<td>" . $playTime . "</td>";
			echo "<td>" . $row["timeplayed"] . "</td>";
			echo "</tr>";
			$counter++;
		}
		echo "</tbody>";
		echo "</table>";
		echo "<a href='http://riptosscreencorn.bplaced.net/games/tetris/tetris.html'><button>Play again</button></a>&nbsp;";
		echo "<a href='http://riptosscreencorn.bplaced.net/'><button>Main Page</button></a>&nbsp;";
		if($showAll == 'false' || empty($_GET)) {
			echo "<a href='http://riptosscreencorn.bplaced.net/games/tetris/scoreboard.php?showAll=true'><button>Show full scoreboard</button></a>";
		}else{
			echo "<a href='http://riptosscreencorn.bplaced.net/games/tetris/scoreboard.php?showAll=false'><button>Show top 10</button></a>";
		}
		echo "</center>";
	} else {
		echo "Noch kein Score vorhanden ...";
	}
	mysqli_close($con);
?>