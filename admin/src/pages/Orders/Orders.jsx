import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  Grid, 
  Container,
  Paper,
  FormControl,
  Divider,
  Pagination,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

// Simple, classic styling
const OrderPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '4px',
  border: '1px solid #ddd',
  overflow: 'hidden',
}));

const OrderHeader = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFF5F2',
  color: 'tomato',
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const OrderContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
}));

// Added OrdersContainer to handle fixed height and scrolling
const OrdersContainer = styled(Box)(({ theme }) => ({
  height: '73vh', // Slightly reduced height to accommodate pagination
  overflowY: 'auto', // Enable vertical scrolling
  scrollbarWidth: 'none', // Hide scrollbar for Firefox
  '&::-webkit-scrollbar': {
    display: 'none', // Hide scrollbar for Chrome/Safari/Edge
  },
  msOverflowStyle: 'none', // Hide scrollbar for IE
}));

// Updated PaginationContainer with matching colors
const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 1),
  marginTop: theme.spacing(1),
  backgroundColor: 'white',
  // borderRadius: '8px',
  // border: '1px solid tomato',
}));

// Updated PerPageSelect with matching colors
const PerPageSelect = styled(FormControl)(({ theme }) => ({
  // '& .MuiOutlinedInput-root': {
  //   backgroundColor: 'white',
  //   borderRadius: '4px',
  //   boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  //   border: '1px solid tomato', // Tomato border to match
  //   height: '36px',
  //   '&:hover': {
  //     borderColor: 'tomato', // Keep tomato on hover
  //   },
  //   '&.Mui-focused': {
  //     borderColor: 'tomato', // Keep tomato when focused
  //     boxShadow: '0 0 0 3px rgba(255, 99, 71, 0.1)', // Tomato shadow
  //   }
  // },
  // '& .MuiSelect-select': {
  //   fontSize: '0.875rem',
  //   fontWeight: 500,
  //   color: 'tomato', // Tomato text color
  // },
}));

// Updated StyledPagination with matching colors
const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    color: 'tomato', // Tomato text color
    fontWeight: 500,
    fontSize: '0.9rem',
    minWidth: '36px',
    height: '36px',
    margin: '0 2px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: 'rgba(255, 99, 71, 0.1)', // Light tomato on hover
    },
  },
  '& .MuiPaginationItem-page.Mui-selected': {
    backgroundColor: '#FFF5F2', // Tomato background for selected
    color: 'tomato',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#FFF5F2', // Darker tomato on hover
    },
  },
  '& .MuiPaginationItem-previousNext': {
    borderRadius: '4px',
    border: '1px solid tomato', // Tomato border
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: '#FFF5F2', // Matching the order header background
    },
  },
}));

// Updated PaginationInfo with matching colors
const PaginationInfo = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: 'tomato', // Tomato text color
  fontWeight: 500,
}));
const StatusSelect = styled(FormControl)(({ theme }) => ({
  minWidth: 140,
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
    height: '36px',
    fontSize: '0.9rem',
  }
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.5),
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginRight: theme.spacing(1),
  fontSize: '0.9rem',
  color: '#555',
  minWidth: '70px',
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: '#333',
}));

const ItemRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 0),
  borderBottom: '1px solid #eee',
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  marginBottom: theme.spacing(1),
  color: '#4b6584',
}));

const StatusBadge = styled(Box)(({ status }) => {
  let bgColor = '#e67e22';
  
  if (status === 'Out for delivery') {
    bgColor = '#3498db';
  } else if (status === 'Delivered') {
    bgColor = '#2ecc71';
  }
  
  return {
    backgroundColor: bgColor,
    color: 'white',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 600,
    display: 'inline-block',
  };
});

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        const allOrders = response.data.data.reverse();
        setOrders(allOrders);
        setTotalPages(Math.ceil(allOrders.length / rowsPerPage));
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Status updated!");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page when changing rows per page
    setTotalPages(Math.ceil(orders.length / parseInt(event.target.value, 10)));
  };

  // Get current page orders
  const getCurrentPageOrders = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return orders.slice(startIndex, endIndex);
  };

  // Calculate display range for pagination info
  const calculateDisplayRange = () => {
    const start = (page - 1) * rowsPerPage + 1;
    const end = Math.min(page * rowsPerPage, orders.length);
    return { start, end };
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      setTotalPages(Math.ceil(orders.length / rowsPerPage));
    }
  }, [orders, rowsPerPage]);

  const { start, end } = calculateDisplayRange();

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
        Orders
      </Typography>
      
      {/* Added OrdersContainer here */}
      <OrdersContainer>
        {getCurrentPageOrders().map((order, index) => (
          <OrderPaper key={index} elevation={0}>
            {/* Order Header */}
            <OrderHeader>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src={assets.parcel_icon} alt="" width="24" style={{ marginRight: '8px' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Order #{order._id?.substring(order._id.length - 6).toUpperCase()}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <StatusBadge status={order.status}>
                  {order.status}
                </StatusBadge>
                
                <StatusSelect size="small">
                  <Select
                    value={order.status}
                    onChange={(e) => statusHandler(e, order._id)}
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value="Food Processing">Food Processing</MenuItem>
                    <MenuItem value="Out for delivery">Out for delivery</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                  </Select>
                </StatusSelect>
              </Box>
            </OrderHeader>
            
            {/* Order Content */}
            <OrderContent>
              <Grid container spacing={2}>
                {/* Customer Information */}
                <Grid item xs={12} md={6}>
                  <SectionTitle>Customer Information</SectionTitle>
                  
                  <InfoRow>
                    <InfoLabel>Name:</InfoLabel>
                    <InfoValue>
                      {order.address.firstName + " " + order.address.lastName}
                    </InfoValue>
                  </InfoRow>
                  
                  <InfoRow>
                    <InfoLabel>Address:</InfoLabel>
                    <Box>
                      <InfoValue>{order.address.street}</InfoValue>
                      <InfoValue>
                        {`${order.address.city}, ${order.address.state}, ${order.address.zipcode}`}
                      </InfoValue>
                    </Box>
                  </InfoRow>
                  
                  <InfoRow>
                    <InfoLabel>Phone:</InfoLabel>
                    <InfoValue>{order.address.phone}</InfoValue>
                  </InfoRow>
                </Grid>
                
                {/* Order Summary */}
                <Grid item xs={12} md={6}>
                  <SectionTitle>Order Summary</SectionTitle>
                  
                  <InfoRow>
                    <InfoLabel>Items:</InfoLabel>
                    <InfoValue>{order.items.length}</InfoValue>
                  </InfoRow>
                  
                  <InfoRow>
                    <InfoLabel>Total:</InfoLabel>
                    <InfoValue sx={{ fontWeight: 600, color: '#e74c3c' }}>
                      {currency}{order.amount}
                    </InfoValue>
                  </InfoRow>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <SectionTitle sx={{ fontSize: '0.9rem' }}>Items</SectionTitle>
                  <Paper variant="outlined" sx={{ p: 1, mt: 1, backgroundColor: '#f9f9f9' }}>
                    {order.items.map((item, idx) => (
                      <ItemRow key={idx}>
                        <Typography variant="body2">{item.name}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          × {item.quantity}
                        </Typography>
                      </ItemRow>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            </OrderContent>
          </OrderPaper>
        ))}
      </OrdersContainer>
      
      {/* Enhanced Pagination Controls */}
      <PaginationContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PerPageSelect variant="outlined" size="small">
            <Select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              sx={{ 
                height: '36px', 
                minWidth: '20px',
                fontSize: '0.9rem',
                '& .MuiSelect-select': {
                  padding: '6px 14px',
                },
              }}
              displayEmpty
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </PerPageSelect>
          
          <PaginationInfo>
            Showing {orders.length > 0 ? start : 0}-{end} of {orders.length} orders
          </PaginationInfo>
        </Box>
        
        <StyledPagination 
          count={totalPages} 
          page={page} 
          onChange={handlePageChange} 
          color="primary" 
          shape="rounded"
          size="medium"
          showFirstButton
          showLastButton
        />
      </PaginationContainer>
    </Container>
  );
};

export default Order;