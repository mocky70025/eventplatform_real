'use client'

import { useState } from 'react'
import ProgressBar from './ProgressBar'

export default function SellerRegistrationFormPreview() {
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [genre, setGenre] = useState('')
  const [genreFree, setGenreFree] = useState('')
  const [loading, setLoading] = useState(false)

  return (
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
        background: '#E8F5F5', // スマホフレーム範囲内は薄い青緑（出店者用）
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '0px',
        paddingBottom: '32px',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}>
      {/* プログレスバー */}
      <div style={{
        width: '100%',
        height: '93px',
        marginTop: '32px',
        marginBottom: '16px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)', // Shadow LG
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}>
        <ProgressBar currentStep={1} totalSteps={3} />
      </div>

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
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            height: '44px',
            padding: '0 16px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '15px',
            lineHeight: '44px',
            color: name ? '#2C3E50' : '#6C757D',
            marginBottom: '20px',
            boxSizing: 'border-box',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif'
          }}
          placeholder="例: 山田太郎"
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
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{
              width: '100%',
              height: '44px',
              padding: '0 16px',
              paddingRight: '40px',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '15px',
              lineHeight: '44px',
              color: gender ? '#2C3E50' : '#6C757D',
              boxSizing: 'border-box',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              appearance: 'none',
              cursor: 'pointer'
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
            width: '0',
            height: '0',
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid #6C757D',
            pointerEvents: 'none'
          }} />
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
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{
            width: '100%',
            height: '44px',
            padding: '0 16px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '15px',
            lineHeight: '44px',
            color: age ? '#2C3E50' : '#6C757D',
            marginBottom: '20px',
            boxSizing: 'border-box',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif'
          }}
          placeholder="例: 35"
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
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: '100%',
            height: '44px',
            padding: '0 16px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '15px',
            lineHeight: '44px',
            color: phone ? '#2C3E50' : '#6C757D',
            marginBottom: '20px',
            boxSizing: 'border-box',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif'
          }}
          placeholder="例: 090-1234-5678"
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            height: '44px',
            padding: '0 16px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '15px',
            lineHeight: '44px',
            color: email ? '#2C3E50' : '#6C757D',
            marginBottom: '20px',
            boxSizing: 'border-box',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif'
          }}
          placeholder="例: example@email.com"
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
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={{
              width: '100%',
              height: '44px',
              padding: '0 16px',
              paddingRight: '40px',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '15px',
              lineHeight: '44px',
              color: genre ? '#2C3E50' : '#6C757D',
              boxSizing: 'border-box',
              fontFamily: '"Inter", "Noto Sans JP", sans-serif',
              appearance: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">選択してください</option>
            <option value="food">飲食</option>
            <option value="goods">物販</option>
            <option value="other">その他</option>
          </select>
          <div style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '0',
            height: '0',
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid #6C757D',
            pointerEvents: 'none'
          }} />
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
          value={genreFree}
          onChange={(e) => setGenreFree(e.target.value)}
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '12px 16px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '15px',
            lineHeight: '1.5',
            color: genreFree ? '#2C3E50' : '#6C757D',
            marginBottom: '20px',
            boxSizing: 'border-box',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            resize: 'vertical'
          }}
          placeholder="例: 焼きそば、たこ焼きなど"
        />

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
          border: '2px dashed #5DABA8',
          borderRadius: '8px',
          height: '187px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          position: 'relative',
          background: '#FFFFFF'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '32px', color: '#5DABA8' }}>+</span>
          </div>
          <p style={{
            margin: 0,
            fontSize: '15px',
            color: '#5DABA8',
            fontWeight: 400
          }}>
            画像をアップロード
          </p>
          <p style={{
            margin: '4px 0 0',
            fontSize: '13px',
            color: '#6C757D',
            fontWeight: 400
          }}>
            AI確認機能付き
          </p>
        </div>
        
        {/* 有効期限表示（営業許可証がアップロードされた場合） */}
        <div style={{
          background: '#A8D5BA',
          borderRadius: '8px',
          padding: '9px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{ color: '#A8D5BA', fontSize: '16px', fontWeight: 700 }}>✓</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '15px', color: 'white', fontWeight: 400 }}>有効</p>
            <p style={{ margin: 0, fontSize: '15px', color: 'white', fontWeight: 400 }}>期限: 2025/12/31</p>
          </div>
        </div>

        {/* 車検証 */}
        <label style={{
          display: 'block',
          fontFamily: '"Inter", "Noto Sans JP", sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 700,
          color: '#2C3E50',
          marginBottom: '8px',
          marginTop: '20px'
        }}>
          車検証
        </label>
        <div style={{
          border: '2px dashed #5DABA8',
          borderRadius: '8px',
          height: '187px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          position: 'relative',
          background: '#FFFFFF'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '32px', color: '#5DABA8' }}>+</span>
          </div>
          <p style={{
            margin: 0,
            fontSize: '15px',
            color: '#5DABA8',
            fontWeight: 400
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
          marginBottom: '8px',
          marginTop: '20px'
        }}>
          自動車検査証
        </label>
        <div style={{
          border: '2px dashed #5DABA8',
          borderRadius: '8px',
          height: '187px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          position: 'relative',
          background: '#FFFFFF'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '32px', color: '#5DABA8' }}>+</span>
          </div>
          <p style={{
            margin: 0,
            fontSize: '15px',
            color: '#5DABA8',
            fontWeight: 400
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
          marginBottom: '8px',
          marginTop: '20px'
        }}>
          PL保険
        </label>
        <div style={{
          border: '2px dashed #5DABA8',
          borderRadius: '8px',
          height: '187px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          position: 'relative',
          background: '#FFFFFF'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '32px', color: '#5DABA8' }}>+</span>
          </div>
          <p style={{
            margin: 0,
            fontSize: '15px',
            color: '#5DABA8',
            fontWeight: 400
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
          marginBottom: '8px',
          marginTop: '20px'
        }}>
          火器類配置図
        </label>
        <div style={{
          border: '2px dashed #5DABA8',
          borderRadius: '8px',
          height: '187px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          position: 'relative',
          background: '#FFFFFF'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '32px', color: '#5DABA8' }}>+</span>
          </div>
          <p style={{
            margin: 0,
            fontSize: '15px',
            color: '#5DABA8',
            fontWeight: 400
          }}>
            画像をアップロード
          </p>
        </div>

        {/* 次へ進むボタン */}
        <button
          type="button"
          disabled={loading}
          style={{
            width: '100%',
            height: '52px',
            padding: '0',
            background: loading ? '#CCCCCC' : '#5DABA8', // Secondary Main（出店者用）
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontFamily: '"Inter", "Noto Sans JP", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '52px',
            textAlign: 'center',
            color: '#FFFFFF',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 200ms ease'
          }}
        >
          <span>次へ進む</span>
          <span style={{ fontSize: '12px' }}>›</span>
        </button>
      </div>
      </div>
    </div>
  )
}

