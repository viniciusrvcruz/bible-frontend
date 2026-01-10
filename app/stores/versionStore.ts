import type { Version } from '~/types/version/Version.type'
import type { BookWithChapters } from '~/types/book/Book.type'

export const useVersionStore = defineStore('version', () => {
  const versions = ref<Version[]>([])
  const currentVersion = ref<Version | null>(null)
  const currentVersionBooks = ref<BookWithChapters[]>([])

  const currentVersionName = useCookie<string | null>('current-version-name')

  // Flatten all chapters from all books into a single array
  const allChapters = computed(() => {
    return currentVersionBooks.value.flatMap(book => 
      book.chapters.map(chapter => ({
        ...chapter,
        book: {
          abbreviation: book.abbreviation,
          name: book.name
        }
      }))
    )
  })

  const setVersions = (data: Version[]) => {
    versions.value = data

    if (currentVersionName.value) {
      currentVersion.value = versions.value.find(version => version.abbreviation === currentVersionName.value) ?? null
    }

    if (!currentVersion.value) {
      setCurrentVersion(versions.value[0] ?? null)
    }
  }

  const setCurrentVersion = (version: Version | null) => {
    currentVersion.value = version
    currentVersionName.value = version?.abbreviation ?? null
  }

  const setCurrentVersionBooks = (books: BookWithChapters[]) => {
    currentVersionBooks.value = books
  }

  const getVersionByAbbreviation = (abbreviation: string) => {
    return versions.value.find(version => version.abbreviation === abbreviation) ?? null
  }

  const getBookByAbbreviation = (abbreviation: string) => {
    return currentVersionBooks.value.find(book => book.abbreviation === abbreviation)
  }

  const getBookByName = (name: string) => {
    return currentVersionBooks.value.find(book => book.name === name)
  }

  return {
    versions,
    currentVersion,
    currentVersionBooks,
    allChapters,
    setVersions,
    setCurrentVersion,
    setCurrentVersionBooks,
    getVersionByAbbreviation,
    getBookByAbbreviation,
    getBookByName,
  }
})