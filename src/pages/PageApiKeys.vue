<template>
  <div>
    <form ref="frm" @submit.prevent="submitForm">
      <label for="google">Google Translation API key</label>
      <InputText id="google" v-model.trim="apiKeys.googleTranslation" />
      <label for="scraping">Scraping Bee API key</label>
      <InputText id="scraping" v-model.trim="apiKeys.scrapingBee" />
    </form>
  </div>
</template>

<script>
export default
{
  name: 'PageApiKeys',
  data()
  {
    return {
      apiKeys:
        {
          googleTranslation: '',
          scrapingBee: '',
        },
    };
  },
  created()
  {
    this.fetchData();
  },
  methods:
    {
      fetchData()
      {

      },
      submitForm()
      {

      },
    },
};
</script>
