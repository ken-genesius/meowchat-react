import { useEffect, useRef, useState } from "react"
import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { toast } from "react-toastify";
import cable from "../../lib/cable";
import { format } from "timeago.js";
import { API_URL_INITIATE_CHATROOM, API_URL_SEND_MESSAGE } from "../../config/ApiUrl";

const Chat = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");

    const [chatData, setChatData] = useState({});
    const [chatMessages, setChatMessages] = useState([]);
    const [chatroomId, setChatroomId] = useState(null);

    const {typeId, typeName} = useChatStore();
    const {currentUser} = useUserStore();

    const subscriptionRef = useRef(null);
    const endRef = useRef(null);

    useEffect( () => {
        endRef.current?.scrollIntoView({behavior: "smooth" });
    },[chatMessages])

    useEffect(() => {

        const chatroomAPI = async (e) => {
            try{
                const API_URL = API_URL_INITIATE_CHATROOM(currentUser.id, typeId, typeName);

                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {"Content-Type":"application/json"}
                });

                const jsonData = await response.json();
                console.log("JSON Data", jsonData);
                setChatData(jsonData.typeData);
                setChatMessages(jsonData.messages);
                console.log("ID Chatroom",jsonData.typeData.id);
                setChatroomId(jsonData.typeData.id);
            }catch(err){
                console.log(err);
                toast.error(err.message);
            }
        }
        if(typeId)
            chatroomAPI();

    }, [typeId, typeName]);

    useEffect(() => {
        if(!chatroomId)
            return;

        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }

        subscriptionRef.current = cable.subscriptions.create({ channel: "MessagesChannel", id: chatroomId },{
            received(data){
                console.log("Received data", data);

                if(data.type === "newMessages")
                {
                    console.log("masuk if newMessages");
                    setChatMessages((prev) => [...prev, data.message]);
                }
            }
        });

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null; // Reset subscription reference
            }
        }
    }, [chatroomId])

    console.log("typeId", typeId);
    console.log("typeName", typeName);

    const handleEmoji = e => {
        setText(prev => prev+e.emoji);
        setOpen(false)
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if(text === "") return;

        try{
            const API_URL = API_URL_SEND_MESSAGE(currentUser.id, chatroomId, text);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {"Content-Type":"application/json"}
            });
        }
        catch(err){
            console.log(err);
        } finally{
            setText("");
        }
    }

    return (
        <div className="chat">
            {typeId && 
            <div className="top">
                <div className="user">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <span>{chatData.name}</span>
                    </div>
                </div>
            </div>
            }
            {typeId &&
            <div className="center">
                {chatMessages.map((chatMessage) => (
                <div className={chatMessage.user_id === currentUser.id ? 'message own' : 'message'} key={chatMessage.id}>
                    {chatMessage.user_id !== currentUser.id && 
                    <img src="./avatar.png" alt="" />
                    }
                    <div className="texts">
                        {typeName === "chatroom" && chatMessage.user_id !== currentUser.id && 
                        <h4>{chatMessage.username}</h4>
                        }
                        <p>
                            {chatMessage.body}
                        </p>
                        <span>{format(new Date(chatMessage.created_at))}</span>
                    </div>
                </div>
                ))}
                <div ref={endRef}></div>
            </div>
            }
            {typeId && 
                <form id="addChatroomForm" onSubmit={handleSend} className="bottom">
                    <input type="text" 
                    placeholder="Type a message..." 
                    value={text}
                    onChange={e => setText(e.target.value)}/>
                    <div className="emoji">
                        <img src="./emoji.png" alt="" 
                        onClick={() => setOpen(prev => !prev)} />
                        <div className="picker">
                            <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
                        </div>
                    </div>
                    <button className="sendButton">Send</button>
                </form>
            }
        </div>
    )
}

export default Chat