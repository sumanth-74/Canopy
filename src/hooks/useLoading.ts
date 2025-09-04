'use client'

import { useState, useCallback } from 'react'

export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState)
  const [loadingText, setLoadingText] = useState<string>('')

  const startLoading = useCallback((text?: string) => {
    setIsLoading(true)
    if (text) setLoadingText(text)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
    setLoadingText('')
  }, [])

  const withLoading = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    loadingText?: string
  ): Promise<T> => {
    try {
      startLoading(loadingText)
      const result = await asyncFn()
      return result
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    withLoading
  }
}
