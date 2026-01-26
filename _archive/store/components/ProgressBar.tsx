'use client'

import { CSSProperties } from 'react'
import { colors, spacing, borderRadius, typography } from '@/styles/design-system'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  steps?: string[]
  showLabels?: boolean
}

export default function ProgressBar({ 
  currentStep, 
  totalSteps, 
  steps,
  showLabels = true 
}: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  const containerStyle: CSSProperties = {
    width: '100%',
    padding: spacing[6],
  }

  const barContainerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '8px',
    background: colors.neutral[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  }

  const barFillStyle: CSSProperties = {
    height: '100%',
    width: `${progress}%`,
    background: colors.primary[500],
    borderRadius: borderRadius.full,
    transition: 'width 0.3s ease-out',
  }

  const stepsContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: spacing[4],
  }

  const stepStyle = (index: number): CSSProperties => {
    const isCompleted = index < currentStep
    const isCurrent = index === currentStep - 1
    
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
    }
  }

  const stepCircleStyle = (index: number): CSSProperties => {
    const isCompleted = index < currentStep
    const isCurrent = index === currentStep - 1
    
    return {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isCompleted || isCurrent ? colors.primary[500] : colors.neutral[200],
      color: isCompleted || isCurrent ? colors.neutral[0] : colors.neutral[500],
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      transition: 'all 0.3s ease-out',
      boxShadow: isCurrent ? `0 0 0 4px ${colors.primary[100]}` : 'none',
    }
  }

  const stepLabelStyle = (index: number): CSSProperties => {
    const isCompleted = index < currentStep
    const isCurrent = index === currentStep - 1
    
    return {
      marginTop: spacing[2],
      fontFamily: typography.fontFamily.japanese,
      fontSize: typography.fontSize.xs,
      fontWeight: isCurrent ? typography.fontWeight.semibold : typography.fontWeight.medium,
      color: isCompleted || isCurrent ? colors.neutral[900] : colors.neutral[500],
      textAlign: 'center',
    }
  }

  return (
    <div style={containerStyle}>
      <div style={barContainerStyle}>
        <div style={barFillStyle} />
      </div>
      
      {showLabels && steps && (
        <div style={stepsContainerStyle}>
          {steps.map((step, index) => (
            <div key={index} style={stepStyle(index)}>
              <div style={stepCircleStyle(index)}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span style={stepLabelStyle(index)}>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
