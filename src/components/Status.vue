<template>
  <box
    width="30%"
    height="50%"
    top="50%"
    left="70%"
    :content="status_text"
    fg="white"
    label="Status indicator"
    :border="{type: 'line', fg: 'cyan'}"
    />
</template>

<script>
  const moment = require('moment');

  export default {
    name: 'Status',
    props: [
      'input_file',
      'queued_items',
      'source',
      'output',
      'rendering',
      'progress',
      'ready_to_render'
      ],
    computed: {
      average_fps() {
        var sum = 0;
        for( var i = 0; i < this.progress.fps_history.length; i++ ){
            sum += parseInt( this.progress.fps_history[i], 10 );
        }

        return sum/this.progress.fps_history.length;
      },
      current_file_time_remaining() {
        var frames_remaining = this.source.frames - this.progress.frames;
        return frames_remaining / this.average_fps;
      },
      total_time_remaining() {
        var total_number_of_frames = this.source.frames * this.queued_items.length;
        var current_file_frames_remaining = this.source.frames - this.progress.frames;
        return (total_number_of_frames - current_file_frames_remaining) / this.average_fps;
      },
      status_text() {
        var status_text = `Selected file: ${this.input_file}\n`;
        status_text += `Source width: ${this.source.width}px\n`;
        status_text += `Source height: ${this.source.height}px\n`;
        status_text += `Source frames: ${this.source.frames}\n`;
        status_text += `Source codec: ${this.source.codec}\n`;
        status_text += `Output width: ${this.output.width}\n`;
        status_text += `Output height: ${this.output.height}\n`;
        status_text += `Output codec: ${this.output.codec}\n`;
        status_text += `Output bitrate: ${this.output.bitrate}\n`;
        status_text += `Number of files: ${this.queued_items.length}\n`;
        status_text += `Ready to render: ${this.ready_to_render}\n`;
        status_text += `Current file: ${Number(this.progress.percentage).toFixed(1)}%\n`;
        status_text += `Current fps: ${Number(this.progress.fps).toFixed(1)}fps\n`;
        status_text += `Average fps: ${this.average_fps.toFixed(2)}fps\n`;
        status_text += `Current file seconds remaining: ${this.current_file_time_remaining}s\n`;
        status_text += `Total seconds remaining: ${this.total_time_remaining}s\n`;
        status_text += `Current file time remaining: ${moment.duration(this.current_file_time_remaining, 'seconds').humanize()}\n`;
        status_text += `Total time remaining: ${moment.duration(this.total_time_remaining, 'seconds').humanize()}\n`;
        return status_text;
      }
    }
  }
</script>