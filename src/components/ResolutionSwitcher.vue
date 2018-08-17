<template>
  <list
    keys="true"
    ref="resolution_switcher"
    content=""
    label="Select cropped file resolution"
    style="
        focus.border.fg: white;
        item.hover.bg: blue;
        item.hover.fg: white;
        selected.bg: blue;
        selected.fg: white;
        selected.bold: true
      "
    :border="{type: 'line', fg: 'cyan'}"
    />
    
</template>

<script>
  const resolutions = [
    '4096x2160',
    '3840x2160',
    '3440x1440',
    '2560x1080',
    '2048x1080',
    '1920x1200',
    '1920x1080',
    '1920x800',
    '1400x1050',
    '1440x960',
    '1440x900',
    '1366X768',
    '1280x1024',
    '1280x854',
    '1280x768',
    '1280x720',
    '800x600',
    '720x576',
    '720x480'
  ];

  import { EventBus } from '../EventBus.js';

  export default {
    name: 'Resolution Switcher',
    mounted() {
      this.$refs.resolution_switcher.setItems(resolutions);

      this.$refs.resolution_switcher.on('select', (element, index) => {
        EventBus.$emit('resolution_changed', {
          width: element.content.split('x')[0],
          height: element.content.split('x')[1]
        });
      });

      this.$refs.resolution_switcher.focus();
    }
  }
</script>