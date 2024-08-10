/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */

/**
 * Configure the Routes
 */
var app = angular.module('tutorialWebApp', ['ngRoute']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    .when("/dashboard-2", {templateUrl: "partials/home2.html", controller: "PageCtrl"})
    .when("/dashboard-3", {templateUrl: "partials/home3.html", controller: "PageCtrl"})
    .when("/dashboard-4", {templateUrl: "partials/home4.html", controller: "PageCtrl"})

    .when("/pages/hover-masters", {templateUrl: "partials/pages/hover-masters.html", controller: "PageCtrl"})
    .when("/pages/buttons", {templateUrl: "partials/pages/buttons.html", controller: "PageCtrl"})
    .when("/pages/email/compose", {templateUrl: "partials/pages/compose.html", controller: "PageCtrl"})
    .when("/pages/inbox", {templateUrl: "partials/pages/inbox.html", controller: "PageCtrl"})
    .when("/pages/setting", {templateUrl: "partials/pages/profile-setting.html", controller: "PageCtrl"})
    .when("/pages/profile", {templateUrl: "partials/pages/profile.html", controller: "ProfileCtrl"})
    .when("/pages/step-forms", {templateUrl: "partials/pages/step-form.html", controller: "PageCtrl"})
    .when("/pages/form-elements", {templateUrl: "partials/pages/form-elements.html", controller: "PageCtrl"})
    .when("/pages/charts", {templateUrl: "partials/pages/chart.html", controller: "PageCtrl"})
    .when("/pages/popovers", {templateUrl: "partials/pages/popovers.html", controller: "PageCtrl"})
    .when("/pages/tooltips", {templateUrl: "partials/pages/tooltips.html", controller: "PageCtrl"})
    .when("/pages/widget", {templateUrl: "partials/pages/widget.html", controller: "PageCtrl"})
	.when("/pages/blog-post", {templateUrl: "partials/pages/blog-post.html", controller: "PageCtrl"})
	.when("/pages/tickets", {templateUrl: "partials/pages/tickets.html", controller: "PageCtrl"})
    .when("/pages/team-2", {templateUrl: "partials/pages/team-2.html", controller: "PageCtrl"})
    .when("/pages/team", {templateUrl: "partials/pages/team.html", controller: "PageCtrl"})
    .when("/pages/portfolio-2", {templateUrl: "partials/pages/portfolio-2.html", controller: "PageCtrl"})
    .when("/pages/portfolio", {templateUrl: "partials/pages/portfolio.html", controller: "PageCtrl"})
    .when("/pages/image-crop", {templateUrl: "partials/pages/image-crop.html", controller: "ImageCtrl"})
    .when("/pages/pagination", {templateUrl: "partials/pages/pagination.html", controller: "PageCtrl"})
    .when("/pages/services-3", {templateUrl: "partials/pages/services-3.html", controller: "PageCtrl"})
    .when("/pages/services-2", {templateUrl: "partials/pages/services-2.html", controller: "PageCtrl"})
    .when("/pages/services", {templateUrl: "partials/pages/services.html", controller: "PageCtrl"})
    .when("/pages/collapse", {templateUrl: "partials/pages/collapse.html", controller: "PageCtrl"})
    .when("/pages/progress-bar", {templateUrl: "partials/pages/progress-bar.html", controller: "PageCtrl"})
    .when("/pages/grids-ribbon", {templateUrl: "partials/pages/ribbon-grids.html", controller: "PageCtrl"})
    .when("/pages/vector-map", {templateUrl: "partials/pages/vector-map.html", controller: "PageCtrl"})
    .when("/pages/google-map", {templateUrl: "partials/pages/google-map.html", controller: "MapCtrl"})
    .when("/pages/scroll-box", {templateUrl: "partials/pages/scroll-box.html", controller: "PageCtrl"})
    .when("/pages/static-tables", {templateUrl: "partials/pages/static-tables.html", controller: "PageCtrl"})
    .when("/pages/505", {templateUrl: "partials/pages/505.html", controller: "PageCtrl"})
    .when("/pages/404", {templateUrl: "partials/pages/404.html", controller: "PageCtrl"})
    .when("/pages/contact", {templateUrl: "partials/pages/contact.html", controller: "ContactCtrl"})
    .when("/pages/timeline", {templateUrl: "partials/pages/timeline.html", controller: "PageCtrl"})
    .when("/forgot-password", {templateUrl: "partials/pages/forgot-password.html", controller: "PageCtrl"})
    .when("/pages/faq", {templateUrl: "partials/pages/faq.html", controller: "PageCtrl"})
    .when("/pages/range-slider", {templateUrl: "partials/pages/range-slider.html", controller: "PageCtrl"})
    .when("/pages/succesful", {templateUrl: "partials/pages/succesful.html", controller: "PageCtrl"})
    .when("/pages/billing", {templateUrl: "partials/pages/billing.html", controller: "PageCtrl"})
    .when("/pages/invoice", {templateUrl: "partials/pages/invoice.html", controller: "PageCtrl"})
    .when("/register", {templateUrl: "partials/pages/register.html", controller: "PageCtrl"})
    .when("/login", {templateUrl: "partials/pages/login.html", controller: "PageCtrl"})
    .when("/pages/font-awesome-icons", {templateUrl: "partials/pages/font-awesome-icons.html", controller: "PageCtrl"})
    .when("/pages/themify-icons", {templateUrl: "partials/pages/themify-icons.html", controller: "PageCtrl"})
    .when("/pages/blank", {templateUrl: "partials/pages/blank.html", controller: "PageCtrl"})
    .when("/pages/css-spinners", {templateUrl: "partials/pages/spinners.html", controller: "PageCtrl"})
    .when("/pages/tour", {templateUrl: "partials/pages/page-tour.html", controller: "TourCtrl"})
    .when("/pages/price-table", {templateUrl: "partials/pages/price-table.html", controller: "PageCtrl"})
    .when("/pages/notification", {templateUrl: "partials/pages/notification.html", controller: "PageCtrl"})
    .when("/pages/notification-2", {templateUrl: "partials/pages/notification2.html", controller: "PageCtrl"})
    .when("/pages/search", {templateUrl: "partials/pages/search.html", controller: "PageCtrl"})
    .when("/pages/grids", {templateUrl: "partials/pages/grids.html", controller: "PageCtrl"})
    .when("/pages/gallery", {templateUrl: "partials/pages/gallery.html", controller: "PageCtrl"})
    .when("/pages/gallery-2", {templateUrl: "partials/pages/gallery2.html", controller: "PageCtrl"})

    .when("/blog", {templateUrl: "partials/blog.html", controller: "BlogCtrl"})
    .when("/blog/post", {templateUrl: "partials/blog_item.html", controller: "BlogCtrl"})
    // else 404
    .otherwise({
        redirectTo: '/pages/404'
      })
  }]).
  
  // Google Map Controller
  controller('MapCtrl', ['$scope', '$location', function($scope, $location) {

    $(document).scrollTop(0);
    
    $scope.mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(41.923, 12.513),
    mapTypeId: google.maps.MapTypeId.TERRAIN
    }
    $scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOptions);

    var loaded = 0;
    var imgCounter = $(".main-content img").length;
    if(imgCounter > 0){
      console.log(imgCounter);
      function doProgress() {
        $(".main-content img").load(function() {
          loaded++;
          var newWidthPercentage = (loaded / imgCounter) * 100;
          animateLoader(newWidthPercentage + '%');      
        })
      } 
      function animateLoader(newWidth) {
        $("#progressBar").width(newWidth);
        if(imgCounter === loaded){
          setTimeout(function(){
                    $("#progressBar").animate({opacity:0});
                },500);
        }
      }
      doProgress();
    }else{
      setTimeout(function(){
          $("#progressBar").css({
            "opacity":0,
            "width":"100%"
          });
      },500);
    }

  }]).

  // Page Tour Controller
  controller('TourCtrl', ['$scope', '$location', function($scope, $location) {

    $(document).scrollTop(0);
    
    $(function(){
    var introguide = introJs();
    // var startbtn   = $('#startdemotour');
    introguide.setOptions({
    steps: [
    {
      element: '#intro1',
      intro: 'Click Here',
      position: 'bottom'
    },
    {
      element: '#intro2',
      intro: 'With 3D transforms, we can make simple.',
      position: 'top'
    },
    {
      element: '#intro3',
      intro: 'Hover over each title to display a longer description.',
      position: 'right'
    },
    {
      element: '#intro4',
      intro: 'Click the With 3D transforms, we can make simple.',
      position: 'left'
    },
    {
      element: '#intro5',
      intro: "Each demo will link to the previous & next entries.",
      position: 'bottom'
    }
    ]
    });
    introguide.start();
  });



    var loaded = 0;
    var imgCounter = $(".main-content img").length;
    if(imgCounter > 0){
      console.log(imgCounter);
      function doProgress() {
        $(".main-content img").load(function() {
          loaded++;
          var newWidthPercentage = (loaded / imgCounter) * 100;
          animateLoader(newWidthPercentage + '%');      
        })
      } 
      function animateLoader(newWidth) {
        $("#progressBar").width(newWidth);
        if(imgCounter === loaded){
          setTimeout(function(){
                    $("#progressBar").animate({opacity:0});
                },500);
        }
      }
      doProgress();
    }else{
      setTimeout(function(){
          $("#progressBar").css({
            "opacity":0,
            "width":"100%"
          });
      },500);
    }

  }]).

// Google Map Controller
  controller('ProfileCtrl', ['$scope', '$location', function($scope, $location) {

    $(document).scrollTop(0);


    $scope.mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(41.923, 12.513),
    mapTypeId: google.maps.MapTypeId.TERRAIN
    }
    $scope.map = new google.maps.Map(document.getElementById('mapthree'), $scope.mapOptions);

    var loaded = 0;
    var imgCounter = $(".main-content img").length;
    if(imgCounter > 0){
      console.log(imgCounter);
      function doProgress() {
        $(".main-content img").load(function() {
          loaded++;
          var newWidthPercentage = (loaded / imgCounter) * 100;
          animateLoader(newWidthPercentage + '%');      
        })
      } 
      function animateLoader(newWidth) {
        $("#progressBar").width(newWidth);
        if(imgCounter === loaded){
          setTimeout(function(){
                    $("#progressBar").animate({opacity:0});
                },500);
        }
      }
      doProgress();
    }else{
      setTimeout(function(){
          $("#progressBar").css({
            "opacity":0,
            "width":"100%"
          });
      },500);
    }

  }]).

  controller('ImageCtrl', ['$scope', '$location', function($scope, $location) {

    $(document).scrollTop(0);


    var loaded = 0;
    var imgCounter = $(".main-content img").length;
    if(imgCounter > 0){
      console.log(imgCounter);
      function doProgress() {
        $(".main-content img").load(function() {
          loaded++;
          var newWidthPercentage = (loaded / imgCounter) * 100;
          animateLoader(newWidthPercentage + '%');      
        })
      } 
      function animateLoader(newWidth) {
        $("#progressBar").width(newWidth);
        if(imgCounter === loaded){
          setTimeout(function(){
                    $("#progressBar").animate({opacity:0});
                },500);
        }
      }
      doProgress();
    }else{
      setTimeout(function(){
          $("#progressBar").css({
            "opacity":0,
            "width":"100%"
          });
      },500);
    }

  }]).

  // Contact Map Controller
  controller('ContactCtrl', ['$scope', '$location', function($scope, $location) {

    $(document).scrollTop(0);

    $scope.mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(41.923, 12.513),
    mapTypeId: google.maps.MapTypeId.TERRAIN
    }
    $scope.map = new google.maps.Map(document.getElementById('maptwo'), $scope.mapOptions);


    var loaded = 0;
    var imgCounter = $(".main-content img").length;
    if(imgCounter > 0){
      console.log(imgCounter);
      function doProgress() {
        $(".main-content img").load(function() {
          loaded++;
          var newWidthPercentage = (loaded / imgCounter) * 100;
          animateLoader(newWidthPercentage + '%');      
        })
      } 
      function animateLoader(newWidth) {
        $("#progressBar").width(newWidth);
        if(imgCounter === loaded){
          setTimeout(function(){
                    $("#progressBar").animate({opacity:0});
                },500);
        }
      }
      doProgress();
    }else{
      setTimeout(function(){
          $("#progressBar").css({
            "opacity":0,
            "width":"100%"
          });
      },500);
    }

  }]);

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function (/*$scope, $location, $http*/) {

    $(document).scrollTop(0);

      var loaded = 0;
    var imgCounter = $(".main-content img").length;
    if(imgCounter > 0){
      console.log(imgCounter);
      function doProgress() {
        $(".main-content img").load(function() {
          loaded++;
          var newWidthPercentage = (loaded / imgCounter) * 100;
          animateLoader(newWidthPercentage + '%');      
        })
      } 
      function animateLoader(newWidth) {
        $("#progressBar").width(newWidth);
        if(imgCounter === loaded){
          setTimeout(function(){
                    $("#progressBar").animate({opacity:0});
                },500);
        }
      }
      doProgress();
    }else{
      setTimeout(function(){
          $("#progressBar").css({
            "opacity":0,
            "width":"100%"
          });
      },500);
    }

    // Activates Tooltips for Social Links
    $('[data-toggle="tooltip"]').tooltip(); 

    // Activates Popovers for Social Links 
    $('[data-toggle="popover"]').popover(); 

    //*** Refresh Content ***//
      $('.refresh-content').on("click", function(){
        $(this).parent().parent().addClass("loading-wait").delay(3000).queue(function(next){
          $(this).removeClass("loading-wait");
          next();
      });
      $(this).addClass("fa-spin").delay(3000).queue(function(next){
          $(this).removeClass("fa-spin");
          next();
      });
      });

      //*** Expand Content ***//
      $('.expand-content').on("click", function(){
        $(this).parent().parent().toggleClass("expand-this");
      });

      //*** Delete Content ***//
      $('.close-content').on("click", function(){
        $(this).parent().parent().slideUp();
      });

      // Activates Tooltips for Social Links
      $('.tooltip-social').tooltip({
        selector: "a[data-toggle=tooltip]"
      });


});

  