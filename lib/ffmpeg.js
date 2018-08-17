var EventEmitter = require('events');
var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
var fs = require('fs-extra');
var path = require('path');

function ffmpeg_bitrate(bitrate) {
  if (bitrate.includes("mbps")) {
    return Number(bitrate.split('mbps')[0])+'M';
  } else if (bitrate.includes("kbps")) {
    return Number(bitrate.split('kbps')[0])+'k';
  }
}

exports.events = new EventEmitter();

exports.render_file = function(settings) {

  fs.ensureDirSync(path.parse(settings.output_file).dir);

  var command = ffmpeg()
    .input(settings.input_file)
    .videoFilters(`crop=${settings.width}:${settings.height}:${settings.x}:${settings.y}`)
    .output(settings.output_file)

  switch(settings.codec) {
    case 'ProRes':
      command
        .videoCodec('prores')
        .outputOptions(['-profile:v 1'])
        .audioCodec('pcm_s16le')
      break;
    case 'H264':
      command
        .videoCodec('libx264')
        .videoBitrate(ffmpeg_bitrate(settings.bitrate), true)
      break;
    case 'H265':
      command
        .videoCodec('libx265')
        .videoBitrate(ffmpeg_bitrate(settings.bitrate), true)
      break;
  }

  command.on('error', error => exports.events.emit('error', error));
  command.on('progress', progress => exports.events.emit('progress', progress));
  command.on('end', () => exports.events.emit('end'));

  command.run();
}

exports.read_file = function(file_path) {
  return new Promise(((resolve, reject) => {
    ffmpeg.ffprobe(file_path, function(err, metadata) {
      if (err) reject(err);
      resolve(metadata);
    });
  }))
}

module.exports = exports;