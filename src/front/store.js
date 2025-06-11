import { getAuth } from "firebase/auth";

export const initialStore=()=>{
  return{
    message: null,
    token:null,
    userInfo:null,
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
