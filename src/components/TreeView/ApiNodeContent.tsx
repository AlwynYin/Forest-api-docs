import React from 'react';
import { ApiEndpoint } from '../../utils/apiParser';
import { ApiNodeBorder } from './ApiNodeBorder';
import { ApiNodeTitle } from './ApiNodeTitle';
import SingleOperationSwagger from './SingleOperationSwagger';

interface ApiNodeContentProps {
  endpoint: ApiEndpoint;
  isSelected: boolean;
  onSelect: (endpoint: ApiEndpoint) => void;
  children?: React.ReactNode;
  baseUrl?: string;
  apiSpec?: any; // The full OpenAPI spec for Swagger UI
}

export const ApiNodeContent: React.FC<ApiNodeContentProps> = ({ 
  endpoint, 
  isSelected, 
  onSelect, 
  children, 
  baseUrl,
  apiSpec
}) => {
  const handleClick = () => {
    onSelect(endpoint);
  };

  return (
    <div
      style={{
        padding: "2px",
        paddingLeft: '10px',
        paddingRight: '10px',
        position: "relative",
      }}
    >
      <ApiNodeBorder isSelected={isSelected} />
      <div
        onClick={handleClick}
        id={`api-node-${endpoint.id}`}
        style={{ cursor: 'pointer' }}
      >
        <ApiNodeTitle endpoint={endpoint} />
        {children}
      </div>
      {apiSpec && (
        <SingleOperationSwagger 
          endpoint={endpoint} 
          apiSpec={apiSpec} 
          baseUrl={baseUrl} 
        />
      )}
    </div>
  );
};