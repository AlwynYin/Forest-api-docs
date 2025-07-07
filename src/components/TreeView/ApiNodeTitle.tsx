import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Chip, Box } from "@mui/material";
import { ApiEndpoint } from "../../utils/apiParser";

interface ApiNodeTitleProps {
  endpoint: ApiEndpoint;
  allowEditNotes?: boolean;
}

const getMethodColor = (method: string) => {
  const colors = {
    GET: '#61affe',
    POST: '#49cc90', 
    PUT: '#fca130',
    DELETE: '#f93e3e',
    PATCH: '#50e3c2',
    OPTIONS: '#0d5aa7',
    HEAD: '#9012fe'
  };
  return colors[method as keyof typeof colors] || '#888';
};

export const ApiNodeTitle: React.FC<ApiNodeTitleProps> = ({ 
  endpoint, 
  allowEditNotes = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    // Initialize notes from endpoint description or summary
    setNotes(endpoint.description || endpoint.summary || "");
  }, [endpoint]);

  const handleDoubleClick = () => {
    if (allowEditNotes) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Here you could save notes to local storage or API if needed
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <Box sx={{ mb: 1 }}>
      {/* HTTP Method and Path */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Chip
          label={endpoint.method}
          sx={{
            backgroundColor: getMethodColor(endpoint.method),
            color: 'white',
            fontWeight: 'bold',
            mr: 2,
            minWidth: '60px',
            fontSize: '0.75rem'
          }}
        />
        <Typography
          variant="h6"
          sx={{ 
            fontFamily: 'monospace',
            fontSize: '1rem',
            fontWeight: 500
          }}
        >
          {endpoint.path}
        </Typography>
      </Box>

      {/* Editable Notes/Summary */}
      {isEditing ? (
        <TextField
          value={notes}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyUp={handleKeyPress}
          variant="standard"
          fullWidth
          autoFocus
          placeholder="Add notes or description..."
          multiline
          maxRows={3}
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '0.9rem',
              fontWeight: 400,
              lineHeight: 1.4,
            }
          }}
        />
      ) : (
        <Typography
          variant="body2"
          onDoubleClick={allowEditNotes ? handleDoubleClick : undefined}
          sx={{ 
            paddingBottom: "5px", 
            cursor: allowEditNotes ? "pointer" : "default",
            color: notes ? 'text.primary' : 'text.secondary',
            fontStyle: notes ? 'normal' : 'italic',
            minHeight: '20px'
          }}
        >
          {notes || (allowEditNotes ? "Double-click to add notes..." : endpoint.summary)}
        </Typography>
      )}
    </Box>
  );
};