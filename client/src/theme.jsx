import { createTheme } from "@mui/material/styles";
import "@fontsource/poppins";
import { createContext, useState, useMemo, useEffect } from "react";

export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          100: "#d5d6e1",
          200: "#aaaec2",
          300: "#8085a4",
          400: "#555d85",
          500: "#2b3467",
          600: "#222a52",
          700: "#1a1f3e",
          800: "#111529",
          900: "#090a15",
        },

        secondary: {
          100: "#f1f7fb",
          200: "#e3eff6",
          300: "#d6e7f2",
          400: "#c8dfed",
          500: "#bad7e9",
          600: "#95acba",
          700: "#70818c",
          800: "#4a565d",
          900: "#252b2f",
        },
        black: {
          50: "#ffffff",
          100: "#FBFBFB",
          200: "#cccccc",
          300: "#b2b2b2",
          400: "#999999",
          500: "#7f7f7f",
          600: "#666666",
          700: "#4c4c4c",
          800: "#333333",
          900: "#101010",
          950: "#000000",
        },
        blackOnly: {
          500: "#000000",
        },
        whiteOnly: {
          500: "#ffffff",
        },
        redDark: {
          500: "#EB455F",
        },
        defaultColor: {
          500: "#2b3467",
        },
      }
    : {
        primary: {
          100: "#090a15",
          200: "#111529",
          300: "#1a1f3e",
          400: "#222a52",
          500: "#2b3467",
          600: "#555d85",
          700: "#8085a4",
          800: "#aaaec2",
          900: "#d5d6e1",
        },

        secondary: {
          900: "#252b2f",
          800: "#4a565d",
          700: "#70818c",
          600: "#95acba",
          500: "#bad7e9",
          400: "#c8dfed",
          300: "#d6e7f2",
          200: "#e3eff6",
          100: "#f1f7fb",
        },
        black: {
          50: "#000000",
          100: "#191919",
          200: "#333333",
          300: "#4c4c4c",
          400: "#666666",
          500: "#7f7f7f",
          600: "#999999",
          700: "#b2b2b2",
          800: "#cccccc",
          900: "#F9F9F9",
          950: "#ffffff",
        },
        blackOnly: {
          500: "#000000",
        },
        whiteOnly: {
          500: "#ffffff",
        },
        redDark: {
          500: "#EB455F",
        },
        defaultColor: {
          500: "#2b3467",
        },
      }),
});

// MUI theme Settings

export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.secondary[500],
            },
            neutral: {
              dark: colors.primary[100],
              main: colors.primary[100],
              light: colors.primary[100],
            },
            background: {
              default: colors.black[950],
            },
          }
        : {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.secondary[500],
            },
            neutral: {
              dark: colors.primary[100],
              main: colors.primary[100],
              light: colors.primary[100],
            },
            background: {
              default: colors.black[950],
            },
          }),
    },
    typography: {
      fontFamily: ["Poppins", "sans-serif"].join(","),
      fontSize: 14,
      colors: colors.black[950],
      h1: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 17,
      },
      h6: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 15,
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1366,
        xl: 1536,
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  // const [mode, setMode] = useState("light");
  console.log("theme :", localStorage.getItem("theme"));
  const storage =
    localStorage.getItem("theme") !== "undefined"
      ? localStorage.theme
      : "light";

  const [storageTheme, setStorageTheme] = useState(storage);
  const [mode, setMode] = useState(storage);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );
  useEffect(() => {
    localStorage.setItem("theme", mode);
    setStorageTheme(mode);
  }, [storageTheme, mode]);

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
