import type { BookWithChapters } from '~/types/book/Book.type'

export function useBookService() {
  const api = useApi()

  const useIndex = (version_id: number) => {
    return useApiFetch<BookWithChapters[]>(`versions/${version_id}/books`)
  }

  const index = (version_id: number) => {
    return api.get<BookWithChapters[]>(`versions/${version_id}/books`)
  }

  return {
    useIndex,
    index,
  }
}

