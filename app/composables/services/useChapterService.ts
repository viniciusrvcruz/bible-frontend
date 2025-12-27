import type { BookNameEnum } from '~/types/book/Book.enum'
import type { Chapter } from '~/types/chapter/Chapter.type'

interface ChapterResponse {
  id: number
  number: number
  position: number
  verses_count: number
}

export function useChapterService() {
  const api = useApi()

  const index = (book: BookNameEnum, version_id: number) => {
    return api.get<ChapterResponse[]>(`books/${book}/chapters`, { version_id })
  }

  const show = (book: BookNameEnum, chapter: number, version_id: number) => {
    return api.get<Chapter>(`books/${book}/chapters/${chapter}`, { version_id })
  }

  return {
    index,
    show,
  }
}