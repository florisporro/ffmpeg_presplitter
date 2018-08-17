<template> 
  <box
    width="100%"
    ref="grid"
    height="50%"
    top="0"
    left="0"
    label="Presplit action grid"
    :content="msg"
    :border="{type: 'line', fg: 'cyan'}"
    style="
      focus.border.fg: white;
      item.hover.bg: blue;
      item.hover.fg: white;
      selected.bg: blue;
      selected.bold: true
    ">
    <Cell
      v-for="(cell, index) in grid.cells"
      :selected_x="selected_x"
      :selected_y="selected_y"
      :cell="cell" 
      :index="index"
      :key="cell.id"/>
  </box>
</template>

<script>
  import Cell from './Cell.vue'

  import { EventBus } from '../EventBus.js';

  export default {
    name: 'Grid',
    components: {
      Cell
    },
    props: ['grid'],
    data() {
      return {
        selected_x: 0,
        selected_y: 0
      }
    },
    computed: {
      msg() {
        if (this.grid.cells.length === 0) {
          return "No grid";
        } else {
          return "";
        }
      }
    },
    mounted() {
      this.$refs.grid.focus();
      this.$refs.grid.key(['up'], () => {
        // Decrease the row by 1 unless 1
        if (this.selected_y > 0) this.selected_y--;
      });
      this.$refs.grid.key(['right'], () => {
        // Increase the column by 1 unless max
        if (this.selected_x < this.grid.cols-1) this.selected_x++;
      });
      this.$refs.grid.key(['down'], () => {
        if (this.selected_y < this.grid.rows-1) this.selected_y++;
      });
      this.$refs.grid.key(['left'], () => {
        // Decrease the column by 1 unless 1
        if (this.selected_x > 0) this.selected_x--;
      });

      // Enable or disable individual cells
      this.$refs.grid.key(['space'], () => {
        EventBus.$emit('toggle-cell', {x: this.selected_x, y: this.selected_y});
      });
    }
  }
</script>