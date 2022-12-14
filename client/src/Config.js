import { createTheme } from "@mui/material/styles";
export const theme = createTheme({
  typography: {
    fontFamily: `"Pretendard-Regular"`,
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 800,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `{
        @font-face {
          font-family: 'Pretendard-Regular';
          src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
          font-weight: 500;
          font-style: normal;`,
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "1rem!important",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          outline: "none!important",
        },
        endIcon: {
          marginLeft: "5px",
        },
        text: {
          ":hover": {
            backgroundColor: "white",
            fontWeight: "bold",
            textDecoration: "none",
          },
        },
        textPrimary: {
          color: "#3791f8",
        },
        contained: {
          backgroundColor: "#3791f8",
          ":hover": {
            backgroundColor: "#3791f8",
            fontWeight: "bold",
            textDecoration: "none !important",
          },
        },
        outlinedPrimary: {
          color: "#3791f8",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          outline: "none",
          color: "#3791f8",
        },

        sizeLarge: {
          ":focus": {
            outline: "none",
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          outline: "none",
          ":focus": {
            outline: "none !important",
          },
          ":active": {
            outline: "none !important",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "rgba(0, 0, 0, 0.6)",

          "&.Mui-checked": {
            color: "#3791f8",
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          right: "25%",
          top: "15%",
          backgroundColor: "#3791f8 !important",
          fontSize: "1rem !important",
          marginLeft: "-5px",
          //   backgroundColor: "#3791f8",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          paddingLeft: "10px",
          WebkitBoxShadow: "0 0 0 1000px white inset",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        body2: {
          fontSize: "1.1rem",
          color: "white",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: "5px",
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          scrollbarWidth: "thin",
          "&::webkit-scrollbarWidth": {
            width: "0.4em",
          },
          outline: "none !important",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation8: {
          border: "1px solid #3791f8",
          width: "500px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#3791f8",
            },
            "&.Mui-error fieldset": {
              borderColor: "#d32f2f",
            },
          },
          "& label.Mui-focused": {
            color: "#3791f8",
          },
          "& label.Mui-error": {
            color: "#d32f2f",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          border: "2px solid #3791f8",
        },
        filled: {
          align: "center",
        },
        colorPrimary: {
          backgroundColor: "#3791f8",
        },
        root: {
          marginBottom: "10px",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "15px",
          display: "flex",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        rounded: {
          height: "30px",
          fontSize: "20px",
          margin: "0px 10px 0px 10px",
          border: "none",
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#3791f8",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        input: {
          color: "#8bc7ff",
        },
        thumb: {
          color: "#3791f8",
        },
      },
    },
  },
});
