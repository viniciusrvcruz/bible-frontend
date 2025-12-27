import type { FetchOptions } from 'ofetch'

type RequestOptions = Omit<FetchOptions, 'method' | 'body' | 'query'>

export const useApi = () => {
  const config = useRuntimeConfig()

  const apiBaseURL = import.meta.server
    ? config.apiBaseUrl
    : config.public.apiBaseUrl

  const baseURL = `${apiBaseURL}/api/`

  const request = async <TResponse>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: Record<string, any>,
    options?: RequestOptions
  ): Promise<TResponse> => {
    return $fetch<TResponse>(url, {
      baseURL,
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...(method === 'get'
        ? data
          ? { query: data }
          : {}
        : data
          ? { body: data }
          : {}),
      ...options,
    })
  }

  const get = <TResponse>(
    url: string,
    query?: Record<string, any>,
    options?: RequestOptions
  ) => request<TResponse>('get', url, query, options)

  const post = <TResponse>(
    url: string,
    body?: Record<string, any>,
    options?: RequestOptions
  ) => request<TResponse>('post', url, body, options)

  const put = <TResponse>(
    url: string,
    body?: Record<string, any>,
    options?: RequestOptions
  ) => request<TResponse>('put', url, body, options)

  const del = <TResponse>(
    url: string,
    options?: RequestOptions
  ) => request<TResponse>('delete', url, undefined, options)

  return {
    get,
    post,
    put,
    del,
  }
}
