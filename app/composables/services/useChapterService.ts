import type { BookNameEnum } from "~/types/enums/Book.enum"

export function useChapterService() {
  const api = useApi()

  const index = (book: BookNameEnum, version_id: number) => {
    return api.get(`books/${book}/chapters`, { version_id })
  }

  return {
    index,
  }
}