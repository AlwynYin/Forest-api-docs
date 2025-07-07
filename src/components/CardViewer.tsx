import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { parseApiSpec, ApiSpec, ApiEndpoint } from '../utils/apiParser';
import EndpointCard from './EndpointCard';

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

const CardViewer: React.FC = () => {
  const [selectedApi, setSelectedApi] = useState<string>('/mock-api.yaml');
  const [apiSpec, setApiSpec] = useState<ApiSpec | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiChange = (event: SelectChangeEvent<string>) => {
    setSelectedApi(event.target.value);
  };

  const loadApiSpec = async (apiUrl: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const spec = await parseApiSpec(apiUrl);
      setApiSpec(spec);
    } catch (err: any) {
      setError(`Failed to load API specification: ${err.message}`);
      setApiSpec(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApiSpec(selectedApi);
  }, [selectedApi]);

  const selectedApiOption = apiOptions.find(api => api.url === selectedApi);
  const baseUrl = apiSpec?.servers?.[0]?.url || '';

  const groupEndpointsByTag = (endpoints: ApiEndpoint[]) => {
    const grouped: Record<string, ApiEndpoint[]> = {};
    
    endpoints.forEach(endpoint => {
      const tags = endpoint.tags && endpoint.tags.length > 0 ? endpoint.tags : ['General'];
      tags.forEach(tag => {
        if (!grouped[tag]) {
          grouped[tag] = [];
        }
        grouped[tag].push(endpoint);
      });
    });
    
    return grouped;
  };

  const renderEndpointsByTag = () => {
    if (!apiSpec || !apiSpec.endpoints) return null;

    const groupedEndpoints = groupEndpointsByTag(apiSpec.endpoints);
    
    return Object.entries(groupedEndpoints).map(([tag, endpoints]) => (
      <Box key={tag} sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          {tag}
          <Chip 
            label={`${endpoints.length} endpoint${endpoints.length > 1 ? 's' : ''}`}
            size="small"
            sx={{ ml: 2 }}
          />
        </Typography>
        {endpoints.map(endpoint => (
          <EndpointCard
            key={endpoint.id}
            endpoint={endpoint}
            baseUrl={baseUrl}
          />
        ))}
      </Box>
    ));
  };

  return (
    <Box>
      {/* API Selector */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          API Documentation - Card View
        </Typography>
        <FormControl sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel id="api-select-label">Select API</InputLabel>
          <Select
            labelId="api-select-label"
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
        {selectedApiOption && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {selectedApiOption.description}
          </Typography>
        )}
      </Box>

      {/* API Overview */}
      {apiSpec && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h3" gutterBottom>
              {apiSpec.info.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Version: {apiSpec.info.version}
            </Typography>
            {apiSpec.info.description && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {apiSpec.info.description}
              </Typography>
            )}
            {apiSpec.servers && apiSpec.servers.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Base URL:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {apiSpec.servers[0].url}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading API specification...
          </Typography>
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Endpoints */}
      {apiSpec && !loading && (
        <Box>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Endpoints ({apiSpec.endpoints.length})
          </Typography>
          {renderEndpointsByTag()}
        </Box>
      )}

      {/* Empty State */}
      {apiSpec && apiSpec.endpoints.length === 0 && !loading && (
        <Alert severity="info">
          No endpoints found in this API specification.
        </Alert>
      )}
    </Box>
  );
};

export default CardViewer;