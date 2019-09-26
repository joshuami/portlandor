(function ($) {
  var hinterXHR = new XMLHttpRequest();

  function handleAddressInput(event) {
    // retireve the input element
    var value = $(event.target).val();
    var option = $('#addresslist').find("[value='" + value + "']");

    if (option.length > 0) {
      $('input.locality').val(option.data("city"));
      $('input.postal-code').val(option.data("zip"));

      var dd = document.querySelector('input.administrative-area');
      for (var i = 0; i < dd.options.length; i++) {
          if (dd.options[i].text.toLowerCase() === option.data("state").toLowerCase()) {
              dd.selectedIndex = i;
              break;
          }
      }
    }
  }

  function handleAddressKeyup(event) {
    // retireve the input element
    var input = event.target;

    // retrieve the datalist element
    var addresslist = document.getElementById('addresslist');

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
                addresslist.innerHTML = "";

                response.candidates.forEach(function(item) {
                    // Create a new <option> element.
                    var option = document.createElement('option');
                    option.value = item.address;
                    option.text = item.address + ', ' + item.attributes.city + ', ' + item.attributes.state + ', ' + item.attributes.zip_code;
                    option.setAttribute('data-city', item.attributes.city);
                    option.setAttribute('data-state', item.attributes.state);
                    option.setAttribute('data-zip', item.attributes.zip_code);

                    // attach the option to the datalist element
                    addresslist.appendChild(option);
                });
            }
        };

        hinterXHR.open("GET", "https://www.portlandmaps.com/api/suggest/?alt_coords=1&api_key=F75A809DAF9012F7B28A4FB552FA5469&query=" + encodeURIComponent(input.value), true);
        hinterXHR.send();
    }
  }

  // On keyup, query PortlandMaps Suggest API
  $( document ).ready(function() {
    // Add a keyup event listener to our input element
    var address_input = $('input.address-line1');
    if(address_input) {
      address_input.on("keyup", handleAddressKeyup);
      address_input.on("input", handleAddressInput);
      // address_input.attr('list', 'addresslist');
      // address_input.after('<datalist id="addresslist"></datalist>');
    }
  });

})(jQuery);