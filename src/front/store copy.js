import { getAuth } from "firebase/auth";
import imagen3_4 from "./assets/img/city_fondo_3_4.jpg";

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
    denunciasData : [
      {
        id: 1,
        denunciante: "ana2025",
        denunciado: "usuario123",
        tipo: "Comentario",
        motivo: "Lenguaje inapropiado",
        fecha: "2025-06-10",
        estado: "pendiente",
      },
      {
        id: 2,
        denunciante: "juan_dev",
        denunciado: "spamBot",
        tipo: "Reporte",
        motivo: "Spam",
        fecha: "2025-06-09",
        estado: "pendiente",
      },
      {
        id: 3,
        denunciante: "lucia33",
        denunciado: "user456",
        tipo: "Foto",
        motivo: "Violación de privacidad",
        fecha: "2025-06-08",
        estado: "pendiente",
      },
    ],
    posts : [
      {
        id: 1,
        user: { name: "Juan Pérez", avatar: "https://i.pravatar.cc/50?img=10" },
        imageUrl: imagen3_4,
        title: "Bache enorme en la calle principal",
        likes: 34,
        positiveVotes: 40,
        negativeVotes: 5,
        comments: [],
      },
      {
        id: 2,
        user: { name: "María López", avatar: "https://i.pravatar.cc/50?img=20" },
        imageUrl: imagen3_4,
        title: "Luminaria rota en el parque",
        likes: 18,
        positiveVotes: 20,
        negativeVotes: 2,
        comments: [],
      },
      {
        id: 3,
        user: { name: "Luis García", avatar: "https://i.pravatar.cc/50?img=15" },
        imageUrl: imagen3_4,
        title: "Contenedor de basura desbordado",
        likes: 25,
        positiveVotes: 30,
        negativeVotes: 3,
        comments: [],
      },
    ],
    votedPosts: {
      1: { up: true, down: false },
      2: { up: false, down: false },
    },
    reporte : {
      titulo:
        "Gran rotura de las vías del tren a la altura de la avenida de América",
      imagen: imagen3_4,
      descripcion:
        "Este es un texto descriptivo del reporte que explica qué pasó, detalles, etc.",
      votosPositivos: 123,
      votosNegativos: 4,
      meGusta: 98,
      usuario: {
        nombre: "Juan Pérez",
        avatar: "https://i.pravatar.cc/50?img=22",
      },
      comentarios: [
        { id: 1, usuario: "Ana", texto: "Muy útil este reporte, gracias!" },
        { id: 2, usuario: "Luis", texto: "¿Hay más detalles disponibles?" },
        { id: 3, usuario: "Maria", texto: "Apoyo esta denuncia." },
      ],
    },
    favoritos : [
      {
        id: 1,
        user: { name: "Juan Pérez", avatar: "https://i.pravatar.cc/50?img=10" },
        imageUrl: imagen3_4,
      },
      {
        id: 2,
        user: { name: "María López", avatar: "https://i.pravatar.cc/50?img=20" },
        imageUrl: imagen3_4,
      },
      {
        id: 3,
        user: { name: "Luis García", avatar: "https://i.pravatar.cc/50?img=15" },
        imageUrl: imagen3_4,
      },
      {
        id: 4,
        user: { name: "Ana Ruiz", avatar: "https://i.pravatar.cc/50?img=30" },
        imageUrl: imagen3_4,
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
    case 'TOGGLE_LIKE':
      return {
        ...store,
        likedPosts: {
          ...store.likedPosts,
          [action.payload]: !store.likedPosts?.[action.payload],
        },
      };
    case 'VOTE_POST':
        const { postId, voteType } = action.payload;
        const updatedPosts = store.posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              positiveVotes: voteType === 'up' ? post.positiveVotes + 1 : post.positiveVotes,
              negativeVotes: voteType === 'down' ? post.negativeVotes + 1 : post.negativeVotes,
            };
          }
          return post;
        });

        return {
          ...store,
          posts: updatedPosts,
          votedPosts: {
            ...store.votedPosts,
            [postId]: {
              up: voteType === 'up',
              down: voteType === 'down',
            },
          },
        };

  
    default:
      return store;
  }    
}
