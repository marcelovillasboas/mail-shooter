import * as path from 'path'
import * as xlsx from 'xlsx'
import * as nodemailer from 'nodemailer'
import mammoth from 'mammoth'

function readEmailAddresses (filePath: string): string[] {
  const workbook = xlsx.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const sheetData = workbook.Sheets[sheetName]
  return xlsx.utils.sheet_to_json(sheetData, { header: 'A' })
}

async function readCustomMessage (filePath: string): Promise<{ html: string, images: { [key: string]: Buffer } }> {
  const result = await mammoth.convertToHtml({ path: filePath })
  return { html: result.value, images: result.messages as any }
}

async function sendEmails (emailAddresses: string[], message: string, images: { [key: string]: Buffer }) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'marcelosvillasboas@gmail.com',
      pass: 'mfljzrjwubbzckmj'
    }
  })

  for (const row of emailAddresses) {
    const email = Object.values(row)
    const mailOptions = {
      from: 'marcelosvillasboas@gmail.com',
      to: email,
      subject: 'Example',
      html: message,
      attachments: [{ filename: 'image.png', path: path.join(__dirname, 'images', 'image.png') }]
    }

    try {
      const info = await transporter.sendMail(mailOptions)
      console.log(`Email sent to ${email}: ${info.response}`)
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error)
    }
  }

  console.log('ja era viado enviou tudo')
}

async function main () {
  const filePath = path.join(__dirname, '../email_addresses.xlsx')
  const emailAddresses = readEmailAddresses(filePath)

  if (emailAddresses.length === 0) {
    console.log('No email addresses found in the file.')
    return
  }

  const customMessagePath = path.join(__dirname, '../custom_message.docx')
  const { html: customMessage, images } = await readCustomMessage(customMessagePath)

  await sendEmails(emailAddresses, customMessage, images)
}

main().catch((error) => console.error('An error occurred:', error))
