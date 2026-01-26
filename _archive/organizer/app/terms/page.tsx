'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { colors, spacing, typography, borderRadius, shadows } from '@/styles/design-system'

export default function TermsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleReturn = () => {
    const returnTo = searchParams.get('returnTo')
    if (returnTo) {
      router.push(returnTo)
      return
    }
    router.back()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.neutral[50],
      padding: spacing[8],
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: '900px',
        width: '100%',
        background: colors.neutral[0],
        borderRadius: borderRadius['2xl'],
        boxShadow: shadows.lg,
        padding: spacing[8],
        display: 'grid',
        gap: spacing[6],
      }}>
        <div>
          <p style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize.sm,
            color: colors.neutral[500],
            marginBottom: spacing[2],
          }}>
            最終更新日: 2024-01-01
          </p>
          <h1 style={{
            fontFamily: typography.fontFamily.japanese,
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
          }}>
            利用規約（主催者向け）
          </h1>
        </div>

        <Section title="1. 適用範囲">
          本規約は、主催者がイベント作成・出店者管理機能を利用する際の条件を定めます。利用をもって本規約に同意したものとみなします。
        </Section>

        <Section title="2. アカウント管理">
          正確な情報を登録し、第三者への共有・譲渡は行わないでください。不正利用が疑われる場合は、アカウントを停止することがあります。
        </Section>

        <Section title="3. イベント掲載">
          法令・公序良俗に反する内容は禁止です。運営が不適切と判断した場合、掲載拒否・削除を行うことがあります。
        </Section>

        <Section title="4. 免責事項">
          システム障害や通信障害に起因する損害について、当社は責任を負いません。必要に応じてバックアップを取得してください。
        </Section>

        <Section title="5. 規約の変更">
          事前告知のうえ改定を行う場合があります。改定後の利用をもって変更に同意したものとみなします。
        </Section>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: spacing[4] }}>
          <button
            onClick={handleReturn}
            style={{
              padding: `${spacing[2]} ${spacing[4]}`,
              background: colors.primary[500],
              color: colors.neutral[0],
              border: 'none',
              borderRadius: borderRadius.md,
              fontFamily: typography.fontFamily.japanese,
              fontWeight: typography.fontWeight.semibold,
              cursor: 'pointer',
            }}
          >
            登録フォームに戻る
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{
      display: 'grid',
      gap: spacing[2],
    }}>
      <h2 style={{
        fontFamily: typography.fontFamily.japanese,
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutral[900],
      }}>
        {title}
      </h2>
      <p style={{
        fontFamily: typography.fontFamily.japanese,
        fontSize: typography.fontSize.base,
        color: colors.neutral[700],
        lineHeight: typography.lineHeight.relaxed,
      }}>
        {children}
      </p>
    </section>
  )
}
