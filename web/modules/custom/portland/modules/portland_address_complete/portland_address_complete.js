(function ($) {
  var hinterXHR = new XMLHttpRequest();
  function handleAddressInput(event) {
    // retireve the input element
    var input = event.target;

    // retrieve the datalist element
    var address_list = document.getElementById('address_list');

    // minimum number of characters before we start to generate suggestions
    var min_characters = 3;

    if (input.value.length < min_characters ) { 
        return;
    } else { 

        // abort any pending requests
        hinterXHR.abort();

        hinterXHR.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                // We're expecting a json response so we convert it to an object
                var response = JSON.parse( this.responseText ); 

                // clear any previously loaded options in the datalist
                address_list.innerHTML = "";

                response.candidates.forEach(function(item) {
                    // Create a new <option> element.
                    var option = document.createElement('option');
                    option.value = item.address;

                    // attach the option to the datalist element
                    address_list.appendChild(option);
                });
            }
        };

        hinterXHR.open("GET", "https://www.portlandmaps.com/api/suggest/?alt_coords=1&api_key=F75A809DAF9012F7B28A4FB552FA5469&query=" + encodeURIComponent(input.value), true);
        hinterXHR.send();
    }
  }

  // On keydown, query PortlandMaps Suggest API
  $( document ).ready(function() {
    // Add a keyup event listener to our input element
    var address_input = $('input.address-line1');
    if(address_input) {
      address_input.on("keyup", handleAddressInput);
      // address_input.attr('list', 'address_list');
      // address_input.after('<datalist id="address_list"></datalist>');
    }
  });

})(jQuery);