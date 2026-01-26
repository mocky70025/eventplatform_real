'use client'

export default function EmailSent() {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#FFF5F0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 16px',
      paddingTop: '32px'
    }}>
      {/* メインコンテンツ */}
      <div style={{
        width: '100%',
        maxWidth: '393px',
        background: 'white',
        borderRadius: '16px',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '2px solid #4285F4'
      }}>
        {/* ロゴ */}
        <div style={{
          width: '80px',
            height: '80px',
            background: '#5DABA8',
          borderRadius: '12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px'
        }}>🚚</div>

        {/* アプリ名 */}
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#000000',
          margin: '0 0 8px',
          textAlign: 'center'
        }}>
          デミセル
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#666666',
          margin: '0 0 24px',
          textAlign: 'center'
        }}>
          出店者向けプラットフォーム
        </p>

        <div style={{
          width: '100%',
          height: '1px',
          background: '#E9ECEF',
          marginBottom: '24px'
        }} />

        {/* メッセージ */}
        <h2 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#000000',
          margin: '0 0 16px',
          textAlign: 'center'
        }}>
          メールを送信しました
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#000000',
          margin: '0 0 8px',
          textAlign: 'center'
        }}>
          確認メールを送信しました
        </p>
        <p style={{
          fontSize: '14px',
          color: '#000000',
          margin: '0 0 8px',
          textAlign: 'center'
        }}>
          メール内のリンクをクリックして
        </p>
        <p style={{
          fontSize: '14px',
          color: '#000000',
          margin: '0 0 24px',
          textAlign: 'center'
        }}>
          登録を完了してください
        </p>

        <div style={{
          width: '100%',
          height: '1px',
          background: '#E9ECEF',
          marginBottom: '24px'
        }} />

        {/* メールが届かない場合 */}
        <div style={{
          width: '100%',
          padding: '20px',
          background: '#F5F5F5',
          borderRadius: '8px'
        }}>
          <p style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#000000',
            margin: '0 0 12px',
            textAlign: 'left'
          }}>
            メールが届かない場合
          </p>
          <p style={{
            fontSize: '12px',
            color: '#000000',
            margin: '0 0 4px',
            textAlign: 'left'
          }}>
            迷惑メールフォルダをご確認ください
          </p>
          <p style={{
            fontSize: '12px',
            color: '#000000',
            margin: '0 0 12px',
            textAlign: 'left'
          }}>
            それでもメールを確認できない場合
          </p>
          <p style={{
            fontSize: '12px',
            color: '#000000',
            margin: '0 0 16px',
            textAlign: 'left'
          }}>
            再送信ボタンを押してください
          </p>
          <button style={{
            width: '100%',
            padding: '12px',
            background: '#5DABA8',
            color: '#FFFFFF',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            メール再送信
          </button>
        </div>
      </div>
    </div>
  )
}

