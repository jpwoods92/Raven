import { User } from '@/types';

export const getUserDisplayName = (user?: User | null): string => {
  console.log(user);
  if (!user) return '';
  return user.displayName || user.username;
};
