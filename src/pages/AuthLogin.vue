<template>
  <div class="flex p-2">
    <form ref="frm" class="m-auto" @submit.prevent="submitForm(!v$.$invalid)">
      <Card style="width: 350px; max-width: 90vw;">
        <template #header>
          <div class="pt-1 px-1 text-center">Login</div>
        </template>
        <template #content>
          <div class="flex flex-column">
            <label for="user" :class="{'p-error': v$.form.username.$invalid && submitted}">* Username</label>
            <InputText id="user" v-model.trim="v$.form.username.$model" :class="{'p-invalid': v$.form.username.$invalid && submitted}" />
            <div v-if="v$.form.username.$error && submitted">
              <div v-for="(error, index) in v$.form.username.$errors" :key="index">
                <small class="p-error">{{ error.$message }}</small>
              </div>
            </div>
            <div v-else-if="(v$.form.username.$invalid && submitted) || v$.form.username.$pending.$response" class="p-error">{{ v$.form.username.required.$message }}</div>

            <label for="pass" class="mt-3" :class="{'p-error': v$.form.password.$invalid && submitted}">* Password</label>
            <InputText id="pass" v-model.trim="v$.form.password.$model" :class="{'p-invalid': v$.form.password.$invalid && submitted}" type="password" />
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
            <Button type="submit" label="Login" class="mx-auto" />
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
import { mainStore } from '../store';

export default
{
  name: 'AuthLogin',
  setup: () => ({ v$: useVuelidate() }),
  data()
  {
    return {
      submitted: false,
      form:
        {
          username: '',
          password: '',
        },
    };
  },
  computed:
    {
      store()
      {
        return mainStore();
      },
    },
  validations()
  {
    return {
      form:
        {
          username:
            {
              required
            },
          password:
            {
              required
            }
        },
    };
  },
  created()
  {
    if (this.store.hasSession) this.$router.push('/');
  },
  methods:
    {
      submitForm(isFormValid)
      {
        this.submitted = true;
        if (isFormValid)
        {
          ajax.post('/login', this.form).then(response =>
          {
            if (response)
            {
              this.submitted = false;
              this.store.login(response);
              this.$router.push({ name: 'content' });
            }
          });
        }
      },
    },
};
</script>
