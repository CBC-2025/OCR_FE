# OCR Document Matching - Refactored

This application has been refactored to work with a synchronous backend API that returns results directly, removing the need for jobId-based polling and WebSocket connections.

## Key Changes Made

### 1. Context Management
- **Old**: `JobContext` managed a list of jobs with jobId tracking
- **New**: `ResultContext` stores the current result from the most recent upload

### 2. Routing Structure
- **Removed**: 
  - `/results/[jobId]` - parameterized results page
  - `/review/[jobId]` - parameterized review page
  - `/api/jobs/*` - job management APIs
- **Added**: 
  - `/results` - displays current result from context
  - `/review` - edits current result from context

### 3. Upload Flow
- **Old**: Upload → Get jobId → Poll for completion → Show results
- **New**: Upload → Get results directly → Store in context → Navigate to results

### 4. Removed Components/Hooks
- `useJobPolling.ts` - no longer needed for synchronous responses
- `useWebSocket.ts` - no longer needed for real-time updates
- Job-related types and interfaces

### 5. Data Flow
```
Upload Page → Direct API Call → Results Context → Results/Review Pages
```

## How to Use

1. **Upload**: Go to `/upload`, drag and drop your documents
2. **View Results**: Automatically redirected to `/results` to see comparison table
3. **Review & Edit**: Click "Review & Edit" to manually correct any OCR errors
4. **Dashboard**: Overview of current results and quick actions

## API Integration

The frontend now calls the backend API directly:
- `POST /extract_pdf` - Upload document and get results immediately
- `GET /get_image/{path}` - Retrieve cropped images for display

## File Structure Changes

```
src/
├── app/
│   ├── results/
│   │   └── page.tsx          # New: shows current result
│   ├── review/
│   │   └── page.tsx          # New: edits current result
│   └── upload/
│       └── page.tsx          # Updated: stores result in context
├── context/
│   └── JobContext.tsx        # Renamed to ResultContext, simplified
└── components/
    ├── results/
    │   └── MatchTable.tsx     # Updated for new data structure
    └── review/
        ├── FieldEditor.tsx    # Simplified for inline editing
        └── DiffText.tsx       # Updated for comparison display
```

## State Management

Current result is stored in React Context and includes:
- `extractedData`: OCR results from both documents
- `imageFiles`: Paths to generated image crops
- `comparison`: Field-by-field similarity scores
- `uploadedAt`: Timestamp for tracking

## Future Enhancements

To add features like persistent storage, job history, or async processing:
1. Request backend to add record storage and return recordId
2. Add back job/record management in context
3. Implement routes with parameters: `/results/[recordId]`
4. Add dashboard with historical data

## Running the Application

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.