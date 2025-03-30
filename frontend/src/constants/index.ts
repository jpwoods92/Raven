import { ImportMeta } from '@/types';

export const REACT_APP_BACKEND_URL = (import.meta as unknown as ImportMeta)?.env
  .REACT_APP_BACKEND_URL;
