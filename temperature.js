(function (window, document, undefined) {
  window.temperature = {

  };

  window.temperature.watch = function (el) {
    var clicks = [];

    el.addEventListener('click', function (ev) {
      var hash = {},
          target = ev.target;

      hash.target = target;
      hash.relPosX = (ev.x - target.offsetLeft) * 100 / target.offsetWidth;
      hash.relPosY = (ev.y - target.offsetTop) * 100 / target.offsetHeight;

      clicks.push(hash);
    });

    return clicks;
  };
})(window, document);
