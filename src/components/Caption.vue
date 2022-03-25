<template lang="pug">
.caption
  slot
</template>

<style lang="scss" scoped>
.caption {
  position: relative;
  padding-left: 1em;
  font-size: 1.4rem;
  line-height: 1.7143;
  text-align: justify;
  letter-spacing: 0.05em;

  &::before {
    position: absolute;
    left: 0;
    content: '※';
  }

  a {
    color: $base;
  }
}
</style>
