# OCR Matching Application

This project is a Next.js application built with TypeScript and Tailwind CSS, designed for extracting and matching information from documents using Optical Character Recognition (OCR). The application allows users to upload documents, view OCR results, and edit discrepancies.

## Features

- **File Upload**: Users can upload images or PDFs for OCR processing.
- **OCR Results Display**: The application shows extracted information and matches it against original documents.
- **Manual Editing**: Users can edit OCR results to correct any inaccuracies.
- **Job Management**: Users can track the status of their uploads and view logs.
- **Real-time Updates**: The application supports real-time updates for job status using WebSockets.

## Project Structure

```
ocr-matching-nextjs
├── src
│   ├── app
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx
│   │   ├── upload
│   │   │   └── page.tsx
│   │   ├── results
│   │   │   └── [jobId]
│   │   │       └── page.tsx
│   │   ├── review
│   │   │   └── [jobId]
│   │   │       └── page.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   └── api
│   │       ├── upload
│   │       │   └── route.ts
│   │       └── jobs
│   │           └── [id]
│   │               └── route.ts
│   ├── components
│   │   ├── common
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── upload
│   │   │   └── Dropzone.tsx
│   │   ├── results
│   │   │   ├── MatchTable.tsx
│   │   │   └── StatusBadge.tsx
│   │   └── review
│   │       ├── DiffText.tsx
│   │       └── FieldEditor.tsx
│   ├── context
│   │   └── JobContext.tsx
│   ├── hooks
│   │   ├── useFileUpload.ts
│   │   ├── useJobPolling.ts
│   │   └── useWebSocket.ts
│   ├── lib
│   │   ├── api
│   │   │   ├── client.ts
│   │   │   ├── jobs.ts
│   │   │   └── ocr.ts
│   │   ├── matching.ts
│   │   └── constants.ts
│   ├── types
│   │   ├── index.ts
│   │   ├── job.ts
│   │   ├── ocr.ts
│   │   └── match.ts
│   └── utils
│       ├── diff.ts
│       └── format.ts
├── public
│   └── robots.txt
├── .github
│   └── copilot-instruction.md
├── .env.example
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd ocr-matching-nextjs
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the development server**:
   ```
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.
- **TypeScript**: A superset of JavaScript that adds static types.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **React**: A JavaScript library for building user interfaces.
- **WebSocket**: For real-time communication.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.