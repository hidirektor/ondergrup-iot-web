jQuery(document).ready(function(){
  "use strict";  
  // From Up animation script 
  $(".fromup").each(function(i, el) {
      var el = $(el);
      if (el.visible(true)) {
        el.addClass("animated slideInDown"); 
      } 
  });
    
});/*=== Document.Ready Ends Here ===*/ 	

$(window).scroll(function() { 
  // From Up animation script 
  $(".fromup").each(function(i, el) {
      var el = $(el);
      if (el.visible(true)) {
        el.addClass("animated slideInDown"); 
      } 
  });
  // From Left animation script 
  $(".fromleft").each(function(i, el) {
      var el = $(el);
      if (el.visible(true)) {
        el.addClass("animated slideInLeft"); 
      } 
  });
  // From Right animation script 
  $(".fromright").each(function(i, el) {
      var el = $(el);
      if (el.visible(true)) {
        el.addClass("animated slideInRight"); 
      } 
  });
  // From Down animation script
  $(".fromdown").each(function(i, el) {
      var el = $(el);
      if (el.visible(true)) {
        el.addClass("animated slideInUp"); 
      } 
  });
});


