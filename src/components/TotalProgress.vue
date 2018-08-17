<template>
  <gauge
    ref="totalProgress"
    width="30%"
    height="20%"
    top="80%"
    left="70%"
    fill="white"
    label="Total Progress"
    :border="{type: 'line', fg: 'cyan'}"
    />
</template>

<script>
  export default {
    name: 'Status',
    props: ['cells'],
    computed: {
      percentage() {
        var total = this.cells.filter(cell => cell.enabled);
        var remaining = this.cells.filter((cell) => {
          return (cell.status === 'ready') && (cell.enabled === true);
        });
        return 100 - Number(remaining.length / total.length) * 100;
      }
    },
    watch: {
      percentage() {
        this.$refs.totalProgress.setPercent(this.percentage);
      }
    }
  }
</script>