import { createContext } from 'react';

export type User = {
    name: string;
    id: string;
};

export const UserContext = createContext<User>({ name: '', id: '' });
