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
 * @param {stream.Readable} options.content Content stream
 * @param {string} options.key Key path
 * @param {string} options.cert Cert path
 * @param {string} [options.password] Key password
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
      'openssl smime -sign -text -signer %s -inkey %s -outform DER -binary',
      options.cert,
      options.key
    );

    if (options.password)
      command += util.format(' -passin pass:%s', options.password);

    var child = exec(command, function (err, stdout, stderr) {
      if (err) return reject(err);

      resolve({
        child: child,
        stdout: stdout,
        stderr: stderr,
        der: Buffer.concat(der)
      });
    });

    var der = [];

    child.stdout.on('data', function (chunk) {
      der.push(chunk);
    });

    options.content.pipe(child.stdin);
  })
  .nodeify(cb);
}
