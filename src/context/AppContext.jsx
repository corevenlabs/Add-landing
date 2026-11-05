import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { getCatalog } from '../services/catalogService';

const AppContext = createContext(null);
const initialState = { data: { products: [], categories: [], materials: [], steps: [], faqs: [] }, status: 'loading', error: null, filter: 'all', material: 'Acero inoxidable' };

function reducer(state, action) {
  switch (action.type) {
    case 'loaded': return { ...state, data: action.data, status: 'ready', error: null };
    case 'error': return { ...state, status: 'error', error: action.error };
    case 'filter': return { ...state, filter: action.value };
    case 'material': return { ...state, material: action.value };
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [revision, retry] = useReducer((value) => value + 1, 0);
  useEffect(() => {
    const controller = new AbortController();
    getCatalog({ signal: controller.signal })
      .then((data) => dispatch({ type: 'loaded', data }))
      .catch((error) => { if (error.name !== 'AbortError') dispatch({ type: 'error', error: error.message }); });
    return () => controller.abort();
  }, [revision]);
  const setFilter = useCallback((value) => dispatch({ type: 'filter', value }), []);
  const setMaterial = useCallback((value) => dispatch({ type: 'material', value }), []);
  const value = useMemo(() => ({ ...state, setFilter, setMaterial, retry }), [state, setFilter, setMaterial]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp debe utilizarse dentro de AppProvider.');
  return context;
}
