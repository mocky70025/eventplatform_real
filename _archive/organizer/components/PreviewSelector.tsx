'use client'

import React, { useState } from 'react'
import WelcomeScreen from './WelcomeScreen'
import EmailLoginPreview from './EmailLoginPreview'
import EmailRegisterPreview from './EmailRegisterPreview'
import InitialRegisterPreview from './InitialRegisterPreview'
import EmailConfirmationPreview from './EmailConfirmationPreview'
import RegistrationFormPreview from './RegistrationFormPreview'
import RegistrationConfirmationPreview from './RegistrationConfirmationPreview'
import RegistrationCompletePreview from './RegistrationCompletePreview'
import ProfilePreview from './ProfilePreview'
import ProfileEditPreview from './ProfileEditPreview'
import NotificationPreview from './NotificationPreview'
import MyEventsPreview from './MyEventsPreview'
import ApplicationManagementPreview from './ApplicationManagementPreview'
import EventDetailPreview from './EventDetailPreview'
import EventFormPreview from './EventFormPreview'
import EventConfirmationPreview from './EventConfirmationPreview'
import EventCompletePreview from './EventCompletePreview'
import SellerInitialLoginPreview from './SellerInitialLoginPreview'
import SellerInitialRegisterPreview from './SellerInitialRegisterPreview'
import SellerEmailLoginPreview from './SellerEmailLoginPreview'
import SellerEmailRegisterPreview from './SellerEmailRegisterPreview'
import SellerEmailConfirmationPreview from './SellerEmailConfirmationPreview'
import SellerRegistrationFormPreview from './SellerRegistrationFormPreview'
import SellerRegistrationConfirmationPreview from './SellerRegistrationConfirmationPreview'
import SellerRegistrationCompletePreview from './SellerRegistrationCompletePreview'
import SellerMyEventsPreview from './SellerMyEventsPreview'
import SellerEventDetailPreview from './SellerEventDetailPreview'
import SellerEventSearchPreview from './SellerEventSearchPreview'
import SellerProfilePreview from './SellerProfilePreview'
import SellerNotificationPreview from './SellerNotificationPreview'
import SellerApplicationManagementPreview from './SellerApplicationManagementPreview'
import SellerProfileEditPreview from './SellerProfileEditPreview'

// Googleアイコン（SVG）
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

// メールアイコン（SVG）
const MailIcon = ({ color = '#000000' }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={color}/>
  </svg>
)

type PreviewType = 
  | 'initial-login' 
  | 'initial-register' 
  | 'email-login' 
  | 'email-register' 
  | 'email-confirmation' 
  | 'registration-form'
  | 'registration-confirmation'
  | 'registration-complete'
  | 'profile'
  | 'profile-edit'
  | 'notification'
  | 'my-events'
  | 'application-management'
  | 'event-detail'
  | 'event-form'
  | 'event-confirmation'
  | 'event-complete'
  | 'seller-initial-login'
  | 'seller-initial-register'
  | 'seller-email-login'
  | 'seller-email-register'
  | 'seller-email-confirmation'
  | 'seller-registration-form'
  | 'seller-registration-confirmation'
  | 'seller-registration-complete'
  | 'seller-my-events'
  | 'seller-event-detail'
  | 'seller-event-search'
  | 'seller-profile'
  | 'seller-notification'
  | 'seller-application-management'
  | 'seller-profile-edit';

export default function PreviewSelector() {
  const [previewType, setPreviewType] = useState<PreviewType>('initial-login')
  const [activeTab, setActiveTab] = useState<'organizer' | 'seller'>('organizer')

  // タブが切り替わったときに最初の画面に戻す
  React.useEffect(() => {
    if (activeTab === 'organizer' && previewType.startsWith('seller')) {
      setPreviewType('initial-login')
    } else if (activeTab === 'seller' && !previewType.startsWith('seller')) {
      setPreviewType('seller-initial-login')
    }
  }, [activeTab, previewType])

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#FFFFFF'
    }}>
      {/* プレビュー切り替えボタン */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '8px',
        flexDirection: 'column',
        background: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        maxHeight: '80vh',
        overflowY: 'auto',
        minWidth: '200px'
      }}>
        {/* タブ切り替え */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '12px',
          borderBottom: '1px solid #E5E7EB',
          paddingBottom: '8px'
        }}>
          <button
            onClick={() => {
              setActiveTab('organizer')
              setPreviewType('initial-login')
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: activeTab === 'organizer' ? '#FF8A5C' : 'transparent',
              color: activeTab === 'organizer' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            主催者
          </button>
          <button
            onClick={() => {
              setActiveTab('seller')
              setPreviewType('seller-initial-login')
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: activeTab === 'seller' ? '#5DABA8' : 'transparent',
              color: activeTab === 'seller' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            出店者
          </button>
        </div>

        {/* 主催者側のボタン */}
        {activeTab === 'organizer' && (
          <>
        <button
          onClick={() => setPreviewType('initial-login')}
          style={{
            padding: '8px 16px',
            background: previewType === 'initial-login' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'initial-login' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          1. 初期（ログイン）
        </button>
        <button
          onClick={() => setPreviewType('initial-register')}
          style={{
            padding: '8px 16px',
            background: previewType === 'initial-register' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'initial-register' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          2. 初期（新規登録）
        </button>
        <button
          onClick={() => setPreviewType('email-login')}
          style={{
            padding: '8px 16px',
            background: previewType === 'email-login' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'email-login' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          3. メールログイン
        </button>
        <button
          onClick={() => setPreviewType('email-register')}
          style={{
            padding: '8px 16px',
            background: previewType === 'email-register' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'email-register' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          4. メール新規登録
        </button>
        <button
          onClick={() => setPreviewType('email-confirmation')}
          style={{
            padding: '8px 16px',
            background: previewType === 'email-confirmation' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'email-confirmation' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          5. メール確認待ち
        </button>
        <button
          onClick={() => setPreviewType('registration-form')}
          style={{
            padding: '8px 16px',
            background: previewType === 'registration-form' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'registration-form' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          6. 情報登録フォーム
        </button>
        <button
          onClick={() => setPreviewType('registration-confirmation')}
          style={{
            padding: '8px 16px',
            background: previewType === 'registration-confirmation' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'registration-confirmation' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          7. 情報確認
        </button>
        <button
          onClick={() => setPreviewType('registration-complete')}
          style={{
            padding: '8px 16px',
            background: previewType === 'registration-complete' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'registration-complete' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          8. 登録完了
        </button>
        <button
          onClick={() => setPreviewType('my-events')}
          style={{
            padding: '8px 16px',
            background: previewType === 'my-events' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'my-events' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          9. マイイベント
        </button>
        <button
          onClick={() => setPreviewType('application-management')}
          style={{
            padding: '8px 16px',
            background: previewType === 'application-management' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'application-management' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          10. 申し込み管理
        </button>
        <button
          onClick={() => setPreviewType('event-detail')}
          style={{
            padding: '8px 16px',
            background: previewType === 'event-detail' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'event-detail' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          11. イベント詳細
        </button>
        <button
          onClick={() => setPreviewType('profile')}
          style={{
            padding: '8px 16px',
            background: previewType === 'profile' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'profile' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          12. プロフィール
        </button>
        <button
          onClick={() => setPreviewType('profile-edit')}
          style={{
            padding: '8px 16px',
            background: previewType === 'profile-edit' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'profile-edit' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          13. プロフィール編集
        </button>
        <button
          onClick={() => setPreviewType('notification')}
          style={{
            padding: '8px 16px',
            background: previewType === 'notification' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'notification' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          14. 通知
        </button>
        <button
          onClick={() => setPreviewType('event-form')}
          style={{
            padding: '8px 16px',
            background: previewType === 'event-form' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'event-form' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          15. イベント情報入力
        </button>
        <button
          onClick={() => setPreviewType('event-confirmation')}
          style={{
            padding: '8px 16px',
            background: previewType === 'event-confirmation' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'event-confirmation' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          16. イベント情報確認
        </button>
        <button
          onClick={() => setPreviewType('event-complete')}
          style={{
            padding: '8px 16px',
            background: previewType === 'event-complete' ? '#FF8A5C' : '#E5E7EB',
            color: previewType === 'event-complete' ? 'white' : '#666666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          17. イベント登録完了
        </button>
        </>
        )}

        {/* 出店者側のボタン */}
        {activeTab === 'seller' && (
          <>
          <button
            onClick={() => setPreviewType('seller-initial-login')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-initial-login' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-initial-login' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%',
              marginBottom: '8px'
            }}
          >
            1. 初期（ログイン）
          </button>
          <button
            onClick={() => setPreviewType('seller-initial-register')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-initial-register' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-initial-register' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%',
              marginBottom: '8px'
            }}
          >
            2. 初期（新規登録）
          </button>
          <button
            onClick={() => setPreviewType('seller-email-login')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-email-login' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-email-login' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%',
              marginBottom: '8px'
            }}
          >
            3. メールログイン
          </button>
          <button
            onClick={() => setPreviewType('seller-email-register')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-email-register' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-email-register' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%',
              marginBottom: '8px'
            }}
          >
            4. メール新規登録
          </button>
          <button
            onClick={() => setPreviewType('seller-email-confirmation')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-email-confirmation' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-email-confirmation' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%'
            }}
          >
            5. メール確認待ち
          </button>
          <button
            onClick={() => setPreviewType('seller-registration-form')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-registration-form' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-registration-form' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%'
            }}
          >
            6. 情報登録フォーム
          </button>
          <button
            onClick={() => setPreviewType('seller-registration-confirmation')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-registration-confirmation' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-registration-confirmation' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%'
            }}
          >
            7. 情報確認
          </button>
          <button
            onClick={() => setPreviewType('seller-registration-complete')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-registration-complete' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-registration-complete' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%'
            }}
          >
            8. 登録完了
          </button>
          <button
            onClick={() => setPreviewType('seller-my-events')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-my-events' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-my-events' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%'
            }}
          >
            9. マイイベント
          </button>
          <button
            onClick={() => setPreviewType('seller-event-detail')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-event-detail' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-event-detail' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%'
            }}
          >
            10. イベント詳細
          </button>
          <button
            onClick={() => setPreviewType('seller-event-search')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-event-search' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-event-search' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%'
            }}
          >
            11. イベント検索
          </button>
          <button
            onClick={() => setPreviewType('seller-profile')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-profile' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-profile' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%'
            }}
          >
            12. プロフィール
          </button>
          <button
            onClick={() => setPreviewType('seller-notification')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-notification' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-notification' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%'
            }}
          >
            13. 通知
          </button>
          <button
            onClick={() => setPreviewType('seller-application-management')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-application-management' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-application-management' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%'
            }}
          >
            14. 申し込み管理
          </button>
          <button
            onClick={() => setPreviewType('seller-profile-edit')}
            style={{
              padding: '8px 16px',
              background: previewType === 'seller-profile-edit' ? '#5DABA8' : '#E5E7EB',
              color: previewType === 'seller-profile-edit' ? 'white' : '#666666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              width: '100%'
            }}
          >
            15. プロフィール編集
          </button>
          </>
        )}
      </div>

      {/* プレビュー表示 */}
      {previewType === 'initial-login' && (
        <div>
          {/* WelcomeScreenの初期状態でログインタブがアクティブな状態を再現 */}
          <div style={{
            minHeight: '100vh',
            width: '100%',
            background: '#FFFFFF', // 外側は白
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '393px',
              minWidth: '393px',
              flexShrink: 0,
              background: '#FFF5F0', // スマホフレーム範囲内は薄いオレンジ
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '32px',
              paddingBottom: '32px',
              paddingLeft: '20px',
              paddingRight: '20px'
            }}>
              <div style={{
                width: '353px',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                paddingTop: '32px',
                paddingBottom: '32px',
                paddingLeft: '20px',
                paddingRight: '20px'
              }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: '#FF8A5C',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                  margin: '0 auto 12px'
                }} />
                <h1 style={{
                  margin: '0 0 12px',
                  fontSize: '24px',
                  fontFamily: '"Inter", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  color: '#2C3E50'
                }}>デミセル</h1>
                <p style={{
                  margin: 0,
                  fontSize: '15px',
                  fontFamily: '"Inter", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  color: '#6C757D'
                }}>主催者向けプラットフォーム</p>
              </div>
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', position: 'relative' }}>
                  <button style={{
                    flex: 1,
                    padding: '16px 0',
                    background: 'transparent',
                    border: 'none',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    color: '#FF8A5C',
                    cursor: 'pointer',
                    position: 'relative'
                  }}>
                    ログイン
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '40px',
                      height: '2px',
                      background: '#FF8A5C',
                      borderRadius: '1px 1px 0 0'
                    }} />
                  </button>
                  <button style={{
                    flex: 1,
                    padding: '16px 0',
                    background: 'transparent',
                    border: 'none',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    color: '#666666',
                    cursor: 'pointer'
                  }}>
                    新規登録
                  </button>
                </div>
              </div>
              <div>
                <button style={{
                  width: '100%',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 24px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  marginBottom: '16px',
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: '100%'
                }}>
                  <div style={{ position: 'absolute', left: '24px' }}>
                    <GoogleIcon />
                  </div>
                  <span>Google</span>
                </button>
                <button style={{
                  width: '100%',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 24px',
                  background: '#FF8A5C',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '15px',
                  fontFamily: '"Inter", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  lineHeight: '100%'
                }}>
                  <div style={{ position: 'absolute', left: '24px' }}>
                    <MailIcon color="#ffffff" />
                  </div>
                  <span>メールアドレス</span>
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
      {previewType === 'initial-register' && <InitialRegisterPreview />}
      {previewType === 'email-login' && <EmailLoginPreview />}
      {previewType === 'email-register' && <EmailRegisterPreview />}
      {previewType === 'email-confirmation' && <EmailConfirmationPreview />}
      {previewType === 'registration-form' && <RegistrationFormPreview />}
      {previewType === 'registration-confirmation' && <RegistrationConfirmationPreview />}
      {previewType === 'registration-complete' && <RegistrationCompletePreview />}
      {previewType === 'profile' && <ProfilePreview />}
      {previewType === 'profile-edit' && <ProfileEditPreview />}
      {previewType === 'notification' && <NotificationPreview />}
      {previewType === 'my-events' && <MyEventsPreview />}
      {previewType === 'application-management' && <ApplicationManagementPreview />}
      {previewType === 'event-detail' && <EventDetailPreview />}
      {previewType === 'event-form' && <EventFormPreview />}
      {previewType === 'event-confirmation' && <EventConfirmationPreview />}
      {previewType === 'event-complete' && <EventCompletePreview />}
      {previewType === 'seller-initial-login' && <SellerInitialLoginPreview />}
      {previewType === 'seller-initial-register' && <SellerInitialRegisterPreview />}
      {previewType === 'seller-email-login' && <SellerEmailLoginPreview />}
      {previewType === 'seller-email-register' && <SellerEmailRegisterPreview />}
      {previewType === 'seller-email-confirmation' && <SellerEmailConfirmationPreview />}
      {previewType === 'seller-registration-form' && <SellerRegistrationFormPreview />}
      {previewType === 'seller-registration-confirmation' && <SellerRegistrationConfirmationPreview />}
      {previewType === 'seller-registration-complete' && <SellerRegistrationCompletePreview />}
      {previewType === 'seller-my-events' && <SellerMyEventsPreview />}
      {previewType === 'seller-event-detail' && <SellerEventDetailPreview />}
      {previewType === 'seller-event-search' && <SellerEventSearchPreview />}
      {previewType === 'seller-profile' && <SellerProfilePreview />}
      {previewType === 'seller-notification' && <SellerNotificationPreview />}
      {previewType === 'seller-application-management' && <SellerApplicationManagementPreview />}
      {previewType === 'seller-profile-edit' && <SellerProfileEditPreview />}
    </div>
  )
}

