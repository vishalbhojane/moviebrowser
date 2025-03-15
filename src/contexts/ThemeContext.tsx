import React, {createContext, useState, useContext} from 'react';

interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  white: string;
  card: string;
  error: string;
  border: string;
  placeholder: string;
  searchBarBackground: string;
  buttonBackground: string;
  monoAlpha7: string;
}

interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

const lightTheme: Theme = {
  dark: false,
  colors: {
    background: '#F5F5F1',
    text: '#221F1F',
    primary: '#E50914',
    secondary: '#9B161A',
    accent: '#F5F5F1',
    white: '#FFFFFF',
    card: '#FFFFFF',
    error: '#E50914',
    border: '#E5E5E5',
    placeholder: '#757575',
    searchBarBackground: 'rgba(0, 0, 0, 0.1)',
    buttonBackground: 'rgba(229, 9, 20, 0.1)', // Primary with opacity
    monoAlpha7: 'rgba(255,255,255,0.7)',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    background: '#221F1F',
    text: '#F5F5F1',
    primary: '#E50914',
    secondary: '#9B161A',
    accent: '#F5F5F1',
    white: '#FFFFFF',
    card: '#2F2F2F',
    error: '#E50914',
    border: '#3E3E3E',
    placeholder: '#9B9B9B',
    searchBarBackground: 'rgba(255, 255, 255, 0.1)',
    buttonBackground: 'rgba(229, 9, 20, 0.1)',
    monoAlpha7: 'rgba(0,0,0,0.7)',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(darkTheme);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme.dark ? lightTheme : darkTheme));
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
