import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { Box, List, ListItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components with enhanced professional styling
const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '18%',
  minHeight: '90vh',
  border: '1.5px solid #EAEAEA',
  borderTop: 0,
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
  backgroundColor: '#FFFFFF',
  borderRadius: '0 0 4px 4px',
}));

const SidebarOptions = styled(List)(({ theme }) => ({
  paddingTop: '50px',
  paddingLeft: '20%',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
}));

const SidebarOption = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  border: '1px solid #EAEAEA',
  borderRight: 0,
  padding: '12px 16px',
  borderRadius: '6px 0px 0px 6px',
  cursor: 'pointer',
  fontSize: 'max(1vw, 10px)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: '#F9F9F9',
    borderColor: '#E0E0E0',
    transform: 'translateX(5px)',
  },
  '&.active': {
    backgroundColor: '#FFF5F2',
    borderColor: 'tomato',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      width: '4px',
      backgroundColor: 'tomato',
    },
  },
  '& img': {
    width: '22px',
    height: '22px',
    transition: 'transform 0.2s ease',
  },
  '&:hover img': {
    transform: 'scale(1.1)',
  },
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
    borderRadius: '6px',
    padding: '14px 10px',
    '& p': {
      display: 'none',
    },
  },
}));

// Enhanced typography for menu items
const MenuText = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '14px',
  letterSpacing: '0.1px',
  color: '#505050',
  '.active &': {
    color: '#FF6347',
    fontWeight: 600,
  },
}));

// NavLink wrapper to apply active styling
const StyledNavLink = styled(NavLink)({
  textDecoration: 'none',
  color: 'inherit',
  width: '100%',
});

const Sidebar = () => {
  return (
    <SidebarContainer>
      <SidebarOptions>
        <StyledNavLink to='/add'>
          {({ isActive }) => (
            <SidebarOption className={isActive ? 'active' : ''}>
              <img src={assets.add_icon} alt="" />
              <MenuText component="p">Add Items</MenuText>
            </SidebarOption>
          )}
        </StyledNavLink>
        
        <StyledNavLink to='/list'>
          {({ isActive }) => (
            <SidebarOption className={isActive ? 'active' : ''}>
              <img src={assets.order_icon} alt="" />
              <MenuText component="p">List Items</MenuText>
            </SidebarOption>
          )}
        </StyledNavLink>
        
        <StyledNavLink to='/orders'>
          {({ isActive }) => (
            <SidebarOption className={isActive ? 'active' : ''}>
              <img src={assets.order_icon} alt="" />
              <MenuText component="p">Orders</MenuText>
            </SidebarOption>
          )}
        </StyledNavLink>
      </SidebarOptions>
    </SidebarContainer>
  );
};

export default Sidebar;