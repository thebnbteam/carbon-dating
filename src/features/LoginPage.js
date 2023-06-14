import React, { useState } from "react";
import { FingerPrintLogo, LandingButtons, TextInput } from "../components";

export const LoginPage = () => {
  const [newUser, setNewUser] = useState(false);

  return (
    <div className="mt-6 flex flex-col justify-center items-center gap-5">
      <FingerPrintLogo />
      <TextInput title={"email"} />
      <TextInput title={"password"} />
      {newUser ? (
        <TextInput title={"re-enter password"} />
      ) : (
        <h3 className="text-center text-2xl">forgot password?</h3>
      )}
      <LandingButtons text="l o g i n" />
      <span
        onClick={() => {
          setNewUser(true);
        }}
      >
        <LandingButtons text="create account" />
      </span>
    </div>
  );
};
