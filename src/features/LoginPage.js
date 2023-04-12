import React, { useState } from "react";
import { FingerPrintLogo, LandingButtons, TextInput } from "../components";

export const LoginPage = () => {
  const [newUser, setNewUser] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5">
      <FingerPrintLogo />
      <TextInput title={"email"} />
      <TextInput title={"password"} />
      {!newUser ? (
        <h3 className="text-center text-2xl">forgot password?</h3>
      ) : (
        <TextInput title={"re-enter password"} />
      )}
      <LandingButtons text="l o g i n" />
      <LandingButtons text="create account" />
    </div>
  );
};
