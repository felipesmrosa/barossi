import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export function BotoesDeAcao () {
    return (
        <div className='cardPadrao__card__acoes'>
            <FontAwesomeIcon className='cardPadrao__card__acoes--edit' icon={faPenToSquare} />
            <FontAwesomeIcon className='cardPadrao__card__acoes--del' icon={faTrash} />
        </div>
    )
}