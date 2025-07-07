import { Box, Typography, Container, AppBar, Toolbar, Tabs, Tab, Card, CardContent } from '@mui/material'
import { useState } from 'react'
import SwaggerViewer from './components/SwaggerViewer'
import ApiTreeViewer from './components/TreeView/ApiTreeViewer'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`api-docs-tabpanel-${index}`}
      aria-labelledby={`api-docs-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Forest API Docs
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="API documentation tabs">
            <Tab label="Welcome" id="api-docs-tab-0" />
            <Tab label="Swagger UI" id="api-docs-tab-1" />
            <Tab label="Card UI" id="api-docs-tab-2" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h2" component="h1" gutterBottom>
            Forest API Documentation
          </Typography>
          <Typography variant="body1" paragraph>
            Interactive API documentation prototype with Try It functionality
          </Typography>
          
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Getting Started
              </Typography>
              <Typography variant="body1" paragraph>
                Welcome to the Forest API documentation prototype. This interface evaluates different approaches to API documentation for eventual integration with the Forest tree-structured editor.
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Swagger UI:</strong> Traditional, widely-used API documentation interface with comprehensive testing capabilities. Includes an API selector to switch between different API specifications.
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Card UI:</strong> Custom card-based interface designed specifically for Forest integration (work in progress)
              </Typography>
              <Typography variant="body1" paragraph>
                Use the tabs above to explore the different implementations.
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <SwaggerViewer />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <ApiTreeViewer />
        </TabPanel>
      </Container>
    </Box>
  )
}


export default App