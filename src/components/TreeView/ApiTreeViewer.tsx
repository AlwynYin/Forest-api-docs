import React, { useState, useEffect } from 'react';
import {
  Card,
  Grid,
  CardContent,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { parseApiSpecWithRaw, ApiSpec, ApiEndpoint } from '../../utils/apiParser';
import { ApiNodeContent } from './ApiNodeContent';

interface ApiOption {
  name: string;
  url: string;
  description: string;
}

const apiOptions: ApiOption[] = [
  {
    name: 'Mock API',
    url: '/mock-api.yaml',
    description: 'Custom API for Forest tree-structured editor'
  },
  {
    name: 'Petstore API',
    url: '/petstore-api.yaml',
    description: 'Swagger Petstore example API with pets, store, and users'
  }
];

const ApiTreeViewer: React.FC = () => {
  const [selectedApi, setSelectedApi] = useState<string>('/mock-api.yaml');
  const [apiSpec, setApiSpec] = useState<ApiSpec | null>(null);
  const [rawApiSpec, setRawApiSpec] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleApiChange = (event: SelectChangeEvent<string>) => {
    setSelectedApi(event.target.value);
  };

  const loadApiSpec = async (apiUrl: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const specWithRaw = await parseApiSpecWithRaw(apiUrl);
      setApiSpec(specWithRaw.parsed);
      setRawApiSpec(specWithRaw.raw);
      setSelectedEndpoint(null); // Reset selection when API changes
    } catch (err: any) {
      setError(`Failed to load API specification: ${err.message}`);
      setApiSpec(null);
      setRawApiSpec(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApiSpec(selectedApi);
  }, [selectedApi]);

  const selectedApiOption = apiOptions.find(api => api.url === selectedApi);
  const baseUrl = apiSpec?.servers?.[0]?.url || '';

  const handleEndpointSelect = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint);
  };

  const handleTestEndpoint = (endpoint: ApiEndpoint) => {
    // TODO: Implement test functionality
    console.log('Testing endpoint:', endpoint);
  };

  const handleViewSchema = (endpoint: ApiEndpoint) => {
    // TODO: Implement schema view functionality
    console.log('Viewing schema for:', endpoint);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading API specification...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!apiSpec || apiSpec.endpoints.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No endpoints found in this API specification.
        </Alert>
      </Box>
    );
  }

  return (
    <Grid style={{ height: "100%", width: "100%" }} container spacing={1}>
      {/* Left Column - API Info */}
      {!isMobile && (
        <Grid size={3.5} style={{ height: "100%" }}>
          <ApiInfoPanel 
            apiSpec={apiSpec}
            selectedApi={selectedApi}
            onApiChange={handleApiChange}
            selectedApiOption={selectedApiOption}
          />
        </Grid>
      )}

      {/* Middle Column - Endpoints List */}
      <Grid size={isMobile ? 12 : 5} style={{ height: "100%" }}>
        <NodeContentFrame>
          <div>
            {/* Mobile API Selector */}
            {isMobile && (
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Select API</InputLabel>
                  <Select
                    value={selectedApi}
                    label="Select API"
                    onChange={handleApiChange}
                  >
                    {apiOptions.map((api) => (
                      <MenuItem key={api.url} value={api.url}>
                        {api.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {apiSpec.endpoints.map((endpoint) => (
              <ApiNodeContent
                key={endpoint.id}
                endpoint={endpoint}
                isSelected={selectedEndpoint?.id === endpoint.id}
                onSelect={handleEndpointSelect}
                baseUrl={baseUrl}
                apiSpec={rawApiSpec}
              >
                <Box sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 1, my: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {endpoint.description || 'No description available'}
                  </Typography>
                </Box>
              </ApiNodeContent>
            ))}
          </div>
        </NodeContentFrame>
      </Grid>

      {/* Right Column - Endpoint Details */}
      {!isMobile && (
        <Grid style={{ height: "100%" }} size={3.5}>
          <EndpointDetailsPanel 
            endpoint={selectedEndpoint}
            baseUrl={baseUrl}
          />
        </Grid>
      )}
    </Grid>
  );
};

// Copied from Forest's NodeContentFrame
const NodeContentFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sxDefault = {
    width: "100%",
    height: "100%",
    overflowY: 'auto',
    overflowX: 'hidden',
    wordBreak: "break-word",
    backgroundColor: '#f4f4f4'
  };

  return (
    <Card sx={sxDefault}>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

// Left column component
const ApiInfoPanel: React.FC<{
  apiSpec: ApiSpec;
  selectedApi: string;
  onApiChange: (event: SelectChangeEvent<string>) => void;
  selectedApiOption?: ApiOption;
}> = ({ apiSpec, selectedApi, onApiChange, selectedApiOption }) => {
  return (
    <NodeContentFrame>
      <Box>
        <Typography variant="h6" gutterBottom>
          API Information
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select API</InputLabel>
          <Select
            value={selectedApi}
            label="Select API"
            onChange={onApiChange}
          >
            {apiOptions.map((api) => (
              <MenuItem key={api.url} value={api.url}>
                {api.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedApiOption && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedApiOption.description}
          </Typography>
        )}

        <Typography variant="h6" sx={{ mb: 1 }}>
          {apiSpec.info.title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Version: {apiSpec.info.version}
        </Typography>
        {apiSpec.info.description && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {apiSpec.info.description}
          </Typography>
        )}
        {apiSpec.servers && apiSpec.servers.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Base URL:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#f0f0f0', p: 1, borderRadius: 1 }}>
              {apiSpec.servers[0].url}
            </Typography>
          </Box>
        )}
        
        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Total Endpoints: {apiSpec.endpoints.length}
        </Typography>
      </Box>
    </NodeContentFrame>
  );
};

// Right column component
const EndpointDetailsPanel: React.FC<{
  endpoint: ApiEndpoint | null;
  baseUrl: string;
}> = ({ endpoint, baseUrl }) => {
  return (
    <NodeContentFrame>
      <Box>
        <Typography variant="h6" gutterBottom>
          Endpoint Details
        </Typography>
        
        {endpoint ? (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {endpoint.method} {endpoint.path}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {endpoint.summary}
            </Typography>
            {endpoint.description && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                {endpoint.description}
              </Typography>
            )}
            {endpoint.tags && endpoint.tags.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Tags:
                </Typography>
                {endpoint.tags.map(tag => (
                  <Typography key={tag} variant="body2" component="span" sx={{ 
                    bgcolor: '#e3f2fd', 
                    px: 1, 
                    py: 0.5, 
                    borderRadius: 1, 
                    mr: 1,
                    display: 'inline-block',
                    mb: 0.5
                  }}>
                    {tag}
                  </Typography>
                ))}
              </Box>
            )}
            <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#f0f0f0', p: 1, borderRadius: 1 }}>
              {baseUrl}{endpoint.path}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Select an endpoint to view details
          </Typography>
        )}
      </Box>
    </NodeContentFrame>
  );
};

export default ApiTreeViewer;