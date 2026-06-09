import { FC } from "react";
import { IGestionPageProps } from "@/types";

export const GestionPage: FC<IGestionPageProps> = (props) => {
    return (
        <div>
            <h2 className="text-2xl font-bold">Gestión</h2>
            <h3 className="text-xl font-semibold">Funcionalidades:</h3>
            <ul>
                <li><a href="/gestion/chaceros">Formularios de registro de chaceros</a></li>
            </ul>
        </div>
    );
}

export default GestionPage;
