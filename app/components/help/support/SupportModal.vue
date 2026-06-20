<script setup lang="ts">
const modalRef = useModalRef('modalRef')
const formRef = useTemplateRef('formRef')
const success = ref(false)
const errorMessage = ref('')

const open = () => {
  success.value = false
  errorMessage.value = ''
  formRef.value?.reset()
  modalRef.value?.open()
}

const close = () => {
  modalRef.value?.close()
}

const onSupportSuccess = () => {
  success.value = true
}

defineExpose({ open })
</script>

<template>
  <SharedModal
    ref="modalRef"
    title="Enviar Feedback"
    title-id="support-modal-title"
    header-bordered
    box-class="flex flex-col sm:max-h-[min(85vh,720px)]"
  >
    <!-- Success state -->
    <div v-if="success" class="flex flex-col items-center gap-4 py-12 text-center flex-1">
      <div class="rounded-full p-4 bg-success/10 flex items-center justify-center">
        <Icon icon="check" :size="40" class="text-success" />
      </div>
      <div>
        <p class="text-lg font-semibold mb-1">Enviado com sucesso!</p>
        <p class="text-sm text-base-content/70">
          Obrigado pelo seu feedback. Vamos analisar sua solicitação o mais breve possível.
        </p>
      </div>
      <button class="btn btn-primary btn-sm mt-2" @click="close">
        Fechar
      </button>
    </div>

    <template v-else>
      <!-- Scrollable body -->
      <div class="overflow-y-auto flex-1 py-4 -mx-1 px-1">
        <!-- Description -->
        <p class="text-sm text-base-content/70 mb-5">
          Reporte bugs, envie sugestões de melhoria ou peça ajuda para alguma situação. Seu feedback nos ajuda a melhorar a sua experiência com a plataforma.
        </p>

        <HelpSupportForm
          ref="formRef"
          v-model:error="errorMessage"
          @success="onSupportSuccess"
        />
      </div>

      <!-- Footer (fixed) -->
      <div class="pt-4 border-t border-base-300 shrink-0 space-y-3">
        <div
          v-if="errorMessage"
          class="text-sm text-error flex items-start gap-2"
          role="alert"
        >
          <Icon icon="info" :size="16" class="shrink-0 mt-0.5" />
          <span>{{ errorMessage }}</span>
        </div>
        <div class="flex justify-end gap-3">
          <button type="button" class="btn btn-ghost min-w-28" @click="close">
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-primary min-w-28"
            @click="formRef?.requestSubmit()"
          >
            <span v-if="formRef?.loading" class="loading loading-spinner loading-md" />
            {{ formRef?.loading ? 'Enviando...' : 'Enviar' }}
          </button>
        </div>
      </div>
    </template>
  </SharedModal>
</template>
