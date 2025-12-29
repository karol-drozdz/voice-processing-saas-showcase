"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

interface FacebookContextType {
  isFBReady: boolean;
  login: (
    cb: (u: { id: string; name: string; email?: string }) => void,
    err: (msg: string) => void
  ) => void;
}

const FacebookContext = createContext<FacebookContextType | undefined>(
  undefined
);

export const useFacebook = () => {
  const ctx = useContext(FacebookContext);
  if (!ctx) throw new Error("useFacebook must be used within provider");
  return ctx;
};

export function FacebookProvider({ children }: { children: ReactNode }) {
  const [isFBReady, setIsFBReady] = useState(false);

  useEffect(() => {
    if (typeof window.FB !== "undefined") {
      window.FB.getLoginStatus(() => setIsFBReady(true));
      return;
    }

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        cookie: true,
        xfbml: false,
        version: "v23.0",
      });
      window.FB.getLoginStatus(() => setIsFBReady(true));
    };

    if (!document.getElementById("facebook-jssdk")) {
      (function (d, s, id) {
        const fjs = d.getElementsByTagName(s)[0];
        const js = d.createElement(s) as HTMLScriptElement;
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode!.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    }
  }, []);

  const login = (
    cb: (u: { id: string; name: string; email?: string }) => void,
    err: (msg: string) => void
  ) => {
    if (!isFBReady) return err("Facebook SDK nie jest gotowe");

    window.FB.login(
      (resp: any) => {
        if (!resp.authResponse)
          return err("Logowanie anulowane przez użytkownika");

        window.FB.api("/me", { fields: "id,name,email" }, (user: any) => {
          if (user?.error) return err("Błąd API Facebook");
          cb({ id: user.id, name: user.name, email: user.email });
        });
      },
      {
        scope: "public_profile,email",
      }
    );
  };

  return (
    <FacebookContext.Provider value={{ isFBReady, login }}>
      {children}
    </FacebookContext.Provider>
  );
}
