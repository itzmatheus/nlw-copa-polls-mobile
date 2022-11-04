import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}


export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>({} as UserProps);
    const [isUserLoading, setIsLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '',
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ['profile', 'email']
    });

    async function signInWithGoogle(access_token: string) {
        console.log('TOKEN DE AUTENTICACAO ===> '+ access_token);
    }

    async function signIn() {

        try {
            setIsLoading(true);
            await promptAsync();

        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {

        if(response?.type === 'success' && response.authentication?.accessToken) {
            signInWithGoogle(response.authentication.accessToken);
        }

    }, [response])

    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user
        }}>
            {children}
        </AuthContext.Provider>
    )
}