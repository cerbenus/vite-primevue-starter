<template>
  <router-view />
</template>

<script>
export default
{
  name: 'App',
  methods:
  {
    updateTheme(themeName, themeColor)
    {
      const newValue = '/themes/' + themeName + '-' + themeColor + '/theme.css';
      const relElements = Array.prototype.slice.call(document.getElementsByTagName('link'));
      relElements.forEach((element) =>
      {
        if (element.getAttribute('href') && element.getAttribute('href').indexOf('/themes/') > -1)
        {
          element.setAttribute('href', newValue);
        }
      });
    }
  }
};
</script>

<style lang='scss' src="./App.scss"></style>
