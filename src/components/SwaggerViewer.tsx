import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Typography } from '@mui/material';

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

const SwaggerViewer = () => {
  const [selectedApi, setSelectedApi] = useState<string>('/mock-api.yaml');

  const handleApiChange = (event: SelectChangeEvent<string>) => {
    setSelectedApi(event.target.value);
  };

  const selectedApiOption = apiOptions.find(api => api.url === selectedApi);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          API Documentation
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
      
      <SwaggerUI
        url={selectedApi}
        tryItOutEnabled={true}
        deepLinking={true}
        displayOperationId={false}
        defaultModelsExpandDepth={1}
        defaultModelExpandDepth={1}
        defaultModelRendering="example"
        displayRequestDuration={true}
        docExpansion="list"
        filter={true}
        showExtensions={true}
        showCommonExtensions={true}
        requestInterceptor={(request: any) => {
          console.log('Request:', request);
          return request;
        }}
        responseInterceptor={(response: any) => {
          console.log('Response:', response);
          return response;
        }}
      />
    </Box>
  );
};

export default SwaggerViewer;