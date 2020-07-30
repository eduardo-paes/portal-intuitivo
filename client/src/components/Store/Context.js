import { createContext } from 'react';

// -- Definição de token para validação de sessão de login dos usuários
const StoreContext = createContext({
  token: null,
  setToken: () => {},
});

export default StoreContext;