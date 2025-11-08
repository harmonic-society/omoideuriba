import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@omoideuriba.com'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@omoideuriba.com'

interface SendContactConfirmationParams {
  to: string
  name: string
  subject: string
  message: string
}

interface SendContactNotificationParams {
  contactId: string
  name: string
  email: string
  subject: string
  message: string
}

/**
 * お問い合わせ自動返信メールを送信
 */
export async function sendContactConfirmation({
  to,
  name,
  subject,
  message,
}: SendContactConfirmationParams) {
  try {
    console.log('Sending contact confirmation email to:', to)

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: '【思い出売場】お問い合わせを受け付けました',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #ff6b9d;
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .content {
      background-color: #fff;
      padding: 30px;
      border: 2px solid #4a3428;
      border-radius: 0 0 8px 8px;
    }
    .info-box {
      background-color: #f8f5f0;
      border: 2px solid #4a3428;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-label {
      font-weight: bold;
      color: #4a3428;
      margin-bottom: 5px;
    }
    .info-value {
      color: #666;
      margin-bottom: 15px;
    }
    .steps {
      margin: 20px 0;
    }
    .step {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }
    .step-number {
      background-color: #ff6b9d;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #999;
      font-size: 12px;
    }
    a {
      color: #ff6b9d;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 24px;">思い出売場</h1>
  </div>

  <div class="content">
    <p>${name} 様</p>

    <p>この度は、思い出売場へお問い合わせいただきありがとうございます。<br>
    以下の内容でお問い合わせを受け付けました。</p>

    <div class="info-box">
      <div>
        <div class="info-label">件名</div>
        <div class="info-value">${subject}</div>
      </div>

      <div>
        <div class="info-label">お問い合わせ内容</div>
        <div class="info-value" style="white-space: pre-wrap;">${message}</div>
      </div>
    </div>

    <h2 style="color: #4a3428; font-size: 18px;">今後の流れ</h2>

    <div class="steps">
      <div class="step">
        <div class="step-number">1</div>
        <div>
          <strong>内容確認（1〜2営業日）</strong><br>
          <span style="color: #666; font-size: 14px;">担当者がお問い合わせ内容を確認いたします</span>
        </div>
      </div>

      <div class="step">
        <div class="step-number">2</div>
        <div>
          <strong>ご返信（2〜3営業日以内）</strong><br>
          <span style="color: #666; font-size: 14px;">メールにてご返信させていただきます</span>
        </div>
      </div>
    </div>

    <div style="background-color: #fff9e6; border: 2px solid #ffcc00; border-radius: 8px; padding: 15px; margin-top: 20px;">
      <p style="margin: 0; font-size: 14px;">
        <strong>📧 メールが届かない場合</strong><br>
        迷惑メールフォルダをご確認いただくか、ドメイン受信設定をご確認ください。
      </p>
    </div>

    <p style="margin-top: 30px;">
      このメールは自動送信されています。<br>
      このメールに返信されても対応できませんので、ご了承ください。
    </p>
  </div>

  <div class="footer">
    <p>思い出売場<br>
    <a href="https://omoideuriba.com">https://omoideuriba.com</a></p>
  </div>
</body>
</html>
      `,
    })

    console.log('Contact confirmation email sent:', result)
    return result
  } catch (error) {
    console.error('Failed to send contact confirmation email:', error)
    // メール送信失敗はエラーとして投げずにログに記録のみ
    // お問い合わせ自体は保存されているため
    return null
  }
}

/**
 * 管理者への新規お問い合わせ通知メールを送信
 */
export async function sendContactNotification({
  contactId,
  name,
  email,
  subject,
  message,
}: SendContactNotificationParams) {
  try {
    console.log('Sending contact notification to admin:', ADMIN_EMAIL)

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `【思い出売場】新規お問い合わせ: ${subject}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #6366f1;
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .content {
      background-color: #fff;
      padding: 30px;
      border: 2px solid #4a3428;
      border-radius: 0 0 8px 8px;
    }
    .info-box {
      background-color: #f8f5f0;
      border: 2px solid #4a3428;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-label {
      font-weight: bold;
      color: #4a3428;
      margin-bottom: 5px;
    }
    .info-value {
      color: #666;
      margin-bottom: 15px;
    }
    .button {
      display: inline-block;
      background-color: #6366f1;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 24px;">🔔 新規お問い合わせ</h1>
  </div>

  <div class="content">
    <p>新しいお問い合わせが届きました。</p>

    <div class="info-box">
      <div>
        <div class="info-label">お名前</div>
        <div class="info-value">${name}</div>
      </div>

      <div>
        <div class="info-label">メールアドレス</div>
        <div class="info-value">${email}</div>
      </div>

      <div>
        <div class="info-label">件名</div>
        <div class="info-value">${subject}</div>
      </div>

      <div>
        <div class="info-label">お問い合わせ内容</div>
        <div class="info-value" style="white-space: pre-wrap;">${message}</div>
      </div>
    </div>

    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://omoideuriba.com'}/admin/contacts/${contactId}" class="button">
      管理画面で確認する
    </a>
  </div>

  <div class="footer">
    <p>思い出売場 管理システム</p>
  </div>
</body>
</html>
      `,
    })

    console.log('Contact notification sent to admin:', result)
    return result
  } catch (error) {
    console.error('Failed to send contact notification:', error)
    return null
  }
}
