<template>
  <screen ref='screen' :smartCSR="true" :keys="true">
    <Grid :grid="grid" />
    <Log />
    <component :is="activeControl"
      ref="activeControl"
      :changingSetting="changingSetting"
      width="30%"
      height="50%"
      top="50%"
      left="40%"
     />
    <Status
      :input_file="input_file"
      :queued_items="queued_items"
      :source="source"
      :output="output"
      :progress="progress"
      :ready_to_render="ready_to_render" />
    <!-- <TotalProgress :cells="grid.cells" /> -->
  </screen>
</template>

<script>
  const grid = require('../lib/grid.js');
  const renderer = require('../lib/ffmpeg');
  const queue_manager = require('../lib/queue_manager');

  import { EventBus } from './EventBus.js';
  
  // Components
  import Grid from './components/Grid.vue'
  import Status from './components/Status.vue'
  import Menu from './components/Menu.vue'
  import FileBrowser from './components/FileBrowser.vue'
  import Log from './components/Log.vue'
  import SettingSwitcher from './components/SettingSwitcher.vue'
  import TotalProgress from './components/TotalProgress.vue'

  export default {
    data() {
      return {
        activeControl: 'Menu',
        changingSetting: '',
        input_file: '',
        source: {
          width: 0,
          height: 0,
          codec: '',
          frames: 0
        },
        output: {
          width: 1280,
          height: 720,
          resolution: '1280x720',
          codec: 'ProRes',
          bitrate: '20mbps',
          columnnames: 'Columns as letters'
        },
        progress: {
          fps: 0,
          frames: 0,
          fps_history: [],
          percentage: 0.00,
        },
        grid
      }
    },
    components: {
      Grid,
      Status,
      Menu,
      FileBrowser,
      SettingSwitcher,
      TotalProgress,
      Log
    },
    watch: {
      'output.resolution': function() {
        this.output.width = this.output.resolution.split('x')[0];
        this.output.height = this.output.resolution.split('x')[1];
        this.setup_grid();
      },
      ready_to_render() {
        this.setup_grid();
        queue_manager.setup_queue(this.render_settings);
      }
    },
    methods: {
      setup_grid() {
        try {
          if (this.ready_to_render) {
            EventBus.$emit('log', `Setting up grid with params: ${this.source.width}, ${this.source.height}, ${this.output.width}, ${this.output.height}`);
            grid.setup(this.source.width, this.source.height, this.output.width, this.output.height, this.output.columnnames);
          }
        } catch(e) {
          EventBus.$emit('log', "Grid error: " + e);
        }
      }
    },
    computed: {
      render_settings() {
        return {
          input_file: this.input_file,
          source: this.source,
          output: this.output
        }
      },
      ready_to_render() {
        if (this.source.width === 0) return false;
        if (this.output.width === 0) return false;
        if (this.output.codec === '') return false;
        if (this.output.bitrate === '') return false;
        return true;
      },
      queued_items() {
        return grid.cells.filter((cell) => {
          return (cell.status === 'ready') && (cell.enabled === true);
        });
      }
    },
    mounted () {
      EventBus.$on('toggle-cell', cell => {
        grid.cell_by_coords(cell.x, cell.y).enabled = !grid.cell_by_coords(cell.x, cell.y).enabled;
      });

      // CHANGE OUTPUT SETTING
      EventBus.$on('change_setting', (setting) => {
        this.activeControl = 'SettingSwitcher';
        this.changingSetting = setting;
      });

      EventBus.$on('setting_changed', (setting) => {
        this.activeControl = 'Menu';
        this.output[this.changingSetting] = setting;
        this.setup_grid();
        EventBus.$emit('log', "Setting " + this.changingSetting + " changed to " + setting);
      });

      // CHANGE INPUT FILE
      EventBus.$on('change_input_file', () => {
        this.activeControl = 'FileBrowser';
      });
      
      EventBus.$on('input_file_changed', (file) => {
        EventBus.$emit('log', 'File selected, scanning now...');
        this.input_file = file;
        this.activeControl = 'Menu';

        renderer.read_file(this.input_file).then((metadata) => {
          this.source.width = metadata.streams[0].width;
          this.source.height = metadata.streams[0].height;
          this.source.codec = metadata.streams[0].codec_long_name;
          this.source.frames = metadata.streams[0].nb_frames;

          EventBus.$emit('log', "File read succesfully");
          this.setup_grid();
        }).catch((err) => {
          EventBus.$emit('log', `Error reading file! ${err}`);
        });
      });
      
      // SWITCH FOCUS
      this.$refs.screen.key(['tab'], (ch, key) => {
        this.$refs.screen.focusNext();
        this.$refs.screen.render();
      });

      this.$refs.screen.key(['C-c'], () => {
        process.exit(0)
      });

      // START QUEUE
      EventBus.$on('start_queue', () => {
        queue_manager.start();
      });

      queue_manager.events.on('log', log => EventBus.$emit('log', log));

      // STOP QUEUE
      EventBus.$on('stop_queue', () => {
        queue_manager.stop();
      });

      queue_manager.events.on('progress', (progress) => {
        this.progress.fps_history.push(progress.currentFps)
        this.progress.fps = progress.currentFps;
        this.progress.frames = progress.frames;
        this.progress.percentage = progress.percent;
      });
    }
  }
</script>
