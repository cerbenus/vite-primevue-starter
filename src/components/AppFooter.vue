<template>
  <footer class="px-3 py-1">
    <span class="font-medium">Vite PrimeVue Starter - {{ version }}</span>
  </footer>
</template>

<script>
export default
{
  name: 'AppFooter',
  computed:
    {
      version()
      {
        return import.meta.env.VITE_APP_VERSION;
      },
    },
};
</script>

<style lang="scss">
footer
{
  background-color: var(--surface-card);
}
</style>
