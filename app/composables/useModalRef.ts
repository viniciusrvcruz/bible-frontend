import { useTemplateRef } from 'vue'

export type SharedModalExposed = {
  open: () => void
  close: () => void
}

export const useModalRef = <T extends SharedModalExposed = SharedModalExposed>(
  name: string,
) => useTemplateRef<T>(name)
