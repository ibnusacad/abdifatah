const fontAwesome = document.createElement('link');
fontAwesome.setAttribute('rel', 'stylesheet');
fontAwesome.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css');
document.head.appendChild(fontAwesome);


const mealsDiv = document.querySelector('.meals');
const numberOfMeals = document.querySelector('.numberOfMeals');
const fetchAllMeals = async () => {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
  const data = await response.json();
  return data;
};




const fetchMealById = async (mealId) => {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealId);
    const data = await response.json();
    return data;
};


const getLikes = async ()=>{
    let uri =  `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/R0U3YhWaag3EdpAQTbkm/likes`
    const response = await fetch(uri);
    const data = await response.json();
    return data;
    
}

const postLikes = async (id)=>{
    let uri =  `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/R0U3YhWaag3EdpAQTbkm/likes`
    const response = await fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item_id: id
        }),
    });
    const data = await response.text();
    return data;
    
}


const updateUI = (id, likes) => {
    let meal = document.getElementById(id);
    let mealInfoDiv = meal.querySelector('.mealInfo');
    let mealLikesDiv = mealInfoDiv.querySelector('.likes');
    mealLikesDiv.innerHTML = likes;
}
const updateUIWithComments = (comment) => {
    let commentsDiv = document.querySelector('.comments');
    commentsDiv.innerHTML += `
    <div class="comment">
        <div class="comment-header">
            <h5 class="comment-author">${comment.username}</h5>
            <span class="comment-date">${comment.creation_date}</span>
        </div>
        <p class="comment-body">${comment.comment}</p>
    </div>
    `;
}

const updateUINumberOfComments = (comments) => {
    let totalComments = document.querySelector('.comment-total');
    totalComments.innerHTML = comments.length;
}

const clearCommentsInput = () => {
    let username = document.getElementById('username');
    let comment = document.getElementById('comment');
    username.value = '';
    comment.value = '';

}

const checkCommentsInput = () => {
    let username = document.getElementById('username');
    let comment = document.getElementById('comment');
    if(username.value === '' || comment.value === '') {
        return false;
    }
    return true;
}



const getComments = async (id)=>{
    let uri =  `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/R0U3YhWaag3EdpAQTbkm/comments?item_id=${id}`
    const response = await fetch(uri);
    const data = await response.json();
    return data;
    
}

const postComments = async (id, comment,user)=>{
    let uri =  `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/R0U3YhWaag3EdpAQTbkm/comments`
    const response = await fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            item_id: id,
            username: user,
            comment: comment
        }),
    });
    const data = await response.text();
    return data;
    
}



const addComment = async (id, comment,user,e)=>{
    e.preventDefault();
    if(!checkCommentsInput()) return;
    let comments = await postComments(id, comment,user);
    if(comments.error) return;
    let Comments = await getComments(id);
    let lastComment = Comments[Comments.length - 1];
    updateUIWithComments(lastComment);
    updateUINumberOfComments(Comments);
    clearCommentsInput();

}



const mealsWithLikes = async ()=>{
    let meals = await fetchAllMeals();
    let likes = await getLikes();
    let mealsWithLikes = meals.meals.map(meal => {
        let likesCount = likes.filter(like => like.item_id === meal.idMeal);
        meal.likes = likesCount[0]?.likes || 0;
        return meal;
    });
    return mealsWithLikes;
}


const like = async (id)=>{
    let likes = await postLikes(id);
    getLikes().then(data => {
        let likesCount = data.filter(like => like.item_id === id);
        updateUI(id, likesCount[0]?.likes);
    });
}


//popup
const popup = async (mealId) => {
    let meal = fetchMealById(mealId);
    let Comments = await getComments(mealId);


    meal.then(data => {
        const meal = data.meals[0];
        const mealPopup = document.createElement('div');
        mealPopup.classList.add('meal-popup');
        mealPopup.innerHTML = `
            <span onclick="closePopup()" class="close-popup"><i class="fas fa-times"></i></span>
            <div class="mealInfo" id="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
                <div class="meal-img">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                </div>
            </div>
            <div class="meal-details">
                <h4>Ingredients</h4>
                <ul>
                    
                    <li style="${meal.strIngredient1 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient1}</li>
                    <li style="${meal.strIngredient2 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient2}</li>
                    <li style="${meal.strIngredient3 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient3}</li>
                    <li style="${meal.strIngredient4 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient4}</li>
                    <li style="${meal.strIngredient5 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient5}</li>
                    <li style="${meal.strIngredient6 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient6}</li>
                    <li style="${meal.strIngredient7 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient7}</li>
                    <li style="${meal.strIngredient8 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient8}</li>
                    <li style="${meal.strIngredient9 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient9}</li>
                    <li style="${meal.strIngredient10 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient10}</li>
                    <li style="${meal.strIngredient11 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient11}</li>
                    <li style="${meal.strIngredient12 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient12}</li>
                    <li style="${meal.strIngredient13 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient13}</li>
                    <li style="${meal.strIngredient14 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient14}</li>
                    <li style="${meal.strIngredient15 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient15}</li>
                    <li style="${meal.strIngredient16 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient16}</li>
                    <li style="${meal.strIngredient17 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient17}</li>
                    <li style="${meal.strIngredient18 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient18}</li>
                    <li style="${meal.strIngredient19 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient19}</li>
                    <li style="${meal.strIngredient20 ? '' : 'display: none'}" class="ingredient">${meal.strIngredient20}</li>

                </ul>
            </div>
            <div class="meal-comments">
                <h4>Comments <span class="comment-total">${Comments.length > 0 ? Comments.length : "0"}</h4>
                <form class="comment-form">
                    <div class="form-control">
                        <label for="username">Username</label>
                        <input type="text" id="username" placeholder="Enter your username">
                    </div>
                    <div class="form-control">
                        <label for="comment">Comment</label>
                        <textarea id="comment" placeholder="Enter your comment"></textarea>
                    </div>
                    <button type="submit" class="comment-btn" onclick="addComment('${meal.idMeal}', document.getElementById('comment').value, document.getElementById('username').value, event)">Comment</button>
                    
                </form>
                <div class="comments">
                    ${Comments.length > 0 ? Comments.map(comment => {
                        return `
                            <div class="comment">
                                <div class="comment-header">
                                    <h5 class="comment-author">${comment.username}</h5>
                                    <span class="comment-date">${comment.creation_date}</span>
                                </div>
                                <p class="comment-body">${comment.comment}</p>
                            </div>
                        `;
                    }).join('') : 'No comments yet'}
                </div>
            </div>

            `;
            mealPopup.style.display = 'flex';
            //scroll to none to prevent scrolling when popup is open
            document.body.style.overflow = 'hidden';
            mealPopup.style.overflowY = 'scroll';




        mealsDiv.appendChild(mealPopup);
    });

};

const closePopup = () => {
    document.querySelector('.meal-popup').remove();
    
    document.body.style.overflow = 'scroll';
};


const listAllMeals = async () => {
    let allMeals = await mealsWithLikes();

    const meals = document.querySelector('.meals');
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = `
        <div class="spinner">
            <i class="fas fa-utensils"></i>
        </div>
    `;

    meals.appendChild(loading);


    //show meals
    allMeals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal';
        mealDiv.id = meal.idMeal;
        mealDiv.innerHTML = `
            <div class="meal-image"">
                <img src="${meal.strMealThumb}" alt="meal">
            </div>
            <div class="mealInfo">
                <h3>${meal.strMeal}</h3>
                <span class="view" onclick="popup(${meal.idMeal})">View</span>
               <i onclick="${like(meal.idMeal)}" class="fas fa-heart"></i>         
                <span class="likes">${meal.likes}</span>
            </div>
        `;

        
        mealsDiv.appendChild(mealDiv);
        //remove loading after meals are shown
        loading.remove();

    });
    numberOfMeals.innerHTML = `Meals [${allMeals.length}]`;
};

listAllMeals(); 