import { createTheme } from '@mui/material/styles';
import * as customPalettes from './customPalettes';

const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#3F7BAB',
      light: '#E8F2FF',
      dark: '#003352',
    },
    success: {
      main: '#00703C',
      light: '#C3FFD0',
      dark: '#00391C',
    },
    error: {
      main: '#BB0E2D',
      light: '#FFEDEC',
      dark: '#680013',
    },
    warning: {
      main: '#F5BF00',
      light: '#FFEFD0',
      dark: '#3E2E00',
    },
    background: {
      default: customPalettes.backgroundColorPalette.main,
    },
  },
  typography: {
    fontFamily: 'Barlow, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 20px',
          textTransform: 'none',
          marginLeft: '10px',
          transition: 'background-color 0.3s',
          '&.Mui-disabled': {
            backgroundColor: customPalettes.neutralPalette.n80,
            color: customPalettes.whitePalette.main,
          },
          '.loading': { 
            backgroundColor: 'primary', 
            color: customPalettes.whitePalette.main, 
          },
          '.addingEstablishmentLoading': { 
            backgroundColor: 'white', 
            color: customPalettes.whitePalette.main, 
          },
        },
      },
      variants: [
        {
          props: { color: 'secondary' },
          style: {
            backgroundColor: 'white',
            color: 'grey',
            border: '0.3px solid lightgrey',
            '&:hover': {
              backgroundColor: '#f0f2f2db', 
            },
          },
        },
      ],
    },
    MuiChip: {
      styleOverrides: {
        root: {
          margin: '0 20px',
          borderRadius: '12px',
          fontSize: '14px',
          textTransform: 'none',
          justifyContent: 'start',
          paddingLeft: '4px',
          maxWidth: 'fit-content',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%', 
          margin: '8px', 
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px', 
          '&:last-child': { paddingBottom: '16px' }, 
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          marginTop: '16px', 
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          // Reduce the padding to decrease the cell height
          padding: '4px 16px', // Adjust the vertical and horizontal padding as needed
          // Ensure the font size is small enough to fit in the reduced padding
          fontSize: '0.875rem', // Adjust the font size as needed
        },
        head: {
          // If you want the header cells to have a different padding
          padding: '4px 16px', // Adjust the vertical and horizontal padding as needed for header cells
          fontWeight: 400, // Keep the header cells bold if desired
          fontSize: '12px', // Adjust the font size as needed for header cells
          color: customPalettes.neutralPalette.main,
        },
        // Add styles for body cells if different from the root
        body: {
          padding: '4px 16px', // Adjust the vertical and horizontal padding as needed for body cells
          fontSize: '0.875rem', // Adjust the font size as needed for body cells
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          height: '50px', 
        },
      },
    },
  },
  
});

export default lightTheme;