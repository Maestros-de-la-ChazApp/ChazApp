"use client";

import { FC, useState, useEffect } from "react";
import { Plus, UserCheck, Shield, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Form } from "@/components/ui/Form";
import { ListItem } from "@/components/ui/ListItem";
import { ListContainer } from "@/components/ui/ListContainer";
import { Pagination } from "@/components/ui/Pagination";
import { FormField } from "@/types";
import { API_BASE_URL } from "@/constants";

export const UsuariosPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [initialFormData, setInitialFormData] = useState<Record<string, unknown>>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const fetchUsuarios = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsuarios(data);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [token]);

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedUser(null);
    setInitialFormData({
      email: "",
      password: "",
      rol: "Celador",
      activo: "true"
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: any) => {
    setModalMode("edit");
    setSelectedUser(user);
    setInitialFormData({
      email: user.email || "",
      password: "", // Ask for new password or keep blank
      rol: user.rol || "Celador",
      activo: user.activo ? "true" : "false"
    });
    setIsModalOpen(true);
  };

  const handleDeleteAction = async () => {
    if (!selectedUser) return;
    if (confirm(`¿Desea eliminar permanentemente al usuario ${selectedUser.email}?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${selectedUser.id_usuario}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          alert("Usuario eliminado exitosamente.");
          setIsModalOpen(false);
          fetchUsuarios();
        } else {
          throw new Error("Error al eliminar");
        }
      } catch (error) {
        console.error(error);
        alert("Error al eliminar el usuario.");
      }
    }
  };

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      const payload = {
        email: data.email,
        password: data.password,
        rol: data.rol,
        activo: data.activo === "true"
      };

      let response;
      if (modalMode === "create") {
        response = await fetch(`${API_BASE_URL}/usuarios`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${API_BASE_URL}/usuarios/${selectedUser.id_usuario}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        alert(modalMode === "create" ? "Usuario creado exitosamente." : "Usuario actualizado exitosamente.");
        setIsModalOpen(false);
        fetchUsuarios();
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al guardar el usuario.");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error al procesar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldsConfig: FormField[] = [
    {
      name: "email",
      label: "Correo Institucional / de Usuario",
      type: "email",
      placeholder: "usuario@unal.edu.co",
      required: true
    },
    {
      name: "password",
      label: modalMode === "create" ? "Contraseña" : "Nueva Contraseña",
      type: "password",
      placeholder: "••••••••",
      required: true
    },
    {
      name: "rol",
      label: "Rol de Usuario",
      type: "select",
      required: true,
      options: [
        { label: "Administrador", value: "Admin" },
        { label: "Seguridad", value: "Seguridad" },
        { label: "Celador", value: "Celador" }
      ]
    },
    {
      name: "activo",
      label: "Estado de Cuenta",
      type: "select",
      required: true,
      options: [
        { label: "Activo (Permite ingreso)", value: "true" },
        { label: "Inactivo (Bloquea ingreso)", value: "false" }
      ]
    }
  ];

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsuarios = usuarios.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col gap-6 p-4 w-full max-w-5xl mx-auto items-center">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-4 w-full text-left">
        <div>
          <h2 className="text-3xl font-black text-neutral-1000 font-sans">
            Usuarios
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Administra los usuarios del sistema, sus roles de acceso y credenciales.
          </p>
        </div>

        <Button
          variant="primary"
          shape="asymmetric"
          icon={Plus}
          onClick={handleOpenCreateModal}
          className="w-full md:w-auto"
        >
          Registrar usuario
        </Button>
      </div>

      {/* Users List */}
      <div className="w-full flex flex-col items-center gap-4">
        <ListContainer>
          {currentUsuarios.length > 0 ? (
            currentUsuarios.map((user) => (
              <ListItem
                key={user.id_usuario}
                id={String(user.id_usuario)}
                primaryText={user.email}
                secondaryText={`Rol: ${user.rol}`}
                tertiaryText={user.activo ? "ACTIVO" : "INACTIVO"}
                icon={Shield}
                onEdit={() => handleOpenEditModal(user)}
                rightElement={
                  <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-md">
                    ID #{user.id_usuario}
                  </span>
                }
              />
            ))
          ) : (
            <div className="w-full py-8 text-center text-sm text-neutral-500 italic bg-white border border-neutral-200 rounded-tl-xl rounded-br-xl shadow-xs">
              No hay usuarios registrados en el sistema
            </div>
          )}
        </ListContainer>

        <Pagination
          totalItems={usuarios.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Form
          title={modalMode === "create" ? "Registrar Usuario" : "Editar Usuario"}
          subtitle2={
            modalMode === "create"
              ? "Cree credenciales para un nuevo miembro del equipo."
              : "Actualice las credenciales o el rol del usuario."
          }
          fields={fieldsConfig}
          submitLabel={modalMode === "create" ? "Registrar usuario" : "Actualizar"}
          submitIcon={modalMode === "create" ? Plus : UserCheck}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          onDelete={modalMode === "edit" ? handleDeleteAction : undefined}
          deleteLabel="Eliminar Usuario"
          initialData={initialFormData}
          isLoading={isSubmitting}
        />
      </Modal>

    </div>
  );
};

export default UsuariosPage;
