import type { Version } from '~/types/version/Version.type'

export function useVersionService() {
  const useIndex = () => {
    return useApiFetch<Version[]>('versions')
  }

  return {
    useIndex,
  }
}
