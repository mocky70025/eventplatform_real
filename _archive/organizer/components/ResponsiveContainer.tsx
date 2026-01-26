'use client'

import React, { ReactNode } from 'react'
import { useResponsive } from './useResponsive'

interface ResponsiveContainerProps {
  children: ReactNode
  background?: string
  paddingTop?: string
  paddingBottom?: string
  className?: string
}

export default function ResponsiveContainer({ 
  children, 
  background = '#FFFFFF',
  paddingTop = '32px',
  paddingBottom = '32px',
  className = ''
}: ResponsiveContainerProps) {
  const { isDesktop } = useResponsive()

  return (
    <div 
      className={className}
      style={{
        minHeight: '100vh',
        width: '100%',
        background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop,
        paddingBottom,
        paddingLeft: isDesktop ? '32px' : '16px',
        paddingRight: isDesktop ? '32px' : '16px'
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: isDesktop ? '1200px' : '393px'
      }}>
        {children}
      </div>
    </div>
  )
}

