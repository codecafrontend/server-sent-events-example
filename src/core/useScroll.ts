import { RefObject, useCallback, useState, useEffect, useRef } from 'react';

export type UseScrollProps = {
    messagesRef: RefObject<HTMLElement>;
};

export const useScroll = ({ messagesRef }: UseScrollProps) => {
    const [needToScroll, setNeedToScroll] = useState(false);
    const [isOverflowed, setIsOverflowed] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const bottom = bottomRef.current;
        if (!messagesRef.current || !bottom) {
            return;
        }

        const callback: IntersectionObserverCallback = (entries) => {
            setIsOverflowed(!entries[0].isIntersecting);
        };

        const observer = new IntersectionObserver(callback, {
            root: messagesRef.current,
        });
        observer.observe(bottom);

        return () => observer.unobserve(bottom);
    }, [messagesRef]);

    const beforeReceiveMessages = useCallback(() => {
        if (!messagesRef.current) {
            return;
        }

        setNeedToScroll(!isOverflowed);
    }, [isOverflowed, messagesRef]);

    const scrollToLastMessage = useCallback(() => {
        if (!messagesRef.current) {
            return;
        }

        const { children } = messagesRef.current;
        const lastMessage = children[children.length - 1];

        lastMessage.scrollIntoView({
            block: 'end',
            inline: 'nearest',
            behavior: 'smooth',
        });
    }, [messagesRef]);

    const scrollIfNeeded = useCallback(() => {
        if (needToScroll) {
            scrollToLastMessage();
        }
    }, [needToScroll, scrollToLastMessage]);

    return {
        scrollToLastMessage,
        beforeReceiveMessages,
        scrollIfNeeded,
        bottomRef,
        isOverflowed,
    };
};
