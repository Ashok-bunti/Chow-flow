
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  MenuItem, 
  Paper, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  Container,
  ThemeProvider,
  createTheme
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

import { styled } from '@mui/material/styles';
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create a custom theme for a more classic, professional look
const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#34495e',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#6D6D6D',
    }
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
      color: '#2c3e50',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '0.95rem',
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        }
      }
    },
  }
});

// Styled component for the file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadBox = styled(Box)(({ theme }) => ({
  border: '1px dashed #ccc',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  marginBottom: theme.spacing(2),
  backgroundColor: '#f9fafb',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: '#f0f2f5',
  },
  height: 160,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const PageContent = styled(Box)({
  overflowX: 'hidden',
  width: '100%',
  minHeight: '100vh',
  padding: '20px 0',
  backgroundColor: '#f5f7fa',
});

const Add = () => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad"
  });

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.error('Image not selected');
      return null;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);
    
    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          description: "",
          price: "",
          category: data.category
        });
        setImage(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };
  const RupeeSymbol = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginRight: '4px',
    color: '#666',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  return (
    <ThemeProvider theme={theme}>
      <PageContent>
        <Container maxWidth="lg" sx={{ width: '100%', px: { xs: 2, md: 4 } }}>
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              mb: 4, 
              fontWeight: 500, 
              color: 'primary.main',
              borderBottom: '1px solid #eaeaea',
              pb: 2
            }}
          >
            Add New Product
          </Typography>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, sm: 4 },
              borderRadius: 2,
              mb: 4
            }}
          >
            <form onSubmit={onSubmitHandler}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Product Image
                  </Typography>
                  <UploadBox>
                    <VisuallyHiddenInput
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setImage(e.target.files[0]);
                        e.target.value = '';
                      }}
                    />
                    <label htmlFor="image" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {!image ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <CloudUploadIcon sx={{ fontSize: 48, color: 'tomato', mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Click to upload an image
                          </Typography>
                        </Box>
                      ) : (
                        <Box 
                          component="img" 
                          src={URL.createObjectURL(image)} 
                          alt="Uploaded food" 
                          sx={{ 
                            maxWidth: '100%', 
                            maxHeight: 140,
                            objectFit: 'contain', 
                            borderRadius: 1 
                          }}
                        />
                      )}
                    </label>
                  </UploadBox>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Product Details
                  </Typography>
                  <TextField
                    fullWidth
                    label="Product name"
                    name="name"
                    value={data.name}
                    onChange={onChangeHandler}
                    placeholder="Enter product name"
                    required
                    variant="outlined"
                    margin="normal"
                    size="medium"
                    InputProps={{
                      sx: { borderRadius: 1 }
                    }}
                  />
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                          labelId="category-label"
                          name="category"
                          value={data.category}
                          label="Category"
                          onChange={onChangeHandler}
                          sx={{ borderRadius: 1 }}
                        >
                          <MenuItem value="Salad">Salad</MenuItem>
                          <MenuItem value="Rolls">Rolls</MenuItem>
                          <MenuItem value="Deserts">Deserts</MenuItem>
                          <MenuItem value="Sandwich">Sandwich</MenuItem>
                          <MenuItem value="Cake">Cake</MenuItem>
                          <MenuItem value="Pure Veg">Pure Veg</MenuItem>
                          <MenuItem value="Pasta">Pasta</MenuItem>
                          <MenuItem value="Noodles">Noodles</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Price"
                        name="price"
                        type="number"
                        value={data.price}
                        onChange={onChangeHandler}
                        placeholder="0.00"
                        required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <RupeeSymbol>
                              <CurrencyRupeeIcon fontSize="small" />
                            </RupeeSymbol>
                          ),
                          inputProps: { min: 0, step: 0.01 },
                          sx: { borderRadius: 1 }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Product Description
                  </Typography>
                  <TextField
                    fullWidth
                    name="description"
                    value={data.description}
                    onChange={onChangeHandler}
                    placeholder="Write detailed product description here..."
                    required
                    variant="outlined"
                    multiline
                    rows={4}
                    InputProps={{
                      sx: { borderRadius: 1 }
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{ 
                    backgroundColor:"tomato",
                    minWidth: 150, 
                    py: 1,
                    px: 3,
                    borderRadius: 1,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  Add Product
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </PageContent>
    </ThemeProvider>
  );
};

export default Add;



