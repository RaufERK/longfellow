import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  try {
    console.log('=== TEST MAIL API ===')
    console.log('SOURCE_MAIL:', process.env.SOURCE_MAIL)
    console.log('TARGET_MAIL:', process.env.TARGET_MAIL)
    console.log('MAIL_SERVER:', process.env.MAIL_SERVER)

    const transporter = nodemailer.createTransport({
      host: 'mail.amasters.pro',
      port: 587,
      secure: false,
      requireTLS: true,
      tls: {
        servername: 'sm30.hosting.reg.ru', // НЕОБХОДИМ! SSL сертификат выдан для *.hosting.reg.ru
      },
      auth: {
        user: process.env.SOURCE_MAIL,
        pass: process.env.MAIL_PASSWORD,
      },
      name: 'amasters.pro',
    })

    // Проверяем соединение
    await transporter.verify()
    console.log('✅ SMTP connection verified')

    // Отправляем тестовое письмо
    const result = await transporter.sendMail({
      from: `"Longfellow Test" <${process.env.SOURCE_MAIL}>`,
      to: process.env.TARGET_MAIL || 'kniga@longfellow.ru',
      subject: `Тест почты - ${new Date().toLocaleString('ru-RU')}`,
      text: `
Это тестовое письмо для проверки настроек SMTP.

Конфигурация:
- Хост: mail.amasters.pro
- Порт: 587
- TLS: да (с servername fix для sm30.hosting.reg.ru)
- От кого: ${process.env.SOURCE_MAIL}
- Кому: ${process.env.TARGET_MAIL}

Время отправки: ${new Date().toLocaleString('ru-RU', {
        timeZone: 'Europe/Moscow',
      })}

---
Отправлено с сайта longfellow.ru
      `.trim(),
    })

    console.log('✅ Email sent:', result.messageId)

    return NextResponse.json({
      success: true,
      message: 'Тестовое письмо отправлено!',
      details: {
        from: process.env.SOURCE_MAIL,
        to: process.env.TARGET_MAIL,
        messageId: result.messageId,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('❌ Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Ошибка отправки письма',
        error: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
