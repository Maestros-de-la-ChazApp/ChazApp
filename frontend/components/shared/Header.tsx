import { Shield, Store } from "lucide-react";
import Image from "next/image";

export const Header = () => {
    return (
        <header className="flex w-full items-center justify-between bg-primary-200 border-b border-gray-200 mb-8">
        <div className="w-full  items-center flex justify-between py-6">
          <div className="w-[100px] h-[100px] bg-white rounded-b-full absolute top-0 left-[100px] shadow-lg hidden md:block">
              <a href="https://unal.edu.co/" target="_blank" rel="noopener" className="icon-link">
                  <Image src="/assets/logo_unal_circle.png" alt="Escudo de UNAL" width={100} height={100} className="w-full h-full" />
              </a>
          </div>
        <div className="flex items-center gap-2 text-white ml-4 md:ml-56">
          <Store size={28} />
          <h1 className="text-xl font-bold font-sans">ChazApp</h1>
        </div>
        </div>
      </header>
    );
}
