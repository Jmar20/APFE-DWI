import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { getPasswordStrength } from '../utils/validation';

const PasswordStrengthIndicator = ({ password }) => {
  if (!password) return null;

  const { strength, color, text } = getPasswordStrength(password);
  
  const getProgressValue = () => {
    switch (strength) {
      case 'weak': return 33;
      case 'medium': return 66;
      case 'strong': return 100;
      default: return 0;
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Fortaleza:
        </Typography>
        <Typography variant="caption" color={`${color}.main`} fontWeight="bold">
          {text}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={getProgressValue()}
        color={color}
        sx={{
          height: 4,
          borderRadius: 2,
          backgroundColor: 'action.hover',
        }}
      />
    </Box>
  );
};

export default PasswordStrengthIndicator;
