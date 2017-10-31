$(function() {
  
/* 
SwitchAnimation
==================
Add touch capacity to switch
all over the app.
*/
var switchAnimation = function() {

  /* Save variable for later use ('out of event use') */
  var originalPosition;
  var dragStart = false;
  var dragDirection;

  /* 
		Use to generate event, jQuery doesn't trigger
		a change event if it's the input state (checked)
		is changed programmatically. We also avoid triggering
		an event if the element is already in the expected state.
  */
  function switchCheckbox(el, checked) {
    if (el.prop("checked") !== checked) {
      el.prop("checked", checked).trigger("change");
    }
  }

  function handleTouchEvent(ev) {
    ev.gesture.preventDefault();

    /* Save Switch selector*/
    var $el = $(ev.currentTarget);
    var $checkbox = $el.find(".switch-ui-checkbox");
    if ($checkbox.prop('disabled')) return;

    var $round = $el.find(".switch-ui-switch");
    var $inner = $el.find(".switch-ui-inner");

    /* Create drag limit variable */
    var borderWidth = parseInt($round.css('top'));
    var roundMaxPosition = ($el.width() - $round.width() - borderWidth);
    var roundMinPosition = borderWidth;
    var innerOffset = -$el.width();


    switch (ev.type) {

      /* Remove css animation when dragged (cause weird behavior) */
      case 'dragstart':
        $el.removeClass("animate");
        break;

      /* Save switch position on touch (use to calcul drag position) */
      case 'touch':
        originalPosition = parseInt($round.css('left'), 10);
        break;

      /* Pretty obvious nope? */
      case 'swipe':
        switchCheckbox($checkbox, (ev.gesture.direction == "right") ? true : false);
        break;


      /* Tap event, also pretty obvious */
      case 'tap':
        switchCheckbox($checkbox, (($checkbox.prop("checked")) ? false : true));
        break;


      /* Drag event */
      case 'dragright':
      case 'dragleft':

        /* Update drag information (used for release) */
        dragStart = true;
        dragDirection = ev.gesture.direction;

        /* Calculate & apply left position for the switch  */
        var position = Math.max(Math.min((originalPosition + ev.gesture.deltaX), roundMaxPosition), roundMinPosition);
        $round.css('left', position);

        /* Calculate & apply (negative) margin for the switch inner background (on/off)  */
        position = position == borderWidth ? 0 : position;
        var percent = position / roundMaxPosition * 100;
        var innerMargin = (innerOffset - innerOffset / 100 * percent);
        $inner.css("margin-left", innerMargin);
        break;


        /* Release event */
      case 'release':

        /* Reset css style */
        $round.css("left", "");
        $inner.css("margin-left", "");

        /* Get movement distance & check if direction is correct/possible */
        var distance = Math.max(Math.min((Math.abs(ev.gesture.deltaX)), roundMaxPosition), roundMinPosition);
        var directionRight = ev.gesture.deltaX > 0 && dragDirection == "right" && !$checkbox.prop("checked");
        var directionLeft = ev.gesture.deltaX < 0 && dragDirection == "left" && $checkbox.prop("checked");

        /* If was dragged & distance is long enough & direciton are correct, switch that mofo! */
        if (dragStart && (distance > roundMaxPosition / 2) && (directionLeft || directionRight)) {
          switchCheckbox($checkbox, (($checkbox.prop("checked")) ? false : true));
        }

        /* Add back the animate class & reset dragStart variable */
        $el.addClass("animate");
        dragStart = false;
        break;
    }
  }

  $('body').hammer().on("swipe release dragstart dragleft dragright tap touch", ".switch-ui", handleTouchEvent);

};


switchAnimation();


});