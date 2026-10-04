export const isProduction = process.env.NODE_ENV === 'production';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL 
  || (isProduction 
      ? 'https://nexus-backend-913292317917.us-central1.run.app' 
      : 'http://localhost:8080');

export const WS_BASE_URL = process.env.EXPO_PUBLIC_WS_URL 
  || (isProduction 
      ? 'https://nexus-backend-913292317917.us-central1.run.app/ws-chat' 
      : 'http://localhost:8080/ws-chat');
