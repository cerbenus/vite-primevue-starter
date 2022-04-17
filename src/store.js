import { createPinia, defineStore } from 'pinia';

export function install(app)
{
  const pinia = createPinia();
  app.use(pinia);
}

export const mainStore = defineStore('main', {
  state()
  {
    return {
      isLoggedIn: false,
    };
  },
  getters:
    {
      hasSession()
      {
        return this.isLoggedIn;
      },
    },
  actions:
    {
      login(user)
      {
        this.isLoggedIn = !!user;
        if (user) localStorage.setItem('user', JSON.stringify(user));
        else this.logout();
      },
      logout()
      {
        this.isLoggedIn = false;
        localStorage.removeItem('user');
      },
    }
});
