'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { colors, spacing, typography, borderRadius, shadows } from '@/styles/design-system'

export default function PrivacyPage() {
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
            プライバシーポリシー（主催者向け）
          </h1>
        </div>

        <Section title="1. 収集する情報">
          イベント作成や出店者管理に必要な氏名・連絡先・組織情報、ログイン認証に必要な識別子、アクセスログ等を取得します。
        </Section>

        <Section title="2. 利用目的">
          イベント運営・審査・サポート対応、本人確認、不正防止、サービス品質向上のための分析に利用します。
        </Section>

        <Section title="3. 第三者提供・委託">
          法令に基づく場合や業務委託先への必要最小限の提供を除き、同意なく第三者へ提供しません。
        </Section>

        <Section title="4. セキュリティ">
          SSL/TLSによる通信保護、アクセス制御等の安全管理措置を講じ、データの保護に努めます。
        </Section>

        <Section title="5. 開示・訂正・削除">
          ご本人からの請求に応じ、合理的な範囲で開示・訂正・削除を行います。お問い合わせ窓口までご連絡ください。
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
