import React from 'react';

interface State { hasError: boolean; error: string }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message + '\n' + error.stack };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#0B1220', color: '#f8fafc', minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', padding: '2rem', fontFamily: 'monospace'
        }}>
          <div style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            ⚠️ Smart Civic – Runtime Error
          </div>
          <pre style={{
            background: '#1e293b', color: '#fbbf24', padding: '1.5rem',
            borderRadius: '0.75rem', maxWidth: '900px', overflowX: 'auto',
            fontSize: '0.75rem', lineHeight: '1.6', border: '1px solid #ef4444'
          }}>
            {this.state.error}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1.5rem', padding: '0.75rem 2rem',
              background: '#06b6d4', color: '#0B1220', borderRadius: '0.75rem',
              fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1rem'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
