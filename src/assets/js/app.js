$( document ).ready(function() {
  var $form = $('.subscribe-form');
  var $email = $('input[name=EMAIL]');

  //Contact Form
  $("#subscribe-submit").click( function(e) {
    e.preventDefault();
    sentContactForm();
  });

  $(".subscribe-form input").keypress(function(e) {
    if (e.which == 13) {
      e.preventDefault();
      sentContactForm();
    }
  });

  $email.keydown(function() {
    $form.removeClass('red');
  });

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function sentContactForm() {

    //collect input field values
    var user_email       = $email.val();

    //simple validation at client's end
    //we simply change border color to red if empty field using .css()
    var proceed = true;
    if(!validateEmail(user_email)){
      $form.addClass('red');
      proceed = false;
    }

    //everything looks good! proceed...
    if(proceed)
    {
      $email.blur(); // remove glow

      $('.signForm .overlay').fadeIn(300);
      //data to be sent to server
      post_data = {'userEmail':user_email};

      $("#subscribe-submit").val('Sending...').prop('disabled', true);
      //$email.prop('disabled', true);

      //Ajax post data to server
      $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: $form.serialize(),
        cache: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function(data) {
          //load success massage in #result div element, with slide effect.
          $(".result").hide(0).html('<div class="success"><img src="/assets/img/check.svg" alt="Success">Thanks for your interest!</div>').fadeIn(600);
          // console.log(data);

        },
        error: function(xhr, status, error) {  //load any error data
          $(".result").hide(0).html('<div class="error"><img src="/assets/img/fail.svg" alt="Error">Error, please try again later.</div>').fadeIn(600);
          //console.log(error);
        }
      });

      // save to text
      $.ajax({
        url: '/assets/subscribe.php',
        type: 'POST',
        data: post_data,
        success: function(data) {

        },
        error: function(xhr, status, error) {  //load any error data

        }
      });

    }

  }

  // Paypal
  function getValue() {
    var str = $("#amount").val();
    str = str.replace(/[^0-9.,]/g, "");
    var val = parseFloat(str.replace(",", "."));
    return (isNaN(val) || val < 0) ? 0 : val;
  }

  $("#amount").on('change blur keyup', function() {
    var value = getValue().toFixed(2);
    $("#ppamount").val(value);
  });

  $(".pay-form").submit(function(event) {
    var val = getValue();
    var msg = 'Due to PayPal fees, the minimum amount is $0.50. \n' +
    'If you wish to download the file, press OK and you will not be charged. ' +
    'If you want to change the amount, press Cancel.';
    if (val < 0.50) {
      event.preventDefault();
      if (val == 0 || confirm(msg)) {
        window.location = "http://100dayscss.com/download.html";
      }
    }
  });

  // CodePen
  function showThePen(penID) {
    var wrapper = $('#pen_' + penID + ' .codepen'),
        wHeight = wrapper.data('height'),
        themeID = wrapper.data('theme-id'),
        defaultTab = wrapper.data('default-tab'),
        user = wrapper.data('user'),
        url = '//codepen.io/roydigerhund/embed/' + penID + '?height=' + wHeight + '&theme-id=' + themeID + '&slug-hash=' + penID + '&default-tab=' + defaultTab + '&user=' + user;

    if ( $( "#cp_embed_" + penID).length == 0 ) {
      //console.log('load pen ' + penID);
      wrapper.hide(0);
      $('<iframe/>', {
          id: 'cp_embed_' + penID,
          src: url,
          allowTransparency: true,
          allowfullscreen: true,
          scrolling: "no",
          frameborder: 0,
          style: 'width: 100%; overflow: hidden;',
          class: 'cp_embed_iframe'
      }).prop({
          height: wHeight
      }).appendTo('#pen_' + penID + ' .content');
    }
  }

  function hideThePen(penID) {
    if ( $( "#cp_embed_" + penID).length ) {
      //console.log('remove pen ' + penID);
      var wrapper = $('#pen_' + penID + ' .codepen'),
          iframeElement = $('#cp_embed_' + penID);

      iframeElement.remove();
      wrapper.show(0);
    }
  }

  var didScroll = true;

  $(window).scroll(function() {
    didScroll = true;
  });

  setInterval(function() {
    if ( didScroll ) {
        didScroll = false;

        $('.pen').each( function() {
         var pen = $(this),
             penID = pen.attr('id').slice(4),
              top_of_element = pen.offset().top,
              bottom_of_element = pen.offset().top + pen.height(),
              viewport_height = $(window).height(),
              bottom_of_screen = $(window).scrollTop() + viewport_height;
              scrollOffset = 100;

          if( ( (bottom_of_screen + scrollOffset) > top_of_element) &&
              ( (bottom_of_screen - viewport_height - scrollOffset) < bottom_of_element) ) {
            showThePen(penID);
          }
          else {
            hideThePen(penID);
          }
       });


    }
  }, 100);


});
