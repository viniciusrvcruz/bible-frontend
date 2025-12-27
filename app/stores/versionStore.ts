import type { Version } from '~/types/version/Version.type'

export const useVersionStore = defineStore('version', () => {

  const versions = ref<Version[]>([])
  const currentVersion = ref<Version | null>(null)

  const currentVersionName = useCookie<string | null>('current-version-name')

  const getVersions = async () => {
    const { data } = await useApiFetch<Version[]>('versions')

    versions.value = data.value ?? []

    if(currentVersionName.value) {
      currentVersion.value = versions.value.find(version => version.name === currentVersionName.value) ?? null
    }

    if(!currentVersion.value) {
      setCurrentVersion(versions.value[0] ?? null)
    }
  }

  const setCurrentVersion = (version: Version | null) => {
    currentVersion.value = version
    currentVersionName.value = version?.name ?? null
  }

  return {
    currentVersion,
    getVersions,
    setCurrentVersion,
  }
})