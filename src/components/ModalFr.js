import React from 'react';
import './Modal.css'
import ModalContent from './ModalContentFr';

const Modal = ({ tense, handleModal, teacherMode, isReflexive, infinitiveToAnswer }) => {

    return (
        <div className='modal-backdrop' onClick={handleModal}>
            <div className='modal'>
                {infinitiveToAnswer[7] != "irregular verb" &&
                    <>
                        <h3>{tense[0]} Cheatsheet</h3>
                        <p>{tense[3]}</p>
                    </>
                }
                {infinitiveToAnswer[7] === "irregular verb" &&
                    <>
                        <h3>Verb '{infinitiveToAnswer[0]}' Cheatsheet</h3>
                        <p>The verb '{infinitiveToAnswer[0]}' is irregular!</p>
                    </>
                }

                <ModalContent 
                    handleModal={handleModal}
                    tense={tense}
                    teacherMode={teacherMode}
                    infinitiveToAnswer={infinitiveToAnswer}
                    />

                {infinitiveToAnswer[7] != "irregular verb" &&
                    <>
                        <p className='bold'>Examples</p>
                        {tense[4].map((example, index) => {
                            return <p key={index}>{example}</p>
                        })}
                        <p className='bold'>Irregulars</p>
                        <p>{tense[5]}</p>
                        {isReflexive && 
                        <>
                            <p className='bold'>Reflexive verbs</p>
                            <p>Remember you need to add the reflexive particle before the verb!</p>
                            <p>These endings are 'me', 'te', 'se', 'nous', 'vous', 'se'</p>
                        </>}
                    </>
                }

            </div>
        </div>
    )
}

export default Modal;