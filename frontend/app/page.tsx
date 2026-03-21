
"use client";
import { Info, Users, LockKeyhole } from "lucide-react";
import { useState } from "react";

export default function Home() {

  const [formData, setFormData] = useState({ usuario: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('TU_API_URL/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      // Lógica de éxito o error aquí
    } catch (error) {
      console.error("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-500 font-sans ">
      <main className="flex min-h-screen w-full mx-auto flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4 bg-[#FAFAFA] w-full max-w-[655px] py-16 rounded-tl-xl rounded-tr-4xl rounded-br-xl rounded-bl-4xl">
          <div className="flex flex-col gap-6 w-full max-w-[90%] md:max-w-[80%]">
            <div className="text-black">
              <h1 className="text-4xl font-bold">Inicio de Sesión</h1>
              <p className="text-lg">Bienvenido a ChazApp</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 text-black">
                <label htmlFor="input">Usuario *</label>
                <div className="flex items-center gap-2">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Users className="text-primary-100" />
                    </div>
                    <input id="input" type="text" placeholder="Usuario" value={formData.usuario} onChange={(e) => setFormData({...formData, usuario: e.target.value})} className="bg-neutral-50 border border-neutral-500 rounded-tl-md rounded-tr-xl rounded-br-md rounded-bl-xl px-2 py-3 w-full pl-12" />
                  </div>
                  <Info className="text-primary-100" size={24}/>
                </div>
                <p className="text-sm text-neutral-500">Este es un mensaje de ayuda</p>
              </div>
              <div className="flex flex-col gap-1 text-black">
                <label htmlFor="input">Contraseña *</label>
                <div className="flex items-center gap-2">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <LockKeyhole className="text-primary-100" />
                    </div>
                    <input id="input" type="password" placeholder="Contraseña" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="bg-neutral-50 border border-neutral-500 rounded-tl-md rounded-tr-xl rounded-br-md rounded-bl-xl px-2 py-3 w-full pl-12" />
                  </div>
                  <Info className="text-primary-100" size={24}/>
                </div>
                <p className="text-sm text-neutral-500">Este es un mensaje de ayuda</p>
              </div>
              <button onClick={handleLogin} formAction="submit" disabled={isLoading} className="bg-primary-200 text-white px-4 py-2 rounded w-fit font-bold rounded-tl-sm rounded-tr-lg rounded-br-sm rounded-bl-lg">{isLoading ? 'Cargando...' : 'Iniciar Sesión'}</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
