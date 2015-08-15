$(document).ready(function() {
  $('.auth-nav').hover(
    function () {
      $('ul', this).stop().fadeIn(200);
    },
    function () {
      $('ul', this).stop().fadeOut(100);
    }
  );
  $('.tooltip').tooltipster();
});

$('.shots-container').masonry({
  itemSelector: '.shot-card-wrapper',
  gutter: 30
});

(function() {
  $.ajax({
      type: 'GET',
      url: '/filter',
      success: function(data) {
        for(var i = 0; i < data.length; i++) {
          for(var j = 1; j < data[i].length; j++) {
            if(data[i][j]._id != 'Not Present') {
              $('.filter-' + data[i][0].type).append('<li><a href="/shots?filter=' + data[i][0].type + '&q=' + encodeURIComponent(data[i][j]._id) + '">'+ data[i][j]._id +'<span class="count">' + data[i][j].count + '</span></a></li>');
            }
          }
        }
      }
  });
})();

$(document).ajaxComplete(function() {
  var url = location.pathname + location.search;
  $('.filter a[href="'+url+'"]').addClass('active');
});
