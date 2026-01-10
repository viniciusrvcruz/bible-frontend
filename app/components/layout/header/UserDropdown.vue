<script setup lang="ts">
import { ref } from 'vue';

const popover = ref()

const toggle = (event: Event) => {
  popover.value.toggle(event)
}

defineExpose({
  toggle,
})
</script>

<template>
  <Popover ref="popover">
    <div class="w-72 sm:w-80 p-5">
      <!-- User header -->
      <div class="flex flex-col items-center gap-3 mb-5 pb-5 border-b border-base-300">
        <div class="rounded-full p-4 bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center aspect-square">
          <Icon icon="user" :size="32" class="text-primary" />
        </div>
        <div class="text-center">
          <p class="font-semibold text-base text-base-content">
            Usuário
          </p>
          <p class="text-sm text-base-content/60 mt-0.5">
            Convidado
          </p>
        </div>
      </div>

      <!-- Login information -->
      <div class="space-y-3">
        <div class="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-base-200/80 to-base-200/40 border border-base-300/50 shadow-sm">
          <div class="rounded-full p-2 bg-primary/10 flex-shrink-0 mt-0.5 flex items-center justify-center aspect-square">
            <Icon icon="info" :size="18" class="text-primary" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-base-content mb-1.5">
              Login em breve
            </p>
            <p class="text-xs text-base-content/70 leading-relaxed">
              O sistema de autenticação ainda será desenvolvido. Em breve você poderá fazer login e personalizar sua experiência de leitura.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Popover>
</template>

