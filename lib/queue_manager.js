const ffmpeg = require('./ffmpeg');
const EventEmitter = require('events');
const grid = require('./grid');
const path = require('path');
const fs = require('fs-extra');

let render_settings;

exports.rendering = false;

function log(log) {
  exports.events.emit('log', log);
}

function output_file(cell, filename) {
  var filepath = path.parse(filename);

  var file = filepath.dir + `/${filepath.name}/`;
  file += cell.title + "_";
  file += filepath.name;
  
  switch(render_settings.output.codec) {
    case 'ProRes':
      file += ".mov";
      break;
      case 'H264':
      file += ".mp4";
      break;
      case 'H265':
      file += ".mp4";
      break;
  }
  return file;
}

function remaining_cells() {
  return grid.cells.filter((cell) => {
    return (cell.status === 'ready') && (cell.enabled === true);
  });
}

function next_in_queue() {
  var next_cell = remaining_cells()[0];
  next_cell.status = 'rendering';
  return next_cell;
};

function render() {
  if((remaining_cells().length > 0) && (exports.rendering === true)) {
    var cell = next_in_queue();
    log("Rendering " + output_file(cell, render_settings.input_file) + " with crop settings " + grid.crop_dimensions(cell).x + ":" + grid.crop_dimensions(cell).y);
    
    // Normally trigger this with a callback

    var coords = grid.crop_dimensions(cell);

    if (fs.existsSync(output_file(cell, render_settings.input_file))) {
      cell.status = 'done';
      log("Skipping existing file " + render_settings.input_file);
      render();
    } else {
      // exports.events.emit('progress', progress)
      ffmpeg.render_file({
        width: render_settings.output.width,
        height: render_settings.output.height,
        x: coords.x,
        y: coords.y,
        input_file: render_settings.input_file,
        output_file: output_file(cell, render_settings.input_file)
      });
      ffmpeg.events.on('error', function(err) {
        cell.status = 'error';
        exports.rendering = false;
        log("Error occured rendering: " + err.message);
      });
      ffmpeg.events.on('progress', (progress) => {exports.events.emit('progress', progress)});

      ffmpeg.events.once('end', () => {
        ffmpeg.events.removeAllListeners();
        cell.status = 'done';
        log("Done");
        render();
      });
    }
  } else {
    exports.rendering = false;
  }
}

exports.setup_queue = function(settings) {
  render_settings = settings;
}

exports.start = function() {
  exports.rendering = true;
  render();
}

exports.stop = function() {
  exports.rendering = false;
  log("Finishing renders then stopping")
}

exports.events = new EventEmitter();

module.exports = exports;
