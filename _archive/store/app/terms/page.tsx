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
            利用規約（出店者向け）
          </h1>
        </div>

        <Section title="1. 適用範囲">
          当プラットフォームの出店申込・管理機能をご利用いただく際の基本的なルールを定めます。利用をもって本規約に同意したものとみなします。
        </Section>

        <Section title="2. アカウント管理">
          登録情報は正確かつ最新に保ってください。第三者への貸与・譲渡は禁止です。不正利用が疑われる場合はアカウントを停止することがあります。
        </Section>

        <Section title="3. 出店コンテンツ">
          法令や公序良俗に反する商品・表現は禁止です。申込内容が不適切と判断した場合は、掲載拒否・削除することがあります。
        </Section>

        <Section title="4. 免責事項">
          システム障害・ネットワーク障害等により生じた損害について、当社は責任を負いません。必要に応じて自己の責任と費用でバックアップを取得してください。
        </Section>

        <Section title="5. 規約の変更">
          事前告知のうえ本規約を改定することがあります。改定後の利用をもって、変更に同意したものとみなします。
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
