(function ($) {

  var request = new XMLHttpRequest();
  var map;
  var marker;
  var locationErrorShown;
  var locateControl;
  var locMarker;
  var locCircle;
  var locateControlContaier;

  Drupal.behaviors.portland_location_picker = {
    attach: function (context, settings) {

      const DEFAULT_LATITUDE = 45.51;
      const DEFAULT_LONGITUDE = -122.65;
      const DEFAULT_ZOOM = 11;
      const DEFAULT_ZOOM_CLICK = 18;
      const DEFAULT_ZOOM_VERIFIED = 18;
      const ZOOM_POSITION = 'topright';

      var response; // = { "status": "success", "spatialReference": { "wkid": 102100, "latestWkid": 3857 }, "candidates": [{ "location": { "x": -1.3645401627E7, "y": 5708911.764 }, "attributes": { "sp_x": 7669661.490, "sp_y": 694349.134, "city": "PORTLAND", "jurisdiction": "PORTLAND", "state": "OREGON", "lon": -122.57872839300, "id": 40159, "type": "intersection", "lat": 45.55241828270, "county": "MULTNOMAH" }, "address": "NE 82ND AVE AND NE SANDY BLVD", "extent": { "ymin": 5708911.514, "ymax": 5708912.014, "xmin": -1.3645401877E7, "xmax": -1.3645401377E7 } }] };
      var suggestionsModal;
      var statusModal;
      var baseLayer;
      var aerialLayer;
      var currentView = "base";
      var baseLayer = L.tileLayer('https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Color_Complete/MapServer/tile/{z}/{y}/{x}', {
        attribution: "PortlandMaps ESRI"
      });
      var aerialLayer = L.tileLayer('https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Color_Complete_Aerial/MapServer/tile/{z}/{y}/{x}', {
        attribution: "PortlandMaps ESRI"
      });

      var LocateControl = L.Control.extend({
        options: {
          position: "bottomright"
        },
        onAdd: function (map) {
          locateControlContaier = L.DomUtil.create('div', 'leaflet-bar locate-control leaflet-control leaflet-control-custom');

          locateControlContaier.style.backgroundImage = "url(/modules/custom/portland/modules/portland_location_picker/images/map_locate.png)";
          locateControlContaier.title = 'Locate me';

          locateControlContaier.onclick = function (e) {
            cancelEventBubble(e);
            locationErrorShown = false;
            geoLocate();
          };

          return locateControlContaier;
        }
      });

      var AerialControl = L.Control.extend({
        options: {
          position: "bottomright"
        },
        onAdd: function (map) {
          aerialControlContainer = L.DomUtil.create('div', 'leaflet-bar locate-control leaflet-control leaflet-control-custom');

          aerialControlContainer.style.backgroundImage = "url(/modules/custom/portland/modules/portland_location_picker/images/map_aerial.png)";
          aerialControlContainer.title = 'Aerial view';

          aerialControlContainer.onclick = function (e) {
            cancelEventBubble(e);
            locationErrorShown = false;
            toggleAerialView();
          };

          return aerialControlContainer;
        }
      });

      var hereIcon = L.icon({
        iconUrl: "/modules/custom/portland/modules/portland_location_picker/images/map_marker_here.png",
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        className: "hereIcon"
      });

      initialize();

      function initialize() {

        // initialize map ///////////////////////////////////
        var zoomcontrols = new L.control.zoom({ position: ZOOM_POSITION });
        map = new L.Map("location_map", {
          center: new L.LatLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
          zoomControl: false,
          zoom: DEFAULT_ZOOM
        });
        map.addLayer(baseLayer);
        map.addControl(zoomcontrols);
        map.on('click', handleMapClick);
        map.on('locationerror', handleLocationError);
        map.on('locationfound', handleLocationFound);
        // force a crosshair cursor
        $('.leaflet-container').css('cursor', 'crosshair');
        aerialControl = new AerialControl();
        map.addControl(aerialControl);
        locateControl = new LocateControl();
        map.addControl(locateControl);

        // Set up verify button //////////////////////////////////
        $('.location-picker-address').after('<input class="btn location-verify button js-form-submit form-submit" type="submit" id="location_verify" name="op" value="Verify">');
        $('.location-picker-address').after('<span class="verified-checkmark invisible" title="Location is verified!">✓</span>');
        $(document).on('click', '#location_verify', function (e) {
          e.preventDefault();
          var address = $('.location-picker-address').val();
          // Portland Maps API for location suggestions doesn't work property when an ampersand is used
          // to identify an intersection. It must be the word "and."
          address = address.replace("&", "and");
          if (address.length < 1) {
            showStatusModal("Please enter an address or cross streets and try again.");
            return false;
          }
          verifyAddress(address);
        });

        // Set up pick links //////////////////////////////////
        $(document).on('click', 'a.pick', function (e) {
          e.preventDefault();
          // get address data from link
          var address = $(this).data('pick-address');
          // put selected address in address field
          $('.location-picker-address').val(address);
          suggestionsModal.dialog('close');
          // locate address on map
          var lat = $(this).data('lat');
          var lon = $(this).data('lon');
          setMarkerAndZoom(lat, lon, true, true, DEFAULT_ZOOM_VERIFIED);
          setVerified();
        });

        // set up status modal ///////////////////////////////
        // this will display error messages, or a status indicator when performing slow ajax operations such as self geolocation
        statusModal = $('#status_modal');

        // set up address field to turn off verified checkmark if value changes
        $('.location-picker-address').on('keyup', function () {
          setUnverified();
        });
      }

      function toggleAerialView() {
        if (currentView != "aerial") {
          map.removeLayer(baseLayer);
          map.addLayer(aerialLayer);
          currentView = "aerial";
          // show icon active
          aerialControlContainer.style.background = 'url("/modules/custom/portland/modules/portland_location_picker/images/map_base.png")';
        } else {
          map.removeLayer(aerialLayer);
          map.addLayer(baseLayer);
          currentView = "base";
          aerialControlContainer.style.background = 'url("/modules/custom/portland/modules/portland_location_picker/images/map_aerial.png")';
        }
      }

      function verifyAddress(address) {
        var encodedAddress = encodeURI(address);
        // abort any pending requests
        request.abort();
        // set up event handler to process response
        request.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response.error) {
              showErrorModal("There was a problem retrieving address data.");
              return false;
            }
            if (response.candidates.length == 0) {
              showStatusModal('No matching locations found. Please try a different address and try again.');
              return false;
            }
            processLocationData(response.candidates);
          } else if (this.readyState == 4 && this.status != 200) {
            showStatusModal('There was a problem retrieving address data. Error code ' + this.status + '.');
            return false;
          };
        }
        // API documentation: https://www.portlandmaps.com/development/#suggest
        var url = "https://www.portlandmaps.com/api/suggest/?intersections=1&alt_coords=1&api_key=" + drupalSettings.portlandmaps_api_key + "&query=" + encodedAddress;
        request.open("GET", url, true);
        request.send();
      }

      function geoLocate() {
        var t = setTimeout(function () {
          // display status indicator
          showStatusModal("Triangulating on your current location. Please wait...");
          map.locate({ watch: false, setView: true, maximumAge: 20000, enableHighAccuracy: true });
        }, 500);
      }

      function reverseLookup(lat, lng) {
        // abort any pending requests
        request.abort();
        // set up event handler to process response
        request.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response.error) {
              showErrorModal("There was a problem retrieving data for the selected location.");
              return false;
            }
            processReverseLocationData(response);
          } else if (this.readyState == 4 && this.status != 200) {
            showStatusModal('There was a problem retrieving data for the selected location. Error code ' + this.status + '.');
            return false;
          };
        }
        // API documentation: https://developers.arcgis.com/rest/geocode/api-reference/geocoding-reverse-geocode.htm
        var url = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=json&locationType=street&location=' + lng + ',' + lat;
        // featureTypes paramter values:
        // StreetInt, DistanceMarker, StreetAddress, StreetName, POI, Subaddress, PointAddress, Postal, Locality

        request.open("GET", url, true);
        request.send();
      }

      function processLocationData(candidates) {

        // if only one candidate, immediately locate it on the map
        if (candidates.length > 1) {
          // multiple candidates, how to handle? how about a modal dialog?
          suggestionsModal = $('#suggestions_modal');
          var listMarkup = "<p>Please select an address by clicking it.</p><ul>";
          for (var i = 0; i < candidates.length; i++) {
            var c = candidates[i];
            var fulladdress = buildFullAddress(c);
            listMarkup += '<li><a href="#" class="pick" data-lat="' + c.attributes.lat + '" data-lon="' + c.attributes.lon + '" data-pick-address="' + fulladdress + '">' + fulladdress.toUpperCase() + '</a></li>';
          }
          listMarkup += "</ul>";
          suggestionsModal.html(listMarkup);
          Drupal.dialog(suggestionsModal, {
            title: 'Multiple possible matches found',
            width: '600px',
            buttons: [{
              text: 'Close',
              click: function () {
                $(this).dialog('close');
              }
            }]
          }).showModal();
          suggestionsModal.removeClass('visually-hidden');
        } else if (candidates.length == 1) {
          var lat = candidates[0]["attributes"]["lat"];
          var lon = candidates[0]["attributes"]["lon"];
          // put full address in field
          var fulladdress = buildFullAddress(candidates[0]);
          $('.location-picker-address').val(fulladdress);
          setMarkerAndZoom(lat, lon, true, true, DEFAULT_ZOOM_VERIFIED);
          setVerified();
        } else {
          // no matches found
          showStatusModal("No matches found. Please try again.");
        }
      }

      function buildFullAddress(c){
        if (c.attributes.type == "intersection") {
          return c.address;
        }
        var address = c.address;
        var city = c.attributes.city;
        var state = c.attributes.state;
        var zip = c.attributes.zip_code;
        return address + ', ' + city + ', ' + state + ' ' + zip;
      }

      function processReverseLocationData(data) {
        var address = data.address.Address;
        var city = data.address.City;
        var state = data.address.Region;
        var postalExt = data.address.PostalExt;
        var postal = data.address.Postal;
        var business = data.address.PlaceName;
        var addressLabel = address.length > 0 ? address + ', ' + city + ', ' + state + ' ' + postal : city;
        $('.location-picker-address').val(addressLabel);
        $('.place-name').val(business);
        setVerified();
      }

      function showStatusModal(message) {
        statusModal.html('<p class="status-message">' + message + '</p>');
        Drupal.dialog(statusModal, {
          width: '600px',
          buttons: [{
            text: 'Close',
            click: function () {
              $(this).dialog('close');
            }
          }]
        }).showModal();
        statusModal.removeClass('visually-hidden');
      }

      function showErrorModal(message) {
        message = message + '<br><br>Please try again in a few moments. If the error persists, please <a href="/feedback">contact us</a>.';
        showStatusModal(message);
      }

      function setVerified() {
        $('.verified-checkmark').removeClass('invisible');
        $('.location-verify').prop('disabled', true);
      }

      function setUnverified() {
        $('.verified-checkmark').addClass('invisible');
        $('.location-verify').prop('disabled', false);
      }


      function handleMapClick(e) {
        setMarkerAndZoom(e.latlng.lat, e.latlng.lng, true, false, DEFAULT_ZOOM_CLICK);
        reverseLookup(e.latlng.lat, e.latlng.lng);
      }

      function setMarkerAndZoom(lat, lon, zoom, center, zoomlevel) {
        // remove previous marker
        if (marker) {
          map.removeLayer(marker);
          marker = null;
        }

        // set new layer
        var latlon = [lat, lon];
        marker = L.marker(latlon, { draggable: true, riseOnHover: true }).addTo(map);
        if (center) {
          map.setView(latlon);
        }
        if (zoom) {
          map.setView(latlon, zoomlevel);
        }
        
        // anytime a marker is set or moved, put the latlon in the hidden fields
        $('.location-lat').val(lat);
        $('.location-lon').val(lon);

        // set dragend event handler on marker
        marker.on('dragend', function (e) {
          // capture new lat/lon values in hidden fields
          var latlng = marker.getLatLng();
          $('.location-lat').val(latlng.lat);
          $('.location-lon').val(latlng.lng);
          reverseLookup(latlng.lat, latlng.lng);
        });
      }

      function cancelEventBubble(e) {
        var evt = e ? e : window.event;
        if (evt.stopPropagation) evt.stopPropagation();
        if (evt.cancelBubble != null) evt.cancelBubble = true;
      }

      function handleLocationFound(e) {
        if (!locateControl) {
          locateControl = new LocateControl();
          map.addControl(locateControl);
        }

        if (locMarker && locCircle) {
          map.removeLayer(locMarker).removeLayer(locCircle);
        }
        var radius = e.accuracy;
        locMarker = L.marker(e.latlng, { icon: hereIcon }).addTo(map);
        locCircle = L.circle(e.latlng, radius, { weight: 2, fillOpacity: 0.1 }).addTo(map);
        locateControlContaier.style.backgroundImage = 'url("/modules/custom/portland/modules/portland_location_picker/images/map_locate_on.png")';
      
        // hide status indicator
        statusModal.dialog('close');
      }

      function handleLocationError(e) {
        var message = e.message;
        statusModal.dialog('close');
        showStatusModal(message);
        locateControlContaier.style.backgroundImage = 'url("/modules/custom/portland/modules/portland_location_picker/images/map_locate.png")';
      }

    }
  };
})(jQuery);