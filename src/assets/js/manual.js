$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();
  // $('[data-toggle="tab"]').tab();
});
/* smooth scroll starts here */
$(document).ready(function() {
  $('.hashscroll').click(function() {
    if (
      location.pathname.replace(/^\//, '') ==
        this.pathname.replace(/^\//, '') &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate(
          {
            scrollTop: target.offset().top - 0
          },
          1000
        );
        return false;
      }
    }
  });
});
/* smooth scroll starts here */

$(document).on('click', '.shrink_icon', function(event) {
  event.preventDefault();
  $("body").toggleClass('bodyshrink');
});


// slider js start here

// $(document).ready(function() {
//   var owl = $('.owl-carousel');
//   owl.owlCarousel({
//     items: 3,
//     loop: true,
//     autoWidth:true,
//     nav: true,
//     navText: [
//       "<i class='fa fa-angle-left'></i>",
//       "<i class='fa fa-angle-right'></i>"
//     ],
//     margin: 10,
//     autoplay: false,
//     autoplayTimeout: 2000,
//     autoplayHoverPause: true,
//     responsive: {
//       0: {
//         items: 1
//       },
//       415: {
//         items: 1
//       },
//       575: {
//         items: 2
//       },
//       768: {
//         items: 8
//       }
//     }
//   });
// });



//  $('.slider-single').slick({
//   slidesToShow: 1,
//   slidesToScroll: 1,
//   arrows: true,
//   fade: false,
//   adaptiveHeight: true,
//   infinite: false,
//   useTransform: true,
//   speed: 400,
//   cssEase: 'cubic-bezier(0.77, 0, 0.18, 1)',
//  });

//  $('.slider-nav')
//   .on('init', function(event, slick) {
//     $('.slider-nav .slick-slide.slick-current').addClass('is-active');
//   })
//   .slick({
//     slidesToShow: 4,
//     slidesToScroll: 4,
//     dots: false,
//     focusOnSelect: false,
//     infinite: false,
//     responsive: [{
//       breakpoint: 1024,
//       settings: {
//         slidesToShow: 5,
//         slidesToScroll: 5,
//       }
//     }, {
//       breakpoint: 640,
//       settings: {
//         slidesToShow: 4,
//         slidesToScroll: 4,
//       }
//     }, {
//       breakpoint: 420,
//       settings: {
//         slidesToShow: 3,
//         slidesToScroll: 3,
//     }
//     }]
//   });

//  $('.slider-single').on('afterChange', function(event, slick, currentSlide) {
//   $('.slider-nav').slick('slickGoTo', currentSlide);
//   var currrentNavSlideElem = '.slider-nav .slick-slide[data-slick-index="' + currentSlide + '"]';
//   $('.slider-nav .slick-slide.is-active').removeClass('is-active');
//   $(currrentNavSlideElem).addClass('is-active');
//  });

//  $('.slider-nav').on('click', '.slick-slide', function(event) {
//   event.preventDefault();
//   var goToSingleSlide = $(this).data('slick-index');

//   $('.slider-single').slick('slickGoTo', goToSingleSlide);
//  });


// slider js end here