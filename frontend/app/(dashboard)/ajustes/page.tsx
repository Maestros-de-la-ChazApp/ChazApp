"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Bell, Sliders, Info, ShieldAlert, Check, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IAjustesPageProps } from "@/types";

export const AjustesPage: FC<IAjustesPageProps> = (props) => {
  const router = useRouter();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Ajustes guardados correctamente.");
    }, 800);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="flex flex-col gap-8 p-4 w-full max-w-4xl mx-auto text-left">
      <div>
        <h2 className="text-3xl font-black text-neutral-1000 font-sans tracking-tight">
          Ajustes
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Configura tus preferencias personales y gestiona las notificaciones de ChazApp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Navigation/Groups (visual representation) */}
        <div className="md:col-span-1 flex flex-col gap-3">
          <div className="p-4 bg-primary-300/10 text-primary-200 border border-primary-500/20 font-bold flex items-center gap-3 rounded-tl-2xl rounded-br-2xl rounded-tr-xs rounded-bl-xs">
            <User size={20} />
            <span>Perfil & Cuenta</span>
          </div>
          <div className="p-4 bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200 font-semibold flex items-center gap-3 rounded-tl-2xl rounded-br-2xl rounded-tr-xs rounded-bl-xs transition-all cursor-pointer">
            <Bell size={20} />
            <span>Notificaciones</span>
          </div>
          <div className="p-4 bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200 font-semibold flex items-center gap-3 rounded-tl-2xl rounded-br-2xl rounded-tr-xs rounded-bl-xs transition-all cursor-pointer">
            <Sliders size={20} />
            <span>Preferencias Visuales</span>
          </div>
          
          {/* Mobile-only Logout button */}
          <button
            onClick={handleLogout}
            className="md:hidden p-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold flex items-center gap-3 rounded-tl-2xl rounded-br-2xl rounded-tr-xs rounded-bl-xs transition-all cursor-pointer text-left"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Right Column - Settings Content */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Card 1: Personal Profile */}
          <div className="bg-white border border-neutral-200 p-6 rounded-tl-[32px] rounded-br-[32px] rounded-tr-lg rounded-bl-lg shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <User size={20} className="text-primary-200" />
              <h3 className="text-base font-bold text-neutral-1000">Información del Perfil</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-600">Nombre</label>
                <div className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 text-sm text-neutral-500 rounded-lg">
                  Joel Esteban
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-600">Apellido</label>
                <div className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 text-sm text-neutral-500 rounded-lg">
                  Díaz Arévalo
                </div>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-neutral-600">Correo Electrónico</label>
                <div className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 text-sm text-neutral-500 rounded-lg">
                  jodiaz@unal.edu.co
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Notifications */}
          <div className="bg-white border border-neutral-200 p-6 rounded-tl-[32px] rounded-br-[32px] rounded-tr-lg rounded-bl-lg shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Bell size={20} className="text-primary-200" />
              <h3 className="text-base font-bold text-neutral-1000">Preferencias de Alertas</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-neutral-1000">Alertas por Correo</span>
                  <span className="text-xs text-neutral-600">Recibir resúmenes de sanciones y actividades por correo.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-200 border-neutral-300 focus:ring-primary-200"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-neutral-1000">Notificaciones en Navegador</span>
                  <span className="text-xs text-neutral-600">Activar avisos emergentes para novedades de última hora.</span>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-200 border-neutral-300 focus:ring-primary-200"
                />
              </label>
            </div>
          </div>

          {/* Card 3: Version Info */}
          <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs flex items-center justify-between text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <Info size={16} />
              <span>ChazApp v1.0.0 (Maestros de la Chaza)</span>
            </div>
            <span className="font-mono">Ambiente de Desarrollo</span>
          </div>

          {/* Save Button */}
          <div className="flex justify-end w-full">
            <Button
              variant="primary"
              shape="asymmetric"
              icon={Check}
              isLoading={isSaving}
              onClick={handleSave}
              className="px-6 py-2.5"
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjustesPage;