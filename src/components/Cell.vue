<template>
  <box
    :width="6"
    :height="2"
    :left="cell.column*7"
    :top="cell.row*3"
    align="center"
    :content="cell.title"
    clickable="true"
    :style="objectStyle"
    />
</template>

<script>
  export default {
    name: 'Cell',
    props: ['cell', 'selected_x', 'selected_y'],
    computed: {
      objectStyle () {
        return {
          bg: this.color,
          fg: 'black',
        }
      },
      color() {
        if ((this.selected_x === this.cell.column) && (this.selected_y === this.cell.row)) return 'white';
        if (this.cell.status === 'rendering') return 15;
        if (this.cell.status === 'done') return 10;
        if (this.cell.status === 'error') return 1;
        if (this.cell.enabled) return 4;
        if (!this.cell.enabled) return 8;
        return 'red';
      }
    }
  }
</script>