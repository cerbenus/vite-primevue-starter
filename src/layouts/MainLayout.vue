<template>
  <div class="flex flex-column fixed top-0 bottom-0 left-0 right-0 overflow-hidden">
    <AppTopBar />
    <main class="flex-1 flex overflow-hidden">
      <router-view class="flex-1" />
    </main>
    <AppFooter />
    <Toast position="bottom-right" group="ajax" />
    <SpinLoader :show="spinner > 0" />
  </div>
</template>

<script setup>
import SpinLoader from '../components/SpinLoader.vue';
import AppTopBar from '../components/AppTopbar.vue';
import AppFooter from '../components/AppFooter.vue';
import eventBus, { SHOW_SPINNER, HIDE_SPINNER, AJAX_ERROR } from '../eventBus';
import { useToast } from 'primevue/usetoast';
import { ref, watch, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

const toast = useToast();
const route = useRoute();
const spinner = ref(0);

function showSpinner()
{
  spinner.value++;
}

function hideSpinner()
{
  spinner.value > 0 && spinner.value--;
}

function apiError(error)
{
  toast.add({
    group: 'ajax',
    severity: 'error',
    summary: 'ERROR',
    detail: typeof error === 'object' ? error.message : error,
    life: 3000
  });
}

eventBus.on(SHOW_SPINNER, showSpinner);
eventBus.on(HIDE_SPINNER, hideSpinner);
eventBus.on(AJAX_ERROR, apiError);

onBeforeUnmount(() =>
{
  eventBus.off(SHOW_SPINNER, showSpinner);
  eventBus.off(HIDE_SPINNER, hideSpinner);
  eventBus.off(AJAX_ERROR, apiError);
});

watch(() => route,
  async =>
  {
    toast.removeAllGroups();
  }
);
</script>
