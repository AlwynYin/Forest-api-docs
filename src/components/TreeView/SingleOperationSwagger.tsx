import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { Box, Typography } from '@mui/material';
import { ApiEndpoint } from '../../utils/apiParser';

interface SingleOperationSwaggerProps {
  endpoint: ApiEndpoint;
  apiSpec: any; // The full OpenAPI spec
  baseUrl?: string;
}

const SingleOperationSwagger: React.FC<SingleOperationSwaggerProps> = ({
  endpoint,
  apiSpec,
  baseUrl = ''
}) => {
  // Debug logging
  console.log('SingleOperationSwagger rendering:', { endpoint, hasApiSpec: !!apiSpec });

  // Early return if no API spec
  if (!apiSpec) {
    return (
      <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Loading operation details...
        </Typography>
      </Box>
    );
  }

  // Create a plugin that filters operations to show only the specific endpoint
  const SingleOperationPlugin = () => ({
    statePlugins: {
      spec: {
        wrapSelectors: {
          taggedOperations: (oriSelector: any) => (state: any, ...args: any[]) => {
            const taggedOperations = oriSelector(state, ...args);
            console.log('Original tagged operations:', taggedOperations.toJS());
            
            // Filter to show only the specific endpoint
            const filtered = taggedOperations
              .map((taggedOp: any) => taggedOp
                .update("operations", (ops: any) => ops
                  .filter((op: any) => {
                    const matches = op.get("path") === endpoint.path && 
                                   op.get("method") === endpoint.method.toLowerCase();
                    console.log(`Checking operation: ${op.get("method")} ${op.get("path")} - matches: ${matches}`);
                    return matches;
                  })
                )
              )
              .filter((taggedOp: any) => taggedOp.get("operations").size > 0);
            
            console.log('Filtered tagged operations:', filtered.toJS());
            return filtered;
          }
        }
      }
    }
  });


  return (
    <Box
      sx={{
        '& .swagger-ui': {
          fontFamily: 'inherit',
        },
        '& .swagger-ui .info': {
          display: 'none', // Hide API info section
        },
        '& .swagger-ui .scheme-container': {
          display: 'none', // Hide scheme selector
        },
        '& .swagger-ui .topbar': {
          display: 'none', // Hide top bar
        },
        '& .swagger-ui .tag > h4': {
          display: 'none', // Hide tag titles but keep content
        },
        '& .swagger-ui .opblock-tag': {
          fontSize: '0px', // Hide tag headers by making them invisible
          height: '0px',
          overflow: 'hidden',
        },
        '& .swagger-ui .operation-tag-content': {
          padding: 0,
        },
        '& .swagger-ui .operations-tag': {
          marginBottom: 0,
          paddingBottom: 0,
        },
        '& .swagger-ui .operations-tag > h4': {
          display: 'none', // Hide tag title
        },
        '& .swagger-ui .opblock': {
          marginBottom: '10px',
          border: 'none',
          boxShadow: 'none',
        },
        '& .swagger-ui .opblock-summary': {
          borderTop: 'none',
        },
        '& .swagger-ui .btn': {
          fontSize: '0.8rem',
          padding: '6px 12px',
        },
        minHeight: '100px',
      }}
    >
      <SwaggerUI
        spec={apiSpec}
        plugins={[SingleOperationPlugin]}
        layout="BaseLayout"
        deepLinking={false}
        tryItOutEnabled={true}
        supportedSubmitMethods={['get', 'post', 'put', 'delete', 'patch', 'head', 'options']}
        defaultModelsExpandDepth={0}
        defaultModelExpandDepth={0}
        defaultModelRendering="example"
        docExpansion="none"
        filter={false}
        showExtensions={false}
        showCommonExtensions={false}
        displayRequestDuration={true}
        requestInterceptor={(request: any) => {
          // Update the request URL to use the provided base URL
          if (baseUrl && request.url.startsWith('/')) {
            request.url = baseUrl + request.url;
          }
          return request;
        }}
        responseInterceptor={(response: any) => {
          return response;
        }}
      />
    </Box>
  );
};

export default SingleOperationSwagger;