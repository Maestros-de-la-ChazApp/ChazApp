export interface IGestionPageProps {
    user: User;
}
export interface IControlPageProps {
    user: User;
}
export interface IAjustesPageProps {
    user: User;
}
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}
