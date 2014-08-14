angular.module('ballonide', [])

  .directive('changeAspect', [function() {
    return {
      link: function(scope, element, attrs) {
        element.bind('click', function(e) {
          console.log("changeAspect Directive:");
          console.log(e);
          var span = $(element.find('span')[0]);
          if (span.hasClass('glyphicon-plus-sign')) {
            span.removeClass('glyphicon-plus-sign');
            span.addClass('glyphicon-minus-sign');
          } else {
            span.removeClass('glyphicon-minus-sign');
            span.addClass('glyphicon-plus-sign');
          }

          e.stopPropagation();

          console.log(span);
        });
      }
    };
  }]);