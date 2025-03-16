import "./login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import { useUserStore } from "../../lib/userStore";


const Login = () => {

    const [loading, setLoading] = useState(false);

    const fetchInfo = useUserStore((state) => state.fetchUserInfo);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const {username} = Object.fromEntries(formData);

        try{
            const API_URL = new URL("http://localhost:3000/api/v1/log_in");
            API_URL.searchParams.append("username",username);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {"Content-Type":"application/json"}
            });

            const jsonData = await response.json();
            fetchInfo(jsonData.user);

            if(jsonData.status === "200")
                toast.success("Account found! You can use your previous account!")
            else if(jsonData.status === "201")
                toast.success("Account created! You can start chatting now!")
        }catch(err){
            console.log(err);
            toast.error(err.message);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className="login">
            <div className="item">
                <h2>Welcome to MeowChat</h2>
                <h2>Create or Log in</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Username" name="username" />
                    <button disabled={loading}>{loading ? "Loading" : "Sign in" }</button>
                </form>
            </div>
        </div>
    )
}

export default Login;