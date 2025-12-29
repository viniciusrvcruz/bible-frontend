import type { BookNameType } from '~/utils/book'
import type { Chapter } from '~/types/chapter/Chapter.type'

interface ChapterResponse {
  id: number
  number: number
  position: number
  verses_count: number
}

export function useChapterService() {
  const api = useApi()

  const index = (book: BookNameType, version_id: number) => {
    return api.get<ChapterResponse[]>(`books/${book}/chapters`, { version_id })
  }

  const show = (book: BookNameType, chapter: number, version_id: number) => {
    return api.get<Chapter>(`books/${book}/chapters/${chapter}`, { version_id })
  }

  return {
    index,
    show,
  }
}