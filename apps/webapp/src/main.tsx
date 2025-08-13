import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { ThemeContextProvider } from './contexts/DarkMode/ThemeContextProvider';
import QueryProvider from './components/QueryProvider';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './contexts/SocketContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <ThemeContextProvider>
      <SocketProvider>
        <QueryProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryProvider>
      </SocketProvider>
      <Toaster
        position="bottom-center"
        gutter={12}
        reverseOrder={true}
        containerStyle={{ margin: '4px' }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: '16px',
            maxWidth: '500px',
            padding: '8px 24px',
            backgroundColor: '#1d5d91b7',
            color: 'white',
          },
        }}
      />
    </ThemeContextProvider>
  </StrictMode>
);
