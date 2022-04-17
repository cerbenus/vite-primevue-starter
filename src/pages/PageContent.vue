<template>
  <div class="flex p-2">
    <form ref="frm" class="m-auto" @submit.prevent="submitForm(!v$.$invalid)">
      <Card>
        <template #content>
          <div class="flex flex-column">
            <label for="urls" :class="{'p-error': v$.chosenBlog.$invalid && submitted}">* Blog URL</label>
            <Dropdown id="urls" v-model="v$.chosenBlog.$model" :options="blogUrls" option-value="id" option-label="url" :class="{'p-invalid': v$.chosenBlog.$invalid && submitted}" />
            <div v-if="v$.chosenBlog.$error && submitted">
              <div v-for="(error, index) in v$.chosenBlog.$errors" id="blog-error" :key="index">
                <small class="p-error">{{ error.$message }}</small>
              </div>
            </div>
            <div v-else-if="(v$.chosenBlog.$invalid && submitted) || v$.chosenBlog.$pending.$response" class="p-error">{{ v$.chosenBlog.required.$message }}</div>

            <label for="term" class="mt-3" :class="{'p-error': v$.searchTerm.$invalid && submitted}">* Search term</label>
            <InputText id="term" v-model.trim="v$.searchTerm.$model" :class="{'p-invalid': v$.searchTerm.$invalid && submitted}" />
            <div v-if="v$.searchTerm.$error && submitted">
              <div v-for="(error, index) in v$.searchTerm.$errors" id="term-error" :key="index">
                <small class="p-error">{{ error.$message }}</small>
              </div>
            </div>
            <div v-else-if="(v$.searchTerm.$invalid && submitted) || v$.searchTerm.$pending.$response" class="p-error">{{ v$.searchTerm.required.$message }}</div>

            <label for="articles" class="mt-3">Number of articles</label>
            <Dropdown id="articles" v-model="numberArticles" :options="optionsArticles" />
          </div>
        </template>
        <template #footer>
          <div class="flex">
            <Button type="submit" label="Generate" class="mx-auto" :disabled="!hasAllKeys" />
          </div>
        </template>
      </Card>
    </form>
  </div>
</template>

<script>
import ajax from 'src/ajax';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

export default
{
  name: 'PageContent',
  setup: () => ({ v$: useVuelidate() }),
  data()
  {
    return {
      chosenBlog: null,
      blogUrls: [],
      searchTerm: '',
      numberArticles: 5,
      optionsArticles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      apiKeys: {},
      submitted: false,
    };
  },
  computed:
    {
      hasAllKeys()
      {
        return (this.apiKeys.googleTranslation || '') !== '' && (this.apiKeys.scrapingBee || '') !== '';
      }
    },
  validations()
  {
    return {
      chosenBlog:
        {
          required,
        },
      searchTerm:
        {
          required,
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
        ajax.get('/blogs').then(response =>
        {
          if (response)
          {
            this.blogUrls = response;
          }
        });
        ajax.get('/keys').then(response =>
        {
          if (response)
          {
            this.apiKeys = response;
          }
        });
      },
      submitForm(isFormValid)
      {
        this.submitted = true;
        if (isFormValid)
        {
          ajax.post('/generate', {
            blogUrl: this.chosenBlog.url, // the good practice is to use ID
            searchTerm: this.searchTerm,
            numberArticles: this.numberArticles,
          });
        }
      },
    },
};
</script>
