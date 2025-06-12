
export const initialStore=()=>{
  return{
    user: localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')) : null,
    recipes: [],
    recipe: null,
    collections: null,
    scores: null,
    shoppingList: [
      "Cauliflower",
      "Tomato",
      "Mozzarella cheese",
      "Eggs",
      "Olive oil",
      "Pepper",
      "Salt",
      "Wheat flour",
    ],
    message: null,
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
    case 'logout':

      //remove the client token and info from local
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return {
        ...store,
        user: null
      };
    
    case 'logIn':
      return {
        ...store,
        user: action.payload
      };

    case 'get_user':
      return {
        ...store,
        user: action.payload
      };
    
    case 'add_user':
      return {
        ...store,
        user: action.payload
      };

    case 'get_all_recipes':
      return {
        ...store,
        recipes: action.payload
      };
    case 'get_one_recipe':
      return {
        ...store,
        recipe: action.payload
      };

    case 'get_all_scores':
      return {
        ...store,
        scores: action.payload
      };

    case 'like':
      return {
        ...store,
        scores: [...store.scores, action.payload.recipe_id]
      };
    
    case 'unlike':
      localStorage.removeItem('recipe_id')
      return {
        ...store,
        scores: store.scores.filter(id => id !== action.payload.recipe_id)
      };

    case 'remove_ingredient':
      return {
        ...store,
        shoppingList: store.shoppingList.filter((_, i) => i !== action.payload)
      };

      case 'reset_shopping_list':
        return {
          ...store,
          shoppingList: []
        };

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

      case 'get_user_collections':
      return {
        ...store,
        collections: action.payload
      };

      case 'add_to_collection':
        return {
          ...store,
          collections: [...store.collections, action.payload]
        };
        
      case 'remove_from_collection':
        return {
        ...store,
        collections: store.collections.filter(id => id !== action.payload)
      };



    default:
      throw Error('Unknown action.');
  }    
}
