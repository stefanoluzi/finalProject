export const reducer = (state, action) => {
    switch(action.type) {
        case 'ADD_FAV':
            return {...state, favs: [...state.favs, action.payload]};
        case 'GET_LIST':
            return {...state, data: action.payload};
        case 'GET_SELECTED':
            return {...state, recipeSelected: action.payload};
        case 'CHANGE_THEME':
            return {...state, theme: action.payload};
        case 'REMOVE_FAVORITE':
            return {...state, favs: state.favs.filter(item => item.id !== action.payload)};
        case 'INIT_FAVS':
            return {...state, favs: action.payload};
        case 'EDIT_WEEK':
            return {...state, plannedWeeks: action.payload};
        default:
            return state;
    }
}