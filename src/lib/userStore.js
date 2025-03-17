import { create } from 'zustand';

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: false,
    fetchUserInfo: async(userData) => {
        try{
            console.log("inside fetch info");
            console.log(userData.id);
            console.log(userData.username);
            return set({currentUser: userData, isLoading: false})
        }
        catch(err)
        {
            console.log(err);
            return set({currentUser: null, isLoading: false});
        }
    },
    resetUserStore: () => {
        return set({currentUser: null, isLoading: false})
    }
}))