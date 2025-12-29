import type { Version } from '~/types/version/Version.type'

export function useVersionService() {
  const index = () => {
    return useApiFetch<Version[]>('versions')
  }

  return {
    index,
  }
}
