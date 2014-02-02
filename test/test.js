var jsdom = require('jsdom'),
    assert = require('assert'),
    fs = require('fs'),
    Q = require('kew');

function logJsDomErrors(done) {
  return function (errors) {
    errors.forEach(function (err) {
      console.error(err.message, err.data.error);
    });
    done('Got ' + errors.length + ' error(s).');
  }
}

describe('temperature', function () {

  it('counts clicks', function (done) {
    var html = '<html><body><button>Click Me.</button></body></html>';

    Q
      .nfcall(jsdom.env, html, [ '../temperature.js' ])
      .then(function (window) {
        window.console = console;
        var body = window.document.body,
            clicks = window.temperature.watch(body),
            btn = window.document.querySelector('button'),
            clickEv = window.document.createEvent('MouseEvents');

        clickEv.initEvent('click', true, true);
        btn.dispatchEvent(clickEv);

        assert.equal(clicks.length, 1);
      }, logJsDomErrors(done))
      .then(function () {
        done();
      }, function (error) {
        done(error);
      });
  });


  it('stores click coordinates in percent', function (done) {
    var html = '<html><body><button>Click Me.</button></body></html>';

    Q
      .nfcall(jsdom.env, html, [ '../temperature.js' ])
      .then(function (window) {
        var document = window.document,
            btn = document.querySelector('button'),
            body = document.body,
            clickEv = window.document.createEvent('MouseEvents'),
            clicks = window.temperature.watch(body),
            click;

        btn.offsetTop = 100;
        btn.offsetLeft = 100;
        btn.offsetWidth = 200;
        btn.offsetHeight = 150;

        clickEv.initEvent('click', true, true);
        clickEv.x = 200;
        clickEv.y = 175;

        btn.dispatchEvent(clickEv);

        click = clicks[0];

        assert.equal(50, click.relPosX);
        assert.equal(50, click.relPosY);
      }, logJsDomErrors(done))
      .then(function () {
        done();
      }, function (error) {
        done(error);
      });
  });

});
