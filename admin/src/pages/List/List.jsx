import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  TablePagination,
  styled
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { url, currency } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

// Styled components
const ListContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  padding: theme.spacing(2)
}));

const TableContainerStyled = styled(TableContainer)({
  flex: 1,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  maxHeight: 'calc(100vh - 140px)' // Adjust based on header and pagination height
});

const FoodImage = styled('img')({
  width: 50,
  height: 50,
  objectFit: 'cover',
  borderRadius: '4px'
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  }
}));

// Add global style to prevent body scrolling
const GlobalStyle = () => {
  React.useEffect(() => {
    // Apply style to body when component mounts
    document.body.style.overflow = 'hidden';
    
    // Clean up when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  return null;
};

const List = () => {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      console.log("data", response);
      
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      toast.error("Failed to fetch food list");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.error("Error removing food:", error);
      toast.error("Failed to remove food item");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Calculate displayed rows based on pagination
  const displayedRows = list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <GlobalStyle />
      <ListContainer>
        <Typography variant="h6" gutterBottom>
          All Foods List
        </Typography>
        
        <TableContainerStyled>
          <Table stickyHeader aria-label="food list table">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedRows.map((item, index) => (
                <StyledTableRow key={index}>
                  <TableCell>
                    <FoodImage 
                      src={`${url}/images/${item.image}`}
                      alt={item.name}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{currency}{item.price}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="delete"
                      size="small"
                      color="error"
                      onClick={() => removeFood(item._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainerStyled>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={list.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ListContainer>
    </>
  );
};

export default List;