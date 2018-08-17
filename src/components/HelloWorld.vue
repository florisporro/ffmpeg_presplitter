<template>
  <lcd segmentWidth="0.06" segmentInterval="0.11"
    strokeWidth="0.11"
    elements="8"
    :display="counter"
    elementSpacing="4"
    elementPadding="2"
    width="100%"
    height="25%"
    top="center"
    left="center"
    color="white"
    :border="{ type: 'line' }"
    :style="{ border: { fg: 'green' } }"
    label="Time" />
</template>

<script>
  export default {
    name: 'HelloWorld',
    data: () => {
      return {
        counter: 0
      }
    },
    mounted () {
      setInterval(() => {
        this.counter++;
      }, 1000)
    }
  }
</script>