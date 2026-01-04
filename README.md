# VizDrop - Data Visualization Tool

A modern, production-ready web application for creating interactive data visualizations from CSV and Excel files. Everything runs locally in your browser—no uploads, no servers, fully private.

## Features

- 🎯 **Multiple File Formats**: Support for CSV and Excel (XLSX) files
- 📊 **Smart Visualizations**: Auto-generate charts based on your data types
- 🎨 **Beautiful UI**: Modern design with glassmorphism effects and smooth animations
- 🌓 **Theme Support**: Light and dark mode with system preference detection
- 🔍 **Data Insights**: Automatic detection of missing values, outliers, and correlations
- 📈 **Interactive Charts**: Bar, line, area, pie, scatter, and histogram charts
- 🔧 **Chart Builder**: Manual chart creation with customizable axes, aggregations, and date bucketing
- 📋 **Data Table**: Sortable, searchable data grid with pagination
- ⚡ **Fast & Private**: All processing happens client-side—no data leaves your browser

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: TailwindCSS with custom glassmorphism styles
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts for visualization
- **Data Grid**: TanStack Table
- **File Parsing**: Papa Parse (CSV), SheetJS (Excel)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd data-visualization
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

The easiest way to deploy VizDrop is using [Vercel](https://vercel.com):

**Option 1: Via Vercel Dashboard (Recommended)**
1. Push your code to GitHub (already done!)
2. Visit [Vercel Dashboard](https://vercel.com/new)
3. Click "Import Git Repository" and select `draphael123/data-visualization`
4. Vercel will automatically detect Next.js and configure the build settings
5. Click "Deploy" - Vercel will build and deploy your app!

**Option 2: Via Vercel CLI**
```bash
npm i -g vercel
vercel
```

**Note**: The build may show warnings during static page generation (this is normal for client-side apps). The deployment will still succeed and the app will work correctly at runtime.

Your app is already deployed at: https://data-visualization-*.vercel.app (check your Vercel dashboard for the exact URL)

The app is fully compatible with Vercel's Edge runtime. All file processing happens client-side, so there are no server-side constraints.

## Usage

### Loading Data

1. **Drag & Drop**: Drag CSV or Excel files directly onto the dropzone
2. **Click to Browse**: Click the dropzone to open a file browser
3. **Sample Dataset**: Click "Try Sample Dataset" to load a pre-configured example

### Creating Visualizations

#### Auto-Generated Charts

1. Load a dataset
2. Click "Load Recommended" in the dashboard
3. Charts are automatically generated based on your data types:
   - Numeric + Date → Time series line chart
   - Numeric + Category → Bar chart
   - Two numeric columns → Scatter plot
   - Single numeric column → Histogram

#### Manual Chart Builder

1. Click "Create Chart" in the dashboard
2. Select chart type (bar, line, area, pie, scatter, histogram)
3. Choose X-axis and Y-axis columns
4. Configure aggregation (sum, average, count, min, max)
5. Set date bucketing if using date columns
6. Click "Create Chart"

### Working with Charts

- **Edit Title**: Click on a chart title to edit it inline
- **Download PNG**: Use the dropdown menu on any chart to download as PNG
- **Copy Config**: Copy the chart configuration as JSON
- **Remove Chart**: Delete charts from the dropdown menu

### Data Insights

The insights panel automatically displays:
- **Missing Values**: Columns with high percentages of null values
- **Outliers**: Numeric columns with potential outliers (IQR method)
- **Correlations**: Strong correlations between numeric columns

### Data Table

- **Search**: Use the search box to filter rows
- **Sort**: Click column headers to sort
- **Pagination**: Navigate through pages using Previous/Next buttons

## Supported Formats

### CSV

- Standard comma-separated values
- First row as headers (automatic detection)
- Supports UTF-8 encoding
- Handles quoted fields and escaped characters

### Excel (XLSX)

- Multiple sheets supported (each sheet becomes a separate dataset)
- First row as headers
- Supports standard Excel data types
- Compatible with Excel 2007+ format

## Limitations

- **File Size**: Very large files (>100k rows) may cause performance issues. A warning is displayed for large datasets.
- **Memory**: All data is loaded into browser memory. Extremely large datasets may cause browser slowdowns.
- **Chart Types**: Currently supports bar, line, area, pie, scatter, and histogram charts
- **Transformations**: Data transformations are view-based (non-destructive) but not yet fully implemented in the UI
- **Excel Features**: Advanced Excel features (formulas, macros, charts) are not supported—only raw data is extracted

## Development

### Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Landing page
│   └── dashboard/         # Dashboard page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── ChartBuilder.tsx  # Chart creation form
│   ├── ChartCard.tsx     # Individual chart card
│   ├── ChartGrid.tsx     # Grid of charts
│   ├── ChartRenderer.tsx # Chart rendering logic
│   ├── DataTable.tsx     # Data grid component
│   ├── DatasetList.tsx   # Dataset sidebar
│   ├── Dropzone.tsx      # File upload zone
│   └── InsightsPanel.tsx # Insights sidebar
├── lib/                   # Utility libraries
│   ├── charts.ts         # Chart generation and utilities
│   ├── parse.ts          # File parsing (CSV/Excel)
│   ├── profile.ts        # Type inference and profiling
│   ├── transform.ts      # Data transformations
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # General utilities
├── store/                 # State management
│   └── store.ts          # Zustand store
└── public/
    └── samples/          # Sample datasets
```

### Running Tests

```bash
npm test
# or
yarn test
# or
pnpm test
```

### Type Checking

```bash
npm run build
# or check with TypeScript directly
npx tsc --noEmit
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide](https://lucide.dev/)

