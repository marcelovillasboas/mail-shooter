# Email Sender Application

This is a TypeScript Node.js application that reads email addresses from a `.xlsx` file and sends customized email messages to the recipients. The email messages can include formatted content from a `.docx` file and optionally include image attachments.

## Prerequisites

- Node.js and npm installed on your machine.
- Create a `.xlsx` file named `email_addresses.xlsx` in the project directory with a list of email addresses in column A of the first sheet.
- Create a `.docx` file named `custom_message.docx` in the project directory with the customized message content.
- If you plan to send image attachments, create an `images` directory in the project folder and place your image files there.

## Setup

1. Clone or download this repository.

2. Navigate to the project directory in your terminal.

3. Install the required dependencies by running:

   ```sh
   npm install

4. Configure your email service credentials in the app.ts file:
    - Update 'your-email-service' with your email service (e.g., 'Gmail', 'Outlook', etc.).
    - Replace 'your-email@example.com' with your sender email address.
    - Replace 'your-email-password' with your sender email password or an app-specific password.

5. Configure the environment variables with the following fields:
    ```sh
    MAIL_SERVICE=Gmail
    USER=example@gmail.com
    PASS=xxxxxxxxxx

    SUBJECT=Example
    IMAGE_NAME=image.png
    MAILING_FILE_NAME=email_addresses.xlsx #.xlsx
    MAIL_BODY_FILE=custom_message.docx #docx

## Usage

- Open a terminal and navigate to the project directory.
- Replace the files to write a new email (image, content)
- Run the application using the following command:

    ```sh
    npx ts-node index.ts

## Sending image attachments

1. If you want to send image attachments along with the email messages:
    - Place your image files in the "images" directory within the project folder.
    - Update the filenames and paths in the attachments array within the sendEmails function in the app.ts file.
