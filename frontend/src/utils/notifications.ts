import { toast } from "sonner";

export const notify = {
  created: (entity: string) =>
    toast.success(`${entity} criado(a) com sucesso!`),

  returned: (entity: number) =>
    toast.success(`${entity} devolvido(a) com sucesso!`),

  updated: (entity: string) =>
    toast.success(`${entity} atualizado(a) com sucesso!`),

  deleted: (entity: string) =>
    toast.success(`${entity} excluído(a) com sucesso!`),

  error: (message: string) => toast.error(message),

  warning: (message: string, description?: string) =>
    toast.warning(message, {
      description,
    }),

  info: (message: string, description?: string) =>
    toast.info(message, {
      description,
    }),
};
