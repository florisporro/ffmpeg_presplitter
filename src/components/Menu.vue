<template>
  <list
    keys="true"
    ref="menu"
    content=""
    label="Action Menu"
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
  const menu = [
    {
      name: "Select input file",
      event: 'change_input_file'
    },
    {
      name: "Change screen resolution",
      event: 'change_setting',
      param: 'resolution'
    },
    {
      name: "Change output codec",
      event: 'change_setting',
      param: 'codec'
    },
    {
      name: "Change output bitrate",
      event: 'change_setting',
      param: 'bitrate'
    },
    {
      name: "Start queue",
      event: 'start_queue'
    },
    {
      name: "Stop queue",
      event: 'stop_queue'
    }
  ];

  import { EventBus } from '../EventBus.js';

  export default {
    name: 'Menu',
    data() {
      return {
        // menu_items: ["Select input file", "Select output folder", "Change screen resolution", "Start Render", "Help"]
      }
    },
    mounted() {
      this.$refs.menu.setItems(menu.map(element => element.name));

      this.$refs.menu.on('select', (element, index) => {
        EventBus.$emit(menu[index].event, menu[index].param || null);
      });

      this.$refs.menu.focus();
    }
  }
</script>