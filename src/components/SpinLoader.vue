<template>
  <div v-show="show" class="spin_loader">
    <ProgressSpinner class="m-auto" />
  </div>
</template>

<script>
export default
{
  name: 'SpinLoader',
  props:
    {
      show:
        {
          type: Boolean,
          default: false
        }
    }
};
</script>

<style lang="scss">
.spin_loader
{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  z-index: 10;
  background-color: rgb(80 90 100 / 80%);
}
</style>
