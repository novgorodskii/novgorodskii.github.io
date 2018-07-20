// mail
$(document).ready( function() {
  $(".file-upload input[type=file]").change(function(){
       var filename = $(this).val().replace(/.*\\/, "");
       $("#filename").val(filename);
  });
});

// menu
$(document).ready(function(){

  $( ".top-nav_btn" ).click(function(){
  $( ".top-nav_menu" ).slideToggle();
  });

  $( ".left-sidebar_btn" ).click(function(){ 
  $( ".left-sidebar_menu" ).slideToggle(); 
  });
  
// калькулятор
  var elem = document.querySelector('.calc-range');
  var init = new Powerange(elem, { min: 100000, max: 3000000, start: 100000, hideRange: true, step: 100000 });
  var per;
  var month;
  var result;
  var total;
  var monthly;
  var money = +$('.calc-range').val();

  $('input[name="programms"]').on('change', function(event) {
    month = +$(this).attr('data-month');
    per = +$(this).attr('data-per');
    result = Math.round(per / 12 * month * money);
    total = result + money;
    monthly = parseInt(result / month);
    $('#total').text(total.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
    $('.calc-monthly span').text(monthly.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
    $('#month').text(month);
  });
});

$(".calc-range").on('change', function(event) {
  $('.calc-summ_invest_num span').text($(this).val().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
  var radio = $('input[name="programms"]:checked');
  money = +$(this).val();
  month = +radio.attr('data-month');
  per = +radio.attr('data-per');
  result = Math.round(per / 12 * month * money);
  total = result + money;
  monthly = parseInt(result / month);
  $('#total').text(total.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
  $('.calc-monthly span').text(monthly.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
});

// slick slider 
$('.direction-blocks').slick({
  arrows: false,
  dots: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToScroll: 1,
        slidesToShow: 1
      }
    }
  ]
});


// map
  // When the window has finished loading create our google map below
  google.maps.event.addDomListener(window, 'load', init);

  var urlCars      = '//api.zvezdacar.ru/api/car/get-cars';
  var urlGeozones  = '//api.zvezdacar.ru/api/geofence/geozones';

  function getCars(url) {
    return new Promise((resolve, reject) => {

      fetch(url)
      .then(response => response.json())
      .then(json => resolve(json.data.cars))
      .catch(error => reject(error));

    })
  }

  function getGeoZones(url) {
    return new Promise((resolve, reject) => {

      fetch(url)
      .then(response => response.json())
      .then(json => resolve(json.data))
      .catch(error => reject(error));

    })
  }

  function init() {

      var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 15,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(40.6700, -73.9400), // New York

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [
          {"featureType":"landscape.natural",
          "elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
      };

      var mapElement = document.getElementById('map');

      var map = new google.maps.Map(mapElement, mapOptions);

      var infowindow = new google.maps.InfoWindow();

      var bounds = new google.maps.LatLngBounds();

      var infoWindowContent = (car) => {
        return `
          <div class="info-window">
            <div class="info-window-left">
              <div class="info-window-image">
                <img src="img/icons/logo.jpg" alt="Logo" />
              </div>
            </div>
            <div class="info-window-body">
              <div class="info-window-header">
                <div class="info-window-car">${car.mark} ${car.model}</div>
                <div class="info-window-address">${car.address ? car.address : ''}</div>
              </div>
              <div class="info-window-meta">
              ${car.fuelDistance ?
                `<div class="info-window-fuel">
                  <div class="info-window-value">${car.fuelDistance}км</div>
                  <div class="info-window-label">осталось бензина</div>
                </div>`
                : ''}
                <div class="info-window-price">
                  <div class="info-window-value">7 &#8381; / мин</div>
                  <div class="info-window-label"> 2 &#8381; минута парковки</div>
                </div>
              </div>
            </div>
          </div>
        `
      };
      

      var image = {
        url: 'img/icons/marker.png',
        scaledSize: new google.maps.Size(30, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 25)
      };

      getCars(urlCars)
      .then(cars => {

        for (i = 0; i < cars.length; i++) {
          var position = new google.maps.LatLng(cars[i].lat, cars[i].lon);
          bounds.extend(position);

          marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: image
          });

          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(infoWindowContent(cars[i]));
              infowindow.open(map, marker);
            }
          })(marker, i));

          map.fitBounds(bounds);

        }

      });

      getGeoZones(urlGeozones)
    .then(geozones => {

      geozones.forEach(geozone => {

        var coordinates = [];

        var type = typeof geozone.geo.coordinates[0];
        
        
        if (type === 'number') {
            var c = geozone.geo.coordinates;
            coordinates.push({
              lat: c[1],
              lng: c[0]
            });

            var position = new google.maps.LatLng(c[1], c[0]);
            bounds.extend(position);
            map.fitBounds(bounds);
        }

        if (type === 'object') {
          geozone.geo.coordinates.forEach((coordinate, index) => {
            coordinates.push({
              lat: coordinate[1],
              lng: coordinate[0]
            });

            var position = new google.maps.LatLng(coordinate[1], coordinate[0]);
            bounds.extend(position);
            map.fitBounds(bounds);

          });
        }

        var coordinatesPolygon = new google.maps.Polygon({
          paths: coordinates,
          strokeColor: geozone.types.color,
          strokeOpacity: geozone.types.opacity,
          strokeWeight: geozone.types.weight,
          fillColor: geozone.types.color,
          fillOpacity: 0.35
        });

        coordinatesPolygon.setMap(map);

      })
    })
  }
