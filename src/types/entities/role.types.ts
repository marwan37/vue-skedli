export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
    crud?: boolean;
  };
}
