'use client'

import { useState, useEffect } from 'react'

export function useResponsive() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)

    return () => {
      window.removeEventListener('resize', checkIsDesktop)
    }
  }, [])

  return { isDesktop }
}

