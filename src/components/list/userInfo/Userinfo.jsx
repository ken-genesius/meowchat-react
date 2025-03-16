import { useChatStore } from "../../../lib/chatStore";
import { useUserStore } from "../../../lib/userStore";
import "./userInfo.css"

const Userinfo = () => {

    const {currentUser, resetUserStore} = useUserStore();
    const {resetChatStore} = useChatStore();

    const resetSession = async (e) => {
        e.preventDefault();
        resetChatStore();
        resetUserStore();
    };

    return (
        <div className="userInfo">
            <div className="user">
                <img src="./avatar.png" alt="" />
                <h2>{currentUser.username}</h2>
            </div>
            <button className="logout" onClick={resetSession}>Log Out</button>
        </div>
    )
}

export default Userinfo