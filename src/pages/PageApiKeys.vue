<template>
  <div class="flex p-2">
    <form ref="frm" class="m-auto" @submit.prevent="submitForm">
      <Card style="width: 350px; max-width: 90vw;">
        <template #content>
          <div class="flex flex-column">
            <label for="google">Google Translation API key</label>
            <InputText id="google" v-model.trim="apiKeys.googleTranslationApiKey" />

            <label for="scraping" class="mt-3">Scraping Bee API key</label>
            <InputText id="scraping" v-model.trim="apiKeys.scrapingBeeApiKey" />
          </div>
        </template>
        <template #footer>
          <div class="flex">
            <Button type="submit" label="Save" class="mx-auto" />
          </div>
        </template>
      </Card>
    </form>
  </div>
</template>

<script>
import ajax from 'src/ajax';

export default
{
  name: 'PageApiKeys',
  data()
  {
    return {
      apiKeys:
        {
          googleTranslationApiKey: '',
          scrapingBeeApiKey: '',
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
        ajax.get('/account/api-keys').then(response =>
        {
          if (response)
          {
            this.apiKeys = response;
          }
        });
      },
      submitForm()
      {
        ajax.post('/account/api-keys', this.apiKeys);
      },
    },
};
</script>
