import React from 'react';
import { AppBar, Toolbar, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { assets } from '../../assets/assets';

// Styled components to maintain the same styling as original
const StyledAppBar = styled(AppBar)({
  backgroundColor: '#fff',
  boxShadow: 'none',
  padding: '8px 4%',
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 !important', // Override default padding
  minHeight: 'unset !important', // Override default min-height
});

const LogoImage = styled('img')({
  width: 'max(10%, 80px)',
});

const Navbar = () => {
  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <LogoImage className="logo" src={assets.logo} alt="" />
        <Avatar 
          className="profile" 
          src={assets.profile_image} 
          alt=""
          sx={{ width: 40, height: 40 }}
        />
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;