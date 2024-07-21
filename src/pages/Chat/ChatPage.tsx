import {
    FormEventHandler,
    KeyboardEventHandler,
    useCallback,
    useContext,
    useRef,
    useEffect,
} from 'react';
import { UserContext } from '../../core/UserContext';

import './ChatPage.css';
import { useMessages } from '../../core/useMessages';
import { Message } from './Message/Message';
import { useScroll } from '../../core/useScroll';

export function ChatPage() {
    const { name, id } = useContext(UserContext);

    const messagesRef = useRef<HTMLUListElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const {
        scrollIfNeeded,
        scrollToLastMessage,
        beforeReceiveMessages,
        bottomRef,
        isOverflowed,
    } = useScroll({ messagesRef });

    const { messages, sendMessage, isOnline } = useMessages({
        onBeforeReceiveMessages: beforeReceiveMessages,
    });

    useEffect(() => {
        scrollIfNeeded();
    }, [messages, scrollIfNeeded]);

    const handleMessageSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
        (event) => {
            event.preventDefault();

            const form = event.target as HTMLFormElement;
            const messageInput = form.elements.namedItem(
                'message',
            ) as HTMLTextAreaElement;

            if (!messageInput.value) {
                return;
            }

            sendMessage(messageInput.value);
            messageInput.value = '';

            setTimeout(scrollToLastMessage, 0);
        },
        [sendMessage, scrollToLastMessage],
    );

    const handleKeydown = useCallback<KeyboardEventHandler>((event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            formRef.current?.requestSubmit();
        }
    }, []);

    return (
        <div className="Chat">
            <h1 className="Chat__heading">
                {name}
                's chat ({isOnline ? 'online' : 'offline'})
            </h1>

            <div
                className={`Chat__messages ${isOverflowed ? 'Chat__messages_overflowed' : ''}`}
            >
                <ul className={`Chat__messagesList`} ref={messagesRef}>
                    {messages.map((message, i) => (
                        <li key={i} className="Chat__message">
                            <Message
                                {...message}
                                isSelf={message.user.id === id}
                            />
                        </li>
                    ))}
                    <div aria-hidden className="Chat__bottom" ref={bottomRef} />
                </ul>
            </div>

            <form
                onSubmit={handleMessageSubmit}
                className="Chat__form"
                ref={formRef}
            >
                <textarea
                    id="message"
                    name="message"
                    className="Chat__textarea"
                    placeholder="Start typing a message..."
                    onKeyDown={handleKeydown}
                    autoFocus
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
