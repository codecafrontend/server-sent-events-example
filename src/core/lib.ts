import { User } from './UserContext';
import { Message } from './useMessages';

const USER_KEY = 'chat_user';

export const getSavedUser = () => {
    try {
        const info = sessionStorage.getItem(USER_KEY) ?? '';
        const parsed = JSON.parse(info);
        return parsed.name && parsed.id ? parsed : null;
    } catch {
        return null;
    }
};

export const saveUser = (user: User) => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const sortMessages = (messages: Message[]) =>
    messages.slice().sort((a, b) => {
        const aDate = new Date(a.timestamp);
        const bDate = new Date(b.timestamp);

        if (aDate < bDate) {
            return -1;
        }
        if (aDate > bDate) {
            return 1;
        }
        return 0;
    });
