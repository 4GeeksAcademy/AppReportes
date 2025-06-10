// Import necessary hooks and functions from React.
import { useContext, useReducer, createContext, useEffect } from "react";
import storeReducer, { initialStore } from "../store"  // Import the reducer and the initial state.
import { getAuth } from "firebase/auth";

// Create a context to hold the global state of the application
// We will call this global state the "store" to avoid confusion while using local states
const StoreContext = createContext()

// Define a provider component that encapsulates the store and warps it in a context provider to 
// broadcast the information throught all the app pages and components.
export function StoreProvider({ children }) {
    // Initialize reducer with the initial state.
    const [store, dispatch] = useReducer(storeReducer, initialStore())
    //El primer useEffect de mi aplicacion
    // se utiliza para inicializar cosas
    useEffect(() => {
        const unsubscribe = getAuth().onAuthStateChanged(async (user) => {
            if (!user) {
            // No hay usuario, puede que haya cerrado sesión
            console.warn("No hay usuario autenticado.");
            return;
            }

            try {
            const token = await user.getIdToken();
            dispatch({ type: "LOAD_TOKEN", payload: token });
            } catch (error) {
            console.error("Error al obtener el token:", error);
            }
        });

        return () => unsubscribe(); // buena práctica: limpiar el listener
        }, []);

    
    // Provide the store and dispatch method to all child components.
    return <StoreContext.Provider value={{ store, dispatch }}>
        {children}
    </StoreContext.Provider>
}

// Custom hook to access the global state and dispatch function.
export default function useGlobalReducer() {
    const { dispatch, store } = useContext(StoreContext)
    return { dispatch, store };
}