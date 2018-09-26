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


