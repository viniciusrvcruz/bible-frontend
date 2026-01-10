export function useApiFetch<T>(url: string) {
  const config = useRuntimeConfig()

  const baseURL = import.meta.server
    ? config.apiBaseUrl
    : config.public.apiBaseUrl

  return useFetch<T>(`/api/${url}`, {
    baseURL,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    key: url,
    retry: 0,
  })
}
