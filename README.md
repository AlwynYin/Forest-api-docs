# Forest API Docs

A prototype API documentation interface with interactive "Try It" functionality, designed for eventual integration with the Forest tree-structured editor. This project demonstrates multiple approaches to API documentation through both traditional Swagger UI and a custom tree-based interface that mirrors Forest's node-based architecture.

## Overview

This project evaluates different approaches to API documentation by implementing:
- **Swagger UI**: Traditional, comprehensive API documentation interface
- **Tree View**: Custom tree-structured interface inspired by Forest's node architecture
- **API Parser**: Utility for parsing OpenAPI 3.0 specifications into tree-like structures

The project serves as a foundation for building an API documentation system that will eventually integrate seamlessly with Forest's tree-based workspace.

## Prerequisites

- **Node.js 20.x** (matches Forest project requirements)
- **pnpm** (package manager)

## Quick Start

```bash
# Clone and navigate to project
cd Forest-api-docs

# Install dependencies
pnpm install
cd server && pnpm install && cd ..

# Start both frontend and backend
pnpm dev:all
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Project Structure

```
Forest-api-docs/
├── src/                          # Frontend React application
│   ├── main.tsx                  # React app entry point
│   ├── App.tsx                   # Main component with tab navigation
│   ├── theme.ts                  # Material-UI theme (matches Forest)
│   ├── components/
│   │   ├── SwaggerViewer.tsx     # Swagger UI integration
│   │   ├── CardViewer.tsx        # Card-based API viewer
│   │   ├── EndpointCard.tsx      # Individual endpoint cards
│   │   └── TreeView/             # Tree-structured API interface
│   │       ├── ApiTreeViewer.tsx # Main tree viewer component
│   │       ├── ApiNodeContent.tsx# Node content with Forest patterns
│   │       ├── ApiNodeTitle.tsx  # Editable node titles
│   │       ├── ApiNodeButtons.tsx# Node action buttons
│   │       └── ApiNodeBorder.tsx # Node visual borders
│   ├── utils/
│   │   └── apiParser.ts          # OpenAPI spec parser
│   └── types/                    # TypeScript type definitions
├── server/                       # Express.js backend
│   ├── index.js                  # REST API server
│   └── package.json              # Server dependencies
├── public/
│   ├── mock-api.yaml            # Forest-specific OpenAPI spec
│   └── petstore-api.yaml        # Swagger Petstore example
├── package.json                  # Main project configuration
├── vite.config.ts               # Vite bundler configuration
└── tsconfig.json                # TypeScript configuration
```

## Technology Stack

### Frontend
- **React 18.2** - UI framework
- **TypeScript 5.2** - Type safety
- **Vite 5.2** - Build tool and dev server
- **Material-UI 7.2** - Component library (matches Forest theme)
- **Swagger UI React 5.26** - Traditional API documentation
- **js-yaml 4.1** - YAML parsing for OpenAPI specs
- **axios 1.10** - HTTP client for API testing

### Backend
- **Express.js 4.21** - HTTP server framework
- **Node.js 20.x** - Runtime environment
- **CORS** - Cross-origin resource sharing

## Available Scripts

```bash
# Development
pnpm dev              # Start frontend only (port 3000)
pnpm dev:server       # Start backend only (port 3001)
pnpm dev:all          # Start both frontend and backend

# Production
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # ESLint code analysis
```

## API Endpoints

The backend provides mock endpoints for testing the documentation interfaces:

### GET /api/hello
Simple health check endpoint.
```json
{ "message": "Hello from Forest API Docs server!" }
```

### GET /api/users
Retrieve list of users.
```json
[
  { "id": 1, "name": "John Doe", "email": "john@example.com" },
  { "id": 2, "name": "Jane Smith", "email": "jane@example.com" }
]
```

### POST /api/users
Create a new user.
**Request body:**
```json
{ "name": "string", "email": "string" }
```

### GET /api/trees
Retrieve tree structures (Forest-specific).
```json
[
  { "id": 1, "name": "Project Planning", "nodes": 15 },
  { "id": 2, "name": "Research Notes", "nodes": 8 }
]
```

### GET /api/trees/{id}
Retrieve specific tree details.

## Documentation Interfaces

### Welcome Tab
- **Path:** `/` → "Welcome" tab
- **Features:** Project overview and getting started information
- **Purpose:** Introduction to the different API documentation approaches

### Swagger UI
- **Path:** `/` → "Swagger UI" tab  
- **Features:** Traditional interface with API selector, comprehensive testing capabilities
- **APIs:** Supports both Mock API and Petstore API specifications
- **Best for:** Comprehensive API exploration and testing with familiar interface

### Tree View (Card UI)
- **Path:** `/` → "Card UI" tab
- **Features:** Three-column layout with API info, endpoint tree, and details panel
- **Components:** Responsive design with mobile-optimized single-column view
- **Purpose:** Forest-inspired tree-structured interface with editable nodes
- **Best for:** Tree-based API organization that mirrors Forest's workspace structure

Both interfaces support multiple OpenAPI specifications loaded from `/public/` directory.

## Development Workflow

### Adding New API Endpoints

1. **Backend:** Add route to `server/index.js`
```javascript
app.get('/api/newEndpoint', (req, res) => {
  res.json({ data: 'response' });
});
```

2. **Documentation:** Update `public/mock-api.yaml`
```yaml
/api/newEndpoint:
  get:
    summary: New endpoint description
    responses:
      '200':
        description: Success response
        content:
          application/json:
            schema:
              type: object
```

### Adding New React Components

1. Create component in `src/components/`
2. Import and use in `App.tsx` or other components
3. Follow Material-UI patterns for consistency

### Modifying Styles

- **Global theme:** Edit `src/theme.ts`
- **Component styles:** Use Material-UI's `sx` prop
- **Global CSS:** Edit `src/index.css`

## Configuration

### Environment Variables
Create `.env` files for environment-specific configuration:
```bash
# Backend port (default: 3001)
PORT=3001

# Frontend port configured in vite.config.ts (default: 3000)
```

### CORS Configuration
The backend enables CORS for all origins in development. For production, configure specific origins in `server/index.js`.

## Integration with Forest

### Current Integration Points
- **Theming:** Already matches Forest's Material-UI theme (`#4e89c0` primary color)
- **Component patterns:** Borrowed NodeContentFrame and similar patterns from Forest
- **Architecture:** Tree-based structure mirrors Forest's node architecture
- **TypeScript:** Consistent typing patterns with Forest codebase

### Component Reuse from Forest
- **NodeContentFrame pattern:** Used in ApiTreeViewer for consistent layout
- **Editable titles:** ApiNodeTitle component inspired by Forest's NodeTitle
- **Three-column layout:** Similar to Forest's TreeView structure
- **Material-UI components:** Consistent component library and styling

### Future Development
- **State management:** Integration with Forest's Jotai state management
- **Authentication:** Integration with Forest's Supabase auth system
- **Component embedding:** API documentation cards within Forest tree nodes
- **Enhanced "Try It" forms:** Forest-specific features for API testing
- **Real-time collaboration:** Shared API documentation editing
- **Tree-based organization:** Hierarchical API documentation structure

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check port usage
lsof -i :3000
lsof -i :3001

# Kill processes if needed
pkill -f "vite"
pkill -f "nodemon"
```

**Dependency issues:**
```bash
# Clear package manager cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

**TypeScript errors:**
- Check `tsconfig.json` configuration
- Ensure all dependencies have type definitions
- Use `pnpm build` to check for type errors

**CORS errors:**
- Verify backend is running on port 3001
- Check CORS configuration in `server/index.js`
- Ensure frontend is making requests to correct backend URL

## Performance Considerations

- **Vite HMR:** Fast development with hot module replacement
- **Code splitting:** Automatic with Vite for production builds
- **Tree shaking:** Unused code elimination
- **Asset optimization:** Automatic minification and compression

## Security Notes

- CORS is currently permissive for development
- No authentication implemented (mock endpoints)
- Production deployment requires security hardening
- API endpoints should implement proper validation

## Contributing

1. Follow existing code patterns and TypeScript conventions
2. Use Material-UI components for UI consistency with Forest theme
3. Update OpenAPI specifications when adding endpoints
4. Test all three documentation interfaces when making changes
5. Ensure compatibility with Node.js 20.x and pnpm package manager
6. Follow Forest's component patterns when creating new tree-based components
7. Maintain responsive design for both desktop and mobile interfaces

## License

This is a research prototype for the Forest project. License to be determined based on Forest project requirements.