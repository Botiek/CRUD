import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Pagination,
  AppBar,
  Toolbar,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Brand {
  id: number;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  founded_year?: number;
  country?: string;
  industry?: string;
  created_at: string;
  updated_at: string;
}

const Dashboard: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/brands?page=${page}&limit=10&search=${searchTerm}`);
      setBrands(response.data.brands);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [page, searchTerm]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddBrand = () => {
    setEditingBrand(null);
    setDialogOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setDialogOpen(true);
  };

  const handleDeleteBrand = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот бренд?')) {
      try {
        await axios.delete(`/api/brands/${id}`);
        fetchBrands();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Ошибка удаления');
      }
    }
  };

  const handleSaveBrand = async (brandData: Partial<Brand>) => {
    try {
      if (editingBrand) {
        await axios.put(`/api/brands/${editingBrand.id}`, brandData);
      } else {
        await axios.post('/api/brands', brandData);
      }
      setDialogOpen(false);
      fetchBrands();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка сохранения');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Управление брендами
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.username}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Список брендов
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddBrand}
          >
            Добавить бренд
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск по названию или описанию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell>Описание</TableCell>
                  <TableCell>Страна</TableCell>
                  <TableCell>Отрасль</TableCell>
                  <TableCell>Год основания</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : brands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Бренды не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  brands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {brand.logo_url && (
                            <img
                              src={brand.logo_url}
                              alt={brand.name}
                              style={{ width: 30, height: 30, marginRight: 10 }}
                            />
                          )}
                          {brand.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {brand.description?.substring(0, 50)}
                        {brand.description && brand.description.length > 50 && '...'}
                      </TableCell>
                      <TableCell>{brand.country}</TableCell>
                      <TableCell>{brand.industry}</TableCell>
                      <TableCell>{brand.founded_year}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditBrand(brand)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteBrand(brand.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Всего брендов: {total}
        </Typography>

        <BrandDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveBrand}
          brand={editingBrand}
        />
      </Container>
    </Box>
  );
};

interface BrandDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (brandData: Partial<Brand>) => void;
  brand: Brand | null;
}

const BrandDialog: React.FC<BrandDialogProps> = ({ open, onClose, onSave, brand }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    website: '',
    founded_year: '',
    country: '',
    industry: ''
  });

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        description: brand.description || '',
        logo_url: brand.logo_url || '',
        website: brand.website || '',
        founded_year: brand.founded_year?.toString() || '',
        country: brand.country || '',
        industry: brand.industry || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        logo_url: '',
        website: '',
        founded_year: '',
        country: '',
        industry: ''
      });
    }
  }, [brand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      founded_year: formData.founded_year ? parseInt(formData.founded_year) : undefined
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {brand ? 'Редактировать бренд' : 'Добавить новый бренд'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Название бренда"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Описание"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={3}
            margin="normal"
          />
          <TextField
            fullWidth
            label="URL логотипа"
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Официальный сайт"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Год основания"
            value={formData.founded_year}
            onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
            type="number"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Страна"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Отрасль"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained">
            {brand ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Dashboard; 