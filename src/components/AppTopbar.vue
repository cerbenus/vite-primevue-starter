<template>
  <header class="flex px-4 py-3 justify-content-between align-items-center">
    <router-link to="/" class="menu_home">Vite PrimeVue Starter</router-link>

    <ul class="flex user_menu">
      <li v-if="$route.name !== 'content'">
        <button class="p-link layout-topbar-button" @click="gotoIndex">
          <i class="pi pi-times-circle" />
          <span>Back</span>
        </button>
      </li>
      <li>
        <button class="p-link layout-topbar-button" @click="$refs.menu.toggle($event)">
          <i class="pi pi-user" />
          <span>Profile</span>
        </button>
      </li>
    </ul>

    <Menu ref="menu" :model="menuItems" popup />
  </header>
</template>

<script>
export default
{
  name: 'AppTopbar',
  computed:
    {
      menuItems()
      {
        return [
          {
            label: 'Blogs',
            to: '/manage/blogs',
          },
          {
            label: 'API keys',
            to: '/manage/api-keys',
          },
          {
            label: 'Logout',
            command: this.logout,
          },
        ];
      },
    },
  methods:
    {
      logout()
      {

      },
      gotoIndex()
      {
        this.$router.push('/');
      },
    }
};
</script>

<style lang="scss">
header
{
  color: var(--surface-900);
  background-color: var(--surface-overlay);
  box-shadow: 0px 3px 5px rgba(0,0,0,.02), 0px 0px 2px rgba(0,0,0,.05), 0px 1px 4px rgba(0,0,0,.08);
}
.menu_home
{
  color: var(--surface-900);
  font-size: 1.5rem;
  font-weight: 500;
}

.user_menu
{
  transform-origin: top;
  list-style: none;
  padding: 0;
  margin: 0;
}

.layout-topbar-button
{
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: var(--text-color-secondary);
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  cursor: pointer;
  transition: background-color $transitionDuration;

  &:hover
  {
    color: var(--text-color);
    background-color: var(--surface-hover);
  }

  &:focus
  {
    @include focused();
  }

  i
  {
    font-size: 1.5rem;
  }

  span
  {
    font-size: 1rem;
    display: none;
  }
}

</style>
