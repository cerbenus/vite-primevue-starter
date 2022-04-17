<template>
  <div class="flex flex-column fixed top-0 bottom-0 left-0 right-0 overflow-hidden">
    <AppTopBar />
    <main class="flex-1 flex overflow-hidden">
      <router-view class="flex-1" />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppTopBar from '../components/AppTopbar.vue';
import AppFooter from '../components/AppFooter.vue';
import { useToast } from 'primevue/usetoast';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const toast = useToast();
const route = useRoute();

watch(() => route,
  async =>
  {
    toast.removeAllGroups();
  }
);
</script>
