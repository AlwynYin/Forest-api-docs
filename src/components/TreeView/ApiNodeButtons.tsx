import React, { useState } from 'react';
import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import BugReportIcon from '@mui/icons-material/BugReport';
import { ApiEndpoint } from '../../utils/apiParser';

interface ApiNodeButtonsProps {
  endpoint: ApiEndpoint;
  baseUrl?: string;
  onTest?: (endpoint: ApiEndpoint) => void;
  onViewSchema?: (endpoint: ApiEndpoint) => void;
}

export const ApiNodeButtons: React.FC<ApiNodeButtonsProps> = ({ 
  endpoint, 
  baseUrl = '',
  onTest,
  onViewSchema
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTest = () => {
    if (onTest) {
      onTest(endpoint);
    } else {
      // Default behavior - could open a test modal or console log
      console.log('Testing endpoint:', endpoint);
    }
    handleClose();
  };

  const handleCopyCurl = () => {
    const curl = generateCurlCommand();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(curl);
      alert('cURL command copied to clipboard!');
    } else {
      alert(`cURL command:\n${curl}`);
    }
    handleClose();
  };

  const handleCopyUrl = () => {
    const url = `${baseUrl}${endpoint.path}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('Endpoint URL copied to clipboard!');
    } else {
      alert(`Endpoint URL: ${url}`);
    }
    handleClose();
  };

  const handleViewSchema = () => {
    if (onViewSchema) {
      onViewSchema(endpoint);
    } else {
      // Default behavior - could open a schema modal or console log
      console.log('Viewing schema for:', endpoint);
    }
    handleClose();
  };

  const generateCurlCommand = () => {
    let curl = `curl -X ${endpoint.method}`;
    
    // Add URL
    let url = `${baseUrl}${endpoint.path}`;
    curl += ` "${url}"`;

    // Add common headers
    curl += ` -H "Content-Type: application/json"`;
    curl += ` -H "Accept: application/json"`;

    // Add sample request body for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && endpoint.requestBody) {
      curl += ` -d '{}'`;  // Placeholder for request body
    }

    return curl;
  };

  // For now, we don't have parent/child navigation like Forest
  // Instead we focus on API-specific operations

  return (
    <div
      style={{
        height: '2rem',
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingBottom: '5px',
        marginBottom: '10px',
        position: 'relative'
      }}
    >
      {/* Test Button (left side) */}
      <Button
        size="small"
        variant="contained"
        onClick={handleTest}
        startIcon={<PlayArrowIcon />}
        style={{
          position: 'absolute',
          left: '0',
          width: "35%",
          backgroundColor: theme.palette.success.main
        }}
      >
        Test
      </Button>

      {/* Operations Menu (center) */}
      <Button
        variant="contained"
        size="small"
        onClick={handleClick}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: "8%",
          minWidth: '40px',
          backgroundColor: theme.palette.primary.light
        }}
      >
        <BlurOnIcon />
      </Button>

      {/* View Schema Button (right side) */}
      <Button
        size="small"
        variant="contained"
        onClick={handleViewSchema}
        startIcon={<DescriptionIcon />}
        style={{
          position: 'absolute',
          right: '0',
          width: "35%",
          backgroundColor: theme.palette.info.main
        }}
      >
        Schema
      </Button>

      {/* Operations Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleTest}>
          <ListItemIcon>
            <PlayArrowIcon />
          </ListItemIcon>
          <ListItemText>Test Endpoint</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleCopyCurl}>
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText>Copy cURL</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleCopyUrl}>
          <ListItemIcon>
            <ContentCopyIcon />
          </ListItemIcon>
          <ListItemText>Copy URL</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleViewSchema}>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText>View Schema</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => {
          // TODO: Add endpoint to testing collection
          handleClose();
        }}>
          <ListItemIcon>
            <BugReportIcon />
          </ListItemIcon>
          <ListItemText>Add to Test Suite</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};