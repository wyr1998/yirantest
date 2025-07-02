import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // 蓝色主色
    },
    secondary: {
      main: '#f50057', // 粉色副色
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'PingFang SC',
      'Microsoft YaHei',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme; 