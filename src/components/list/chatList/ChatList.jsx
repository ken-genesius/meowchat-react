import { useEffect, useState } from "react";
import "./chatList.css";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";
import cable from "../../../lib/cable";
import { API_URL_ADD_CHATROOM, API_URL_GET_CHATROOM_LIST } from "../../../config/ApiUrl";

const ChatList = () => {

    const [userChats, setUserChats] = useState([]);
    const [chatrooms, setChatrooms] = useState([]);
    const [text, setText] = useState("");
    
    const{currentUser} = useUserStore();
    const{changeChat} = useChatStore();

    useEffect(() => {
        const chatroomAPI = async (e) => {
            try{
                const API_URL = API_URL_GET_CHATROOM_LIST;

                const response = await fetch(API_URL, {
                    method: "GET",
                    headers: {"Content-Type":"application/json"}
                });

                const jsonData = await response.json();
                const chatroomList = jsonData.chatrooms;
                const userList = jsonData.users;
                
                setUserChats(sortUserChats(userList));
                setChatrooms(sortChatroom(chatroomList));
            }catch(err){
                console.log(err);
                toast.error(err.message);
            }
        }
        chatroomAPI();

        const subscription = cable.subscriptions.create("ChatroomsChannel",{
            received(data){
                console.log("Received data", data);
                
                if(data.type === "newChatroom")
                {
                    console.log("masuk if newChatroom");
                    setChatrooms((prev) => {
                        const prevChatrooms = [...prev];
                        prevChatrooms.push(data.chatroom);
                        return sortChatroom(prevChatrooms);
                    });
                }

                if(data.type === "newUser")
                {
                    console.log("masuk if newUser");
                    setUserChats((prev) => {
                        const prevUserChats = [...prev];
                        prevUserChats.push(data.user);
                        return sortUserChats(prevUserChats);
                    });
                }
            }
        });

        return ()=>{
            subscription.unsubscribe();
        }
    }, [currentUser.id]);

    const handleImageClick = (e) => {
        e.preventDefault(); // Prevent default form submission
        document.getElementById("addChatroomForm").requestSubmit(); // Correct way to submit the form
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const {name} = Object.fromEntries(formData);
        console.log("Call add chatroom API with name", name);

        try{
            const API_URL = API_URL_ADD_CHATROOM(name);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {"Content-Type":"application/json"}
            });

        }catch(err){
            console.log(err);
        }finally{
            document.getElementById("text_chatroomForm").value = "";
        }
    };

    const sortChatroom = (e) => {
        return e.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            return compareName(nameA, nameB);
        });
    }

    const sortUserChats = (e) => {
        return e.sort((a, b) => {
            const nameA = a.username.toUpperCase();
            const nameB = b.username.toUpperCase();
            return compareName(nameA, nameB);
        });
    }

    const compareName = (nameA, nameB) => {
        if(nameA < nameB) return -1;
        if(nameA > nameB) return 1;
        return 0;
    }

    const handleSelect = async (typeId, typeName) => {
        changeChat(typeId, typeName);
    }

    return (
        <div className="chatList">
            <div className="search">
                <form className="searchBar" id="addChatroomForm" onSubmit={handleAdd}>
                    <input type="text" id="text_chatroomForm" placeholder="Add Chatroom" name="name"/>
                    <button style={{display: "none"}}></button>
                </form>
                <img src="./plus.png" alt="" className="add" onClick={handleImageClick}/>
            </div>
            <div className="chatroom-title">
                <h3>
                    Chatrooms
                </h3>
            </div>
            {chatrooms.length > 0 ? chatrooms.map((chatroom) => (
            <div className="item" key={chatroom.id} onClick={() => handleSelect(chatroom.id, "chatroom")}>
                <img src="./avatar.png" alt="" />
                <div className="texts">
                    <span>{chatroom.name}</span>
                </div>
            </div>
            )) : (
                <p>No chatroom found</p>
            )}
            <div className="user-title">
                <h3>
                    Users
                </h3>
            </div>
            {userChats.length > 0 ? userChats.map((user) => (
                <div className="item" key={user.id} onClick={() => handleSelect(user.id, "user")}>
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <span>{user.username}</span>
                    </div>
                </div>
            )) : (
                <p>No user found</p>
            )}
        </div>
    )
}

export default ChatList