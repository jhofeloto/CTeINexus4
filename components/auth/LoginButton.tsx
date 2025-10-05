"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Cargando...</p>;

  if (session?.user) {
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <img
          src={session.user.image ?? ""}
          alt="avatar"
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
        <span>Hola, {session.user.name ?? "usuario"}</span>
        <button onClick={() => signOut()}>Cerrar Sesión</button>
      </div>
    );
  }

  return <button onClick={() => signIn("google")}>Iniciar Sesión con Google</button>;
}