<template>
  <filemanager
    keys="true"
    ref="browser"
    label="File Browser"
    cwd="/"
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
  import { EventBus } from '../EventBus.js';

  export default {
    name: 'FileBrowser',
    data() {
      return {
      }
    },
    mounted() {
      this.$refs.browser.refresh();
      this.$refs.browser.on('file', (file) => {
        EventBus.$emit('input_file_changed', file);
      });
      this.$refs.browser.focus();
    }
  }
</script>