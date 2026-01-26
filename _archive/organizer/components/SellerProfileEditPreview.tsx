'use client'

import React, { useState } from 'react'

export default function SellerProfileEditPreview() {
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [genre, setGenre] = useState('')
  const [genreFree, setGenreFree] = useState('')

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#FFFFFF', // 外側は白
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        width: '393px',
        minWidth: '393px',
        maxWidth: '393px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        boxSizing: 'border-box'
      }}>
      {/* ヘッダー */}
      <div style={{
        width: '100%',
        flexShrink: 0,
        height: '64px',
        background: '#5DABA8', // Secondary Main（出店者用）
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '18px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: 'white'
        }}>
          プロフィール編集
        </h1>
        <button style={{
          position: 'absolute',
          left: '16px',
          background: 'transparent',
          border: 'none',
          fontSize: '24px',
          fontFamily: '"Inter", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: 'white',
          cursor: 'pointer',
          padding: 0,
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          &lt;
        </button>
      </div>

      <div style={{
        width: '100%',
        flexShrink: 0,
        background: '#E8F5F5', // スマホフレーム範囲内は薄い青緑（出店者用）
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '16px',
        paddingBottom: '32px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box'
      }}>
      {/* コンテンツエリア */}
      <div style={{
        width: '100%'
      }}>
      {/* フォーム */}
      <div style={{
        width: '100%',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)', // Shadow LG
        paddingTop: '32px',
        paddingBottom: '32px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box'
      }}>
        {/* タイトル */}
        <h2 style={{
          margin: '0 0 24px',
          fontSize: '20px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50'
        }}>
          情報を入力してください
        </h2>

        {/* お名前 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          お名前
        </label>
        <input
          type="text"
          placeholder="例: 山田太郎"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            marginBottom: '24px',
            border: '1px solid #E9ECEF',
            borderRadius: '8px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            color: '#6C757D',
            boxSizing: 'border-box'
          }}
        />

        {/* 性別 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          性別
        </label>
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 40px 12px 16px',
              border: '1px solid #E9ECEF',
              borderRadius: '8px',
              fontSize: '15px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              color: '#6C757D',
              appearance: 'none',
              backgroundColor: 'white',
              boxSizing: 'border-box'
            }}
          >
            <option value="">選択してください</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">その他</option>
          </select>
          <div style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}>
            <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.75 0.75L4 4.25L7.25 0.75" stroke="#6C757D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* 年齢 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          年齢
        </label>
        <input
          type="number"
          placeholder="例: 35"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            marginBottom: '24px',
            border: '1px solid #E9ECEF',
            borderRadius: '8px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            color: '#6C757D',
            boxSizing: 'border-box'
          }}
        />

        {/* 電話番号 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          電話番号
        </label>
        <input
          type="tel"
          placeholder="例: 090-1234-5678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            marginBottom: '24px',
            border: '1px solid #E9ECEF',
            borderRadius: '8px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            color: '#6C757D',
            boxSizing: 'border-box'
          }}
        />

        {/* メールアドレス */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          メールアドレス
        </label>
        <input
          type="email"
          placeholder="例: example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            marginBottom: '24px',
            border: '1px solid #E9ECEF',
            borderRadius: '8px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            color: '#6C757D',
            boxSizing: 'border-box'
          }}
        />

        {/* ジャンル */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          ジャンル
        </label>
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 40px 12px 16px',
              border: '1px solid #E9ECEF',
              borderRadius: '8px',
              fontSize: '15px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              color: '#6C757D',
              appearance: 'none',
              backgroundColor: 'white',
              boxSizing: 'border-box'
            }}
          >
            <option value="">選択してください</option>
            <option value="food">飲食</option>
            <option value="craft">手工芸</option>
            <option value="other">その他</option>
          </select>
          <div style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}>
            <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.75 0.75L4 4.25L7.25 0.75" stroke="#6C757D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* ジャンル（自由回答） */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          ジャンル（自由回答）
        </label>
        <textarea
          placeholder="例: 焼きそば、たこ焼きなど"
          value={genreFree}
          onChange={(e) => setGenreFree(e.target.value)}
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '12px 16px',
            marginBottom: '24px',
            border: '1px solid #E9ECEF',
            borderRadius: '8px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            color: '#6C757D',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />

        {/* ステータスバッジ */}
        <div style={{
          background: '#A8D5BA', // System Success
          borderRadius: '8px',
          padding: '9px 16px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white"/>
            </svg>
            <span style={{
              fontSize: '15px',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              color: 'white'
            }}>
              有効
            </span>
          </div>
          <p style={{
            margin: 0,
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: 'white'
          }}>
            期限: 2025/12/31
          </p>
        </div>

        {/* 営業許可証 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          営業許可証
        </label>
        <div style={{
          width: '100%',
          height: '187px',
          border: '2px dashed #5DABA8',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '8px',
          cursor: 'pointer',
          background: '#F8F9FA'
        }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '8px' }}>
            <path d="M20 13.3333V26.6667M13.3333 20H26.6667" stroke="#5DABA8" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p style={{
            margin: 0,
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#5DABA8',
            textAlign: 'center'
          }}>
            画像をアップロード
          </p>
        </div>
        <p style={{
          margin: '0 0 24px',
          fontSize: '13px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          color: '#6C757D',
          textAlign: 'center'
        }}>
          AI確認機能付き
        </p>

        {/* 車検証 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          車検証
        </label>
        <div style={{
          width: '100%',
          height: '187px',
          border: '2px dashed #5DABA8',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          cursor: 'pointer',
          background: '#F8F9FA'
        }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '8px' }}>
            <path d="M20 13.3333V26.6667M13.3333 20H26.6667" stroke="#5DABA8" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p style={{
            margin: 0,
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#5DABA8',
            textAlign: 'center'
          }}>
            画像をアップロード
          </p>
        </div>

        {/* 自動車検査証 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          自動車検査証
        </label>
        <div style={{
          width: '100%',
          height: '187px',
          border: '2px dashed #5DABA8',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          cursor: 'pointer',
          background: '#F8F9FA'
        }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '8px' }}>
            <path d="M20 13.3333V26.6667M13.3333 20H26.6667" stroke="#5DABA8" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p style={{
            margin: 0,
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#5DABA8',
            textAlign: 'center'
          }}>
            画像をアップロード
          </p>
        </div>

        {/* PL保険 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          PL保険
        </label>
        <div style={{
          width: '100%',
          height: '187px',
          border: '2px dashed #5DABA8',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          cursor: 'pointer',
          background: '#F8F9FA'
        }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '8px' }}>
            <path d="M20 13.3333V26.6667M13.3333 20H26.6667" stroke="#5DABA8" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p style={{
            margin: 0,
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#5DABA8',
            textAlign: 'center'
          }}>
            画像をアップロード
          </p>
        </div>

        {/* 火器類配置図 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px'
        }}>
          火器類配置図
        </label>
        <div style={{
          width: '100%',
          height: '187px',
          border: '2px dashed #5DABA8',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
          cursor: 'pointer',
          background: '#F8F9FA'
        }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '8px' }}>
            <path d="M20 13.3333V26.6667M13.3333 20H26.6667" stroke="#5DABA8" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p style={{
            margin: 0,
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: '#5DABA8',
            textAlign: 'center'
          }}>
            画像をアップロード
          </p>
        </div>

        {/* 保存ボタン */}
        <button style={{
          width: '100%',
          padding: '16px 24px',
          background: '#5DABA8', // Secondary Main（出店者用）
          borderRadius: '12px',
          border: 'none',
          fontSize: '15px',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)', // Shadow SM
        }}>
          保存
        </button>
        </div>
      </div>
      </div>
      </div>
    </div>
  )
}

