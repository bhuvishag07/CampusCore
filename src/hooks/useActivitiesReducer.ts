import { useReducer } from 'react';
import { Activity, ActivityCategory } from '@/types';

type ActivityAction =
  | { type: 'SET_ITEMS'; payload: Activity[] }
  | { type: 'FILTER_CATEGORY'; payload: ActivityCategory }
  | { type: 'ADD_ITEM'; payload: Activity }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'PIN_ITEM'; payload: string }
  | { type: 'CLEAR_ALL' };

interface ActivityLocalState {
  rawItems: Activity[];
  category: ActivityCategory;
  pinnedIds: string[];
}

function activityStateReducer(state: ActivityLocalState, action: ActivityAction): ActivityLocalState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, rawItems: action.payload };
    case 'FILTER_CATEGORY':
      return { ...state, category: action.payload };
    case 'ADD_ITEM':
      return { ...state, rawItems: [action.payload, ...state.rawItems] };
    case 'REMOVE_ITEM':
      return {
        ...state,
        rawItems: state.rawItems.filter((item) => item.id !== action.payload),
        pinnedIds: state.pinnedIds.filter((id) => id !== action.payload),
      };
    case 'PIN_ITEM':
      return {
        ...state,
        pinnedIds: state.pinnedIds.includes(action.payload)
          ? state.pinnedIds.filter((id) => id !== action.payload)
          : [...state.pinnedIds, action.payload],
      };
    case 'CLEAR_ALL':
      return { ...state, rawItems: [], pinnedIds: [] };
    default:
      return state;
  }
}

export function useActivitiesReducer(initialItems: Activity[] = []) {
  const [state, dispatch] = useReducer(activityStateReducer, {
    rawItems: initialItems,
    category: 'All',
    pinnedIds: [],
  });

  const filteredItems = state.rawItems.filter((act) => {
    if (state.category === 'All') return true;
    return act.category === state.category;
  });

  return {
    items: filteredItems,
    allCount: state.rawItems.length,
    pinnedIds: state.pinnedIds,
    category: state.category,
    setItems: (items: Activity[]) => dispatch({ type: 'SET_ITEMS', payload: items }),
    filterCategory: (cat: ActivityCategory) => dispatch({ type: 'FILTER_CATEGORY', payload: cat }),
    addItem: (item: Activity) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
    togglePin: (id: string) => dispatch({ type: 'PIN_ITEM', payload: id }),
    clearAll: () => dispatch({ type: 'CLEAR_ALL' }),
  };
}
