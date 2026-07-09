import React, { useState } from "react";
import Logo from "../components/Logo";
import { InteractiveDotGrid } from "../components/styles/InteractiveDotGrid";
import { LoginForm } from "../components/Auth/LoginForm";
import { RecoveryForm } from "../components/Auth/RecoveryForm";
import { RegisterForm } from "../components/Auth/RegisterForm";

const AuthPage = () => {
  const [authMode, setAuthMode] = useState("sign_in"); // 'sign_in', 'sign_up', 'recovery'


  const getPageContent = () => {
    switch (authMode) {
      case "sign_up":
        return {
          toggleText: "Sign In",
          toggleMode: "sign_in",
        };
      case "recovery":
        return {
          toggleText: "Sign In",
          toggleMode: "sign_in",
        };
      default:
        return {
          toggleText: "Sign Up",
          toggleMode: "sign_up",
        };
    }
  };

  const content = getPageContent();

  return (
    <main
      className={`relative min-h-[100dvh] w-full flex bg-[#0f172b]/50 text-white`}
    >
      <div
        className="absolute inset-0 pointer-events-none z-0 "
        style={{
          maskImage:
            "radial-gradient(farthest-corner at 50% 50%, #000 70%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(farthest-corner at 50% 50%, #000 70%, transparent 100%)",
        }}
      >
        <InteractiveDotGrid />
      </div>

      {/* <div className="absolute inset-0 pointer-events-none z-0"></div> */}

      <aside
        className={`relative z-10 hidden lg:flex lg:w-3/5 items-center justify-center p-12 select-none overflow-hidden bg-transparent`}
      >
        <Logo className="text-5xl" />
      </aside>

      <section
        className={`relative z-10 w-full lg:w-2/5 min-h-[100dvh] flex flex-col justify-between px-6 py-4  sm:px-12 sm:py-8 lg:p-12 overflow-y-auto bg-transparent`}
      >

        <div className="w-full max-w-sm mx-auto my-auto py-6">
          <div key={authMode} className="w-full">
            {authMode === "sign_in" && <LoginForm />}
            {authMode === "sign_up" && <RegisterForm />}
            {authMode === "recovery" && <RecoveryForm />}
          </div>
        </div>

        <div className="w-full h-20 flex flex-col items-center gap-4 pt-6 pb-4 sm:pb-0 text-sm text-center">
          <p className="opacity-70">
            {authMode === "sign_in"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setAuthMode(content.toggleMode)}
              className="font-semibold underline underline-offset-4 hover:opacity-80 active:opacity-60 cursor-pointer ml-1"
            >
              {content.toggleText}
            </button>
          </p>

          {authMode === "sign_in" && (
            <button
              type="button"
              onClick={() => setAuthMode("recovery")}
              className="text-xs opacity-50 hover:opacity-100 hover:underline transition-opacity cursor-pointer"
            >
              Forgot your password?
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
