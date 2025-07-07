import React from 'react';

interface ApiNodeBorderProps {
  isSelected: boolean;
}

export const ApiNodeBorder: React.FC<ApiNodeBorderProps> = ({ isSelected }) => {
  if (!isSelected) {
    return null;
  }

  const lineWidth = "3px";
  const lineStyle = {
    position: 'absolute' as const,
    left: '0',
    top: '0',
    width: '100%',
    height: lineWidth,
    backgroundColor: '#dadada'
  };

  return (
    <>
      <div style={{ ...lineStyle, top: '0' }}></div>
      <div style={{ ...lineStyle, width: lineWidth, height: '100%' }}></div>
      <div style={{ ...lineStyle, width: lineWidth, height: '100%', left: `calc(100% - ${lineWidth})` }}></div>
      <div style={{ ...lineStyle, top: '100%' }}></div>
    </>
  );
};