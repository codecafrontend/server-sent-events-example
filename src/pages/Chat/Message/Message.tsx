import { FC } from 'react';
import dateFormat from 'dateformat';
import { Message as MessageType } from '../../../core/useMessages';

import './Message.css';

type MessageProps = MessageType & {
    isSelf: boolean;
};

const dateTemplate = 'dd.mm.yyyy HH:MM';

export const Message: FC<MessageProps> = ({
    user,
    text,
    timestamp,
    isSelf,
}) => {
    return (
        <article className={`Message Message_${isSelf ? 'self' : 'other'}`}>
            {!isSelf && <p className="Message__user">{user.name}</p>}
            <p className="Message__text">{text}</p>
            <time className="Message__timestamp">
                {dateFormat(timestamp, dateTemplate)}
            </time>
        </article>
    );
};
