var util = require('util');
var exec = require('child_process').exec;
var Promise = require('promise');

var PKCS7_CONTENT_REGEX = /Content-Disposition:[^\n]+\s*?([A-Za-z0-9+=/\r\n]+)\s*?-----/;

// Expose methods.
exports.sign = sign;

/**
 * Sign a file.
 *
 * @param {object} options Options
 * @param {stream.Readable} content Content stream
 * @param {string} key Key path
 * @param {string} cert Cert path
 * @param {function} [cb] Optional callback
 * @returns {object} result Result
 * @returns {string} result.pem Pem signature
 * @returns {string} result.der Der signature
 * @returns {string} result.stdout Strict stdout
 * @returns {string} result.stderr Strict stderr
 * @returns {ChildProcess} result.child Child process
 */

function sign(options, cb) {
  return new Promise(function (resolve, reject) {
    options = options || {};

    if (!options.content)
      throw new Error('Invalid content.');

    if (!options.key)
      throw new Error('Invalid key.');

    if (!options.cert)
      throw new Error('Invalid certificate.');

    var command = util.format(
      'openssl smime -sign -text -signer %s -inkey %s',
      options.cert,
      options.key
    );

    var child = exec(command, function (err, stdout, stderr) {
      if (err) return reject(err);

      resolve({
        child: child,
        stdout: stdout,
        stderr: stderr,
        pem: stdout,
        der: parseDer(stdout)
      });
    });

    options.content.pipe(child.stdin);
  })
  .nodeify(cb);
}

/**
 * Parse DER from PEM.
 */

function parseDer(pem) {
  var content = PKCS7_CONTENT_REGEX.exec(pem);

  if (!content)
    throw new Error('Can\'t extract der content');

  return content[1].replace(/\n/g, '');
}
