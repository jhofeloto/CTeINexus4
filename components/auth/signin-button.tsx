'use client';

import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (session) {
    return (
      <div>
        <p>Hola, {session.user?.name}</p>
        <img src={session.user?.image!} alt="User avatar" style={{ borderRadius: '50%', width: '40px' }} />
        <button onClick={() => signOut()}>Cerrar Sesión</button>
      </div>
    );
  }

  return (
    <div>
      <p>No estás autenticado.</p>
      <button onClick={() => signIn("google")}>Iniciar Sesión con Google</button>
    </div>
  );
}