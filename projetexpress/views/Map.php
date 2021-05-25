<?php 
// Database configuration 
$con = mysqli_connect("127.0.0.1", "root", "", "expressdb") or die("Impossible de se connecter :  " . mysql_error());

$sql = "SELECT * FROM monuments ";
$result = mysqli_query($con, $sql);
 
// Fetch the info-window data from the database 
$result2 = mysqli_query($con, $sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>gestion</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
  <style>
    #map{
      height:400px;
      width:100%;
    }
  </style>
</head>
<body>
  <h1>gestion</h1>
  <form action="/save" method="post">
    <div class="form-group">
      <label for="latitude">latitude:</label>
      <input type="text" class="form-control" id="email1" placeholder="Enter latitude" name="latitude" required>
    </div>
    <div class="form-group">
      <label for="longitude">longitude:</label>
      <input type="text" class="form-control" id="email2" placeholder="Enter longitude" name="longitude" required>
    </div>
	<button type="button" id="anass" >show position</button>
  </form>
  <div id="map"></div>
      
          
  <script>
function initMap() {
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    };
                    
    // Display a map on the web page
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    map.setTilt(100);
        
    // Multiple markers location, latitude, and longitude
    var markers = [
        <?php if($result->num_rows > 0){ 
            while($row = $result->fetch_assoc()){ 
                echo '["'.$row['nom'].'", '.$row['latitude'].', '.$row['longitude'].', "'.$row['ville'].'"],'; 
            } 
        } 
        ?>
    ];
                        
    // Info window content
    var infoWindowContent = [
        <?php if($result2->num_rows > 0){ 
            while($row = $result2->fetch_assoc()){ ?>
                ['<div class="info_content">' +
                '<h3><?php echo $row['nom']; ?></h3>' +
                '<p><?php echo $row['ville']; ?></p>' + '</div>'],
        <?php } 
        } 
        ?>
    ];
        
    // Add multiple markers to map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
    // Place each marker on the map  
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
			icon: markers[i][5],
            title: markers[i][1]
        });
        
        // Add info window to marker    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Center the map to fit all markers on the screen
        map.fitBounds(bounds);
    }

    // Set zoom level
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });
}

// Load initialize function
google.maps.event.addDomListener(window, 'load', initMap);
</script>
  <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAXiKlz-u4w3wOeTD8XyOcLfYzZ4FMzXR4&callback=initMap">
    </script>
	
</body>
</html>
