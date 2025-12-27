import type { Version } from '~/types/version/Version.type'

export const useVersionStore = defineStore('version', () => {
  const versions = ref<Version[]>([])
  const currentVersion = ref<Version | null>(null)

  const currentVersionName = useCookie<string | null>('current-version-name')

  const setVersions = (data: Version[]) => {
    versions.value = data

    if (currentVersionName.value) {
      currentVersion.value = versions.value.find(version => version.name === currentVersionName.value) ?? null
    }

    if (!currentVersion.value) {
      setCurrentVersion(versions.value[0] ?? null)
    }
  }

  const setCurrentVersion = (version: Version | null) => {
    currentVersion.value = version
    currentVersionName.value = version?.name ?? null
  }

  const getVersionByName = (name: string) => {
    return versions.value.find(version => version.name === name) ?? null
  }

  return {
    versions,
    currentVersion,
    setVersions,
    setCurrentVersion,
    getVersionByName,
  }
})