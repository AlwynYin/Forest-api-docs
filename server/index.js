import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock API endpoints for testing
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Forest API Docs server!' });
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: Date.now(), name, email };
  res.status(201).json(newUser);
});

app.get('/api/trees', (req, res) => {
  res.json([
    { id: 1, name: 'Project Planning', nodes: 15 },
    { id: 2, name: 'Research Notes', nodes: 8 },
    { id: 3, name: 'Meeting Minutes', nodes: 12 }
  ]);
});

app.post('/api/trees', (req, res) => {
  const { name, description } = req.body;
  const newTree = { id: Date.now(), name, description, nodes: 0 };
  res.status(201).json(newTree);
});

app.get('/api/trees/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id: parseInt(id),
    name: 'Sample Tree',
    description: 'A sample tree structure',
    nodes: [
      { id: 1, title: 'Root Node', content: 'This is the root' },
      { id: 2, title: 'Child Node', content: 'This is a child' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});