import { useCallback, useContext, useEffect, useState } from 'react';
import { User, UserContext } from './UserContext';
import { sortMessages } from './lib';
import { nanoid } from 'nanoid';

export type Message = {
    id: string;
    user: User;
    text: string;
    timestamp: string;
};

export type UseMessagesProps = {
    onBeforeReceiveMessages?: () => void;
};

export const useMessages = ({ onBeforeReceiveMessages }: UseMessagesProps) => {
    const user = useContext(UserContext);

    const [messages, setMessages] = useState<Record<string, Message>>({});
    const [isOnline, setIsOnline] = useState(false);
    const [source, setSource] = useState<EventSource>();

    const updateMessages = useCallback((messagesList: Message[]) => {
        setMessages((state) => ({
            ...state,
            ...messagesList.reduce(
                (acc, curr) => ({ ...acc, [curr.id]: curr }),
                {},
            ),
        }));
    }, []);

    const loadHistory = useCallback(async () => {
        const response = await fetch('/history');
        const history = (await response.json()) as Message[];
        updateMessages(history);
    }, [updateMessages]);

    useEffect(() => {
        if (!source) {
            const eventSource = new EventSource(`/sse`);

            eventSource.onmessage = (newMessage: MessageEvent<string>) => {
                onBeforeReceiveMessages?.();
                updateMessages([JSON.parse(newMessage.data)]);
            };

            eventSource.onopen = () => {
                setIsOnline(true);
            };

            eventSource.onerror = () => {
                setIsOnline(false);

                setTimeout(() => {
                    setSource(undefined);
                }, 2000);
            };

            setSource(eventSource);
            loadHistory();
        }
    }, [updateMessages, loadHistory, onBeforeReceiveMessages, user, source]);

    const sendMessage = useCallback(
        (text: string) => {
            const message: Message = {
                id: nanoid(),
                user,
                text,
                timestamp: new Date().toISOString(),
            };

            void fetch('/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            updateMessages([message]);
        },
        [user, updateMessages],
    );

    return {
        messages: sortMessages(Object.values(messages)),
        sendMessage,
        isOnline,
    };
};
