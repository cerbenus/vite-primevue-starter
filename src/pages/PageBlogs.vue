<template>
  <div class="flex items-center overflow-auto p-2" style="min-height: 100%">
    <ConfirmPopup />

    <Card class="ml-auto mr-3" style="width: 350px; max-width: 90vw;">
      <template #content>
        <Listbox v-model="selectedBlogId" :options="blogs" option-label="url" option-value="id" list-style="max-height: 240px;" />
      </template>
      <template #footer>
        <div class="flex">
          <Button label="Delete" class="mx-auto" :disabled="!selectedBlogId" @click="deleteBlog" />
        </div>
      </template>
    </Card>

    <form ref="frm" class="ml-3 mr-auto" @submit.prevent="submitForm(!v$.$invalid)">
      <Card style="width: 350px; max-width: 90vw;">
        <template #header>
          <div class="pt-1 px-1 text-center">Add blog</div>
        </template>
        <template #content>
          <div class="flex flex-column">
            <label for="blog" :class="{'p-error': v$.form.url.$invalid && submitted}">* Blog URL</label>
            <InputText id="blog" v-model.trim="v$.form.url.$model" :class="{'p-invalid': v$.form.url.$invalid && submitted}" />
            <div v-if="v$.form.url.$error && submitted">
              <div v-for="(error, index) in v$.form.url.$errors" :key="index">
                <small class="p-error">{{ error.$message }}</small>
              </div>
            </div>
            <div v-else-if="(v$.form.url.$invalid && submitted) || v$.form.url.$pending.$response" class="p-error">{{ v$.form.url.required.$message }}</div>

            <label for="user" class="mt-3" :class="{'p-error': v$.form.username.$invalid && submitted}">* Username</label>
            <InputText id="user" v-model.trim="v$.form.username.$model" :class="{'p-invalid': v$.form.username.$invalid && submitted}" />
            <div v-if="v$.form.username.$error && submitted">
              <div v-for="(error, index) in v$.form.username.$errors" :key="index">
                <small class="p-error">{{ error.$message }}</small>
              </div>
            </div>
            <div v-else-if="(v$.form.username.$invalid && submitted) || v$.form.username.$pending.$response" class="p-error">{{ v$.form.username.required.$message }}</div>

            <label for="pass" class="mt-3" :class="{'p-error': v$.form.password.$invalid && submitted}">* Application password</label>
            <InputText id="pass" v-model.trim="v$.form.password.$model" :class="{'p-invalid': v$.form.password.$invalid && submitted}" />
            <div v-if="v$.form.password.$error && submitted">
              <div v-for="(error, index) in v$.form.password.$errors" :key="index">
                <small class="p-error">{{ error.$message }}</small>
              </div>
            </div>
            <div v-else-if="(v$.form.password.$invalid && submitted) || v$.form.password.$pending.$response" class="p-error">{{ v$.form.password.required.$message }}</div>
          </div>
        </template>
        <template #footer>
          <div class="flex">
            <Button type="submit" label="Add" class="mx-auto" />
          </div>
        </template>
      </Card>
    </form>
  </div>
</template>

<script>
import ajax from 'src/ajax';
import { required, url } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

export default
{
  name: 'PageBlogs',
  setup: () => ({ v$: useVuelidate() }),
  data()
  {
    return {
      submitted: false,
      blogs: [],
      selectedBlogId: null,
      form:
        {
          url: '',
          username: '',
          password: '',
        },
    };
  },
  validations()
  {
    return {
      form:
        {
          url:
            {
              required,
              url,
            },
          username:
            {
              required
            },
          password:
            {
              required
            },
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
        ajax.get('/account/blogs').then(response =>
        {
          if (response)
          {
            this.blogs = response;
          }
        });
      },
      submitForm(isFormValid)
      {
        this.submitted = true;
        if (isFormValid)
        {
          ajax.post('/account/blogs', this.form).then(response =>
          {
            if (response)
            {
              this.blogs.push(response);
              this.form = {
                url: '',
                username: '',
                password: '',
              };
              this.submitted = false;
            }
          });
        }
      },
      deleteBlog(event)
      {
        this.$confirm.require({
          target: event.currentTarget,
          message: 'Are you sure you want to proceed?',
          icon: 'pi pi-exclamation-triangle',
          accept: () =>
          {
            ajax.delete('/account/blogs/' + this.selectedBlogId).then(response =>
            {
              if (response && response.id)
              {
                const idx = this.blogs.findIndex(item => +item.id === +response.id);
                if (idx !== -1) this.blogs.splice(idx, 1);
                this.selectedBlogId = null;
              }
            });
          },
          reject: () =>
          {
            //callback to execute when user rejects the action
          }
        });
      }
    },
};
</script>
