import { getAuth } from "firebase/auth";

export const initialStore=()=>{
  return{
    message: null,
    token:null,
    userInfo:null,
    sancionadosData : [
      {
        id: 1,
        usuario: "user123",
        estado: "Suspendido",
        razon: "Acoso",
        tiempo: "3 días",
      },
      {
        id: 2,
        usuario: "bot_spammer",
        estado: "Baneado",
        razon: "Spam repetitivo",
        tiempo: "Permanente",
      },
      {
        id: 3,
        usuario: "trollman",
        estado: "Suspendido",
        razon: "Lenguaje ofensivo",
        tiempo: "12 horas",
      },
      {
        id: 4,
        usuario: "el_flamas",
        estado: "Suspendido",
        razon: "Insultos",
        tiempo: "1 día",
      },
    ],
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ]
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    case 'SET_TOKEN':
      return {
        ...store,
        token:action.payload
      };
    case 'LOAD_TOKEN':
      return {
        ...store,
        token: action.payload
      };
    case 'SET_USER_INFO':
      return {
        ...store,
        userInfo:action.payload
      };
    default:
      return store;
  }    
}
