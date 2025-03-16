
const DEFAULT_URL = import.meta.env.DEFAULT_URL || "http://localhost:3000";

export const API_URL_LOGIN = (username) => { 
    const url = new URL(`${DEFAULT_URL}/api/v1/log_in`);
    url.searchParams.append("username",username);

    return url;
};

export const API_URL_GET_CHATROOM_LIST = new URL(`${DEFAULT_URL}/api/v1/chatrooms`);

export const API_URL_ADD_CHATROOM = (name) =>{
    const url = new URL(`${DEFAULT_URL}/api/v1/chatrooms`);
    url.searchParams.append("name",name);

    return url;
} 

export const API_URL_INITIATE_CHATROOM = (currentId, typeId, typeName) => {
    const url = new URL(`${DEFAULT_URL}/api/v1/initiate_chatroom`);
    url.searchParams.append("currentId",currentId);
    url.searchParams.append("typeId",typeId);
    url.searchParams.append("typeName",typeName);

    return url;
}

export const API_URL_SEND_MESSAGE = (user_id, chatroom_id, body) => {
    const url = new URL(`${DEFAULT_URL}/api/v1/messages`);
    url.searchParams.append("user_id",user_id);
    url.searchParams.append("chatroom_id",chatroom_id);
    url.searchParams.append("body",body);

    return url;
}