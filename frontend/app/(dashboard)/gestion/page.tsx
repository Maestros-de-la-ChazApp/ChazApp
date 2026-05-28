import { FC } from "react";
import { IGestionPageProps } from "@/types";

export const GestionPage: FC<IGestionPageProps> = (props) => {
    return (
        <div>
            <h2 className="text-2xl font-bold">Gestión</h2>
            <p>Esta es la página de gestión</p>
            <h3 className="text-xl font-semibold">Funcionalidades:</h3>
            <ul>
                <li>Formularios de registro de estudiantes</li>
                <li>Formularios de registro de chazas</li>
                <li>Consultar chaza</li>
            </ul>
        </div>
    );
}

export default GestionPage;
