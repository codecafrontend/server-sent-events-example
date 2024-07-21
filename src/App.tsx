import { useCallback, useState } from 'react';
import { nanoid } from 'nanoid';
import './App.css';
import { User, UserContext } from './core/UserContext';
import { LoginPage } from './pages/Login/LoginPage';
import { ChatPage } from './pages/Chat/ChatPage';
import { getSavedUser, saveUser } from './core/lib';

function App() {
    const [user, setUser] = useState<User>(getSavedUser());

    const handleUser = useCallback((name: string) => {
        const newUser = { name, id: nanoid() };

        setUser(newUser);
        saveUser(newUser);
    }, []);

    return (
        <UserContext.Provider value={user}>
            {!user && <LoginPage onSetUser={handleUser} />}
            {user && <ChatPage />}
        </UserContext.Provider>
    );
}

export default App;
