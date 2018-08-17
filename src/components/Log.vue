<template>
  <log
    width="40%"
    height="50%"
    ref="log"
    top="50%"
    left="0"
    :blessed="true"
    style="
        focus.border.fg: white;
        item.hover.bg: blue;
        item.hover.fg: white;
        selected.bg: blue;
        selected.fg: white;
        selected.bold: true
      "
    label="Log"
    :border="{type: 'line', fg: 'cyan'}"
    />
</template>

<script>
  import { EventBus } from '../EventBus.js';

  export default {
    name: 'Log',
    mounted() {
      EventBus.$on('log', (log) => {
        this.$refs.log.log(log);
      });
    }
  }
</script>