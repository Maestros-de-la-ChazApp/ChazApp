import { FC } from "react";
import { IAjustesPageProps } from "@/types";

export const AjustesPage: FC<IAjustesPageProps> = (props) => {
    return (
        <div>
            <h2 className="text-2xl font-bold">Control</h2>
            <p>Esta es la página de control</p>
            <h3 className="text-xl font-semibold">Funcionalidades:</h3>
            <ul>
                <li>Control de chazas</li>
                <li>Control de estudiantes</li>
                <li>Control de asistentes</li>
            </ul>
        </div>
    );
}

export default AjustesPage;
