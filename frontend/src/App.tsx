import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#FFFFFF',
            color: '#212529',
            boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
            borderRadius: '0.75rem',
            padding: '16px 20px',
            fontSize: '0.875rem',
            fontWeight: '500',
            border: '1px solid #E9ECEF',
          },
          success: {
            style: {
              background: '#E6F9F1',
              color: '#00A86B',
              border: '1px solid #00A86B',
            },
            iconTheme: {
              primary: '#00A86B',
              secondary: '#FFFFFF',
            },
          },
          error: {
            style: {
              background: '#FDEEEF',
              color: '#DC3545',
              border: '1px solid #DC3545',
            },
            iconTheme: {
              primary: '#DC3545',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </Router>
  )
}

export default App
