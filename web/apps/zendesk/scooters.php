<?php

include("../../../vendor/autoload.php");

use Zendesk\API\HttpClient as ZendeskAPI;

/**
 * Replace the following with your own.
 */

$subdomain = "portlandoregon";
$username = "gregory.clapp@portlandoregon.gov";
$token = "";

$client = new ZendeskAPI($subdomain);
$client->setAuth('basic', ['username' => $username, 'token' => $token]);
$points = [];

try {
    // create the query
    $search = $client->search()->find('type:ticket form:"PBOT: Report an E-scooter"', ['sort_by' => 'updated_at']);

    $json_tickets;

    if (empty($search->results)) {
        echo "No matching tickets found";
    } else {

      $company_id = 1900004448785;
      $latlon_id = 1900004448725;
      $issue_id = 1500012743981;

      foreach ($search->results as $ticket) {
        $company = getCustomFieldValue($ticket->custom_fields, $company_id);
        $latlon = getCustomFieldValue($ticket->custom_fields, $latlon_id);
        $issue = getCustomFieldValue($ticket->custom_fields, $issue_id);
        $arr_latlon = explode(',', $latlon);
        $points[] = ["company"=>$company, "issue"=>$issue, "latlon" => ["lat"=>$arr_latlon[0], "lon"=>$arr_latlon[1]]];
      }

      $test = $points;

    }
} catch (\Zendesk\API\Exceptions\ApiResponseException $e) {
    echo $e->getMessage().'</br>';
}

function getCustomFieldValue($fields, $id) {
    foreach ($fields as $field) {
      if ($field->id == $id) {
        return $field->value;
      }
    }
}

?>

<html>

<head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
    crossorigin="" />
  <!-- Make sure you put this AFTER Leaflet's CSS -->
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
    integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
    crossorigin=""></script>
  <style>
    #mapContainer { height: 100%; }
    img.bird { filter: hue-rotate(90deg); }
    img.bolt { filter: hue-rotate(180deg); }
    img.lime { filter: hue-rotate(270deg); }
  </style>
   
</head>

<body>
  <div id="mapContainer"></div>

  <script>
    const DEFAULT_LATITUDE = 45.54;
    const DEFAULT_LONGITUDE = -122.65;
    const DEFAULT_ZOOM = 13;
    const ZOOM_POSITION = 'topright';
    var str_points = '<?= json_encode($points) ?>';
    var json_points = JSON.parse(str_points);

    // initialize map
		var layer = L.tileLayer('https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Color_Complete/MapServer/tile/{z}/{y}/{x}', {
				attribution: "PortlandMaps ESRI"
		});
		var zoomcontrols = new L.control.zoom({ position: ZOOM_POSITION });
		var map = new L.Map("mapContainer", {
				center: new L.LatLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
				tap: false,
				zoomControl: false,
				zoom: DEFAULT_ZOOM
		});
		map.addLayer(layer);
		map.addControl(zoomcontrols);

    // create custom markers
    var birdIcon = {
      iconUrl:      '/apps/zendesk/markers/bird.png',
      iconSize:     [25, 41], // size of the icon
      iconAnchor:   [13, 41], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -41] // point from which the popup should open relative to the iconAnchor
    };
    var boltIcon = {
      iconUrl:      '/apps/zendesk/markers/bolt.png',
      iconSize:     [25, 41], // size of the icon
      iconAnchor:   [13, 41], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -41] // point from which the popup should open relative to the iconAnchor
    };
    var limeIcon = {
      iconUrl:      '/apps/zendesk/markers/lime.png',
      iconSize:     [25, 41], // size of the icon
      iconAnchor:   [13, 41], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -41] // point from which the popup should open relative to the iconAnchor
    };
    var spinIcon = {
      iconUrl:      '/apps/zendesk/markers/spin.png',
      iconSize:     [25, 41], // size of the icon
      iconAnchor:   [13, 41], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -41] // point from which the popup should open relative to the iconAnchor
    };

    // add markers
    json_points.forEach(placePoint);

    function placePoint(point) {
      var company = point.company;
      var issue = point.issue;
      var lat = point.latlon.lat;
      var lon = point.latlon.lon;
      var icon;
      switch(company.toLowerCase()) {
        case "bird":
          icon = birdIcon;
          break;
        case "bolt":
          icon = boltIcon;
          break;
        case "spin":
          icon = spinIcon;
          break;
        case "lime":
          icon = limeIcon;
          break;
      }
      var marker = L.marker([lat, lon], { icon: new L.Icon(icon) }).addTo(map);
      // marker._icon.classList.add(company.toLowerCase());
      marker.bindPopup("<b>Issue:</b> " + issue + "<br><b>Company:</b> " + company);
    }


  </script>

</body>

</html>