import { create } from 'zustand';
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({
    typeId: null,
    typeName: null,
    chatroomId: null,
    changeChat: (typeId, typeName) => {
        return set({
            typeId: typeId,
            typeName: typeName
        });    
    },
    changeChatroomId: (chatroomId) => {
        set(state => ({...state, chatroomId: chatroomId}))
    },
    resetChatStore: () => {
        return set({
            typeId: null,
            typeName: null,
            chatroomId: null
        });
    }
}))