import { useEffect, useState } from "react";
import { loadVault } from "../../utils/db";
import SetupVault from "./Auth/SetupVault";
import UnlockVault from "./Auth/UnlockVault";
import VaultHome from "./Vault/VaultHome";

export default function PasswordHome() {
  const [mode, setMode] = useState("loading");
  const [vault, setVault] = useState([]);
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadVault().then((data) => {
      setMode(data ? "unlock" : "setup");
    });
  }, []);

  if (mode === "setup")
    return (
      <SetupVault
        onDone={(p) => {
          setPassword(p);
          setVault([]);
          setMode("vault");
        }}
      />
    );
  if (mode === "unlock")
    return (
      <UnlockVault
        onUnlock={(v, p) => {
          setVault(v);
          setPassword(p);
          setMode("vault");
        }}
      />
    );
  if (mode === "vault")
    return (
      <VaultHome
        vault={vault}
        password={password}
        onLock={() => setMode("unlock")}
      />
    );

  return null;
}
