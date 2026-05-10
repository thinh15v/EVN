import {
    createContext,
    useState,
    ReactNode
} from "react";

interface AuthContextType {
    user: any;
    setUser: any;
}

export const AuthContext =
    createContext<AuthContextType | null>(null);

interface Props {
    children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user") || "null")
    );

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};