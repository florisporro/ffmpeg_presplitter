<template>
  <list
    keys="true"
    ref="setting_switcher"
    content=""
    label="Change setting"
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
  const settings = require('../settings.js');

  import { EventBus } from '../EventBus.js';

  export default {
    name: 'Setting Switcher',
    props: ['changingSetting'],
    mounted() {    
      this.$refs.setting_switcher.setItems(settings[this.changingSetting]);

      this.$refs.setting_switcher.on('select', (element, index) => {
        EventBus.$emit('setting_changed', element.content);
      });

      this.$refs.setting_switcher.focus();
    }
  }
</script>