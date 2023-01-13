/* eslint-disable no-unused-vars */

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
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const data = await response.json();
  return data;
};

const getLikes = async () => {
  const uri = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/R0U3YhWaag3EdpAQTbkm/likes';
  const response = await fetch(uri);
  const data = await response.json();
  return data;
};

const postLikes = async (id) => {
  const uri = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/R0U3YhWaag3EdpAQTbkm/likes';
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      item_id: id,
    }),
  });
  const data = await response.text();
  return data;
};

const updateUI = (id, likes) => {
  const meal = document.getElementById(id);
  const mealInfoDiv = meal.querySelector('.mealInfo');
  const mealLikesDiv = mealInfoDiv.querySelector('.likes');
  mealLikesDiv.innerHTML = likes;
};
const updateUIWithComments = (comment) => {
  const commentsDiv = document.querySelector('.comments');
  commentsDiv.innerHTML += `
    <div class="comment">
        <div class="comment-header">
            <h5 class="comment-author">${comment.username}</h5>
            <span class="comment-date">${comment.creation_date}</span>
        </div>
        <p class="comment-body">${comment.comment}</p>
    </div>
    `;
};

const updateUINumberOfComments = (comments) => {
  const totalComments = document.querySelector('.comment-total');
  totalComments.innerHTML = comments.length;
};

const clearCommentsInput = () => {
  const username = document.getElementById('username');
  const comment = document.getElementById('comment');
  username.value = '';
  comment.value = '';
};

const checkCommentsInput = () => {
  const username = document.getElementById('username');
  const comment = document.getElementById('comment');
  if (username.value === '' || comment.value === '') {
    return false;
  }
  return true;
};

const getComments = async (id) => {
  const uri = `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/R0U3YhWaag3EdpAQTbkm/comments?item_id=${id}`;
  const response = await fetch(uri);
  const data = await response.json();
  return data;
};

const postComments = async (id, comment, user) => {
  const uri = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/R0U3YhWaag3EdpAQTbkm/comments';
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      item_id: id,
      username: user,
      comment,
    }),
  });
  const data = await response.text();
  return data;
};

const addComment = async (id, comment, user, e) => {
  e.preventDefault();
  if (!checkCommentsInput()) return;
  const comments = await postComments(id, comment, user);
  if (comments.error) return;
  const Comments = await getComments(id);
  const lastComment = Comments[Comments.length - 1];
  updateUIWithComments(lastComment);
  updateUINumberOfComments(Comments);
  clearCommentsInput();
};

const mealsWithLikes = async () => {
  const meals = await fetchAllMeals();
  const likes = await getLikes();
  const mealsWithLikes = meals.meals.map((meal) => {
    const likesCount = likes.filter((like) => like.item_id === meal.idMeal);
    meal.likes = likesCount[0]?.likes || 0;
    return meal;
  });
  return mealsWithLikes;
};

const like = async (id) => {
  const likes = await postLikes(id);
  getLikes().then((data) => {
    const likesCount = data.filter((like) => like.item_id === id);
    updateUI(id, likesCount[0]?.likes);
  });
};

// popup
const popup = async (mealId) => {
  const meal = fetchMealById(mealId);
  const Comments = await getComments(mealId);

  meal.then((data) => {
    const meal = data.meals[0];
    const mealPopup = document.createElement('div');
    mealPopup.classList.add('meal-popup');
    mealPopup.innerHTML = `
            <span class="close-popup"><i class="fas fa-times"></i></span>
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
                <h4>Comments <span class="comment-total">${Comments.length > 0 ? Comments.length : '0'}</h4>
                <form class="comment-form">
                    <div class="form-control">
                        <label for="username">Username</label>
                        <input type="text" id="username" placeholder="Enter your username">
                    </div>
                    <div class="form-control">
                        <label for="comment">Comment</label>
                        <textarea id="comment" placeholder="Enter your comment"></textarea>
                    </div>
                    <button type="submit" class="comment-btn">Comment</button>
                    
                </form>
                <div class="comments">
                    ${Comments.length > 0 ? Comments.map((comment) => `
                            <div class="comment">
                                <div class="comment-header">
                                    <h5 class="comment-author">${comment.username}</h5>
                                    <span class="comment-date">${comment.creation_date}</span>
                                </div>
                                <p class="comment-body">${comment.comment}</p>
                            </div>
                        `).join('') : 'No comments yet'}
                </div>
            </div>

            `;
    mealPopup.style.display = 'flex';
    // scroll to none to prevent scrolling when popup is open
    document.body.style.overflow = 'hidden';
    mealPopup.style.overflowY = 'scroll';

    mealsDiv.appendChild(mealPopup);

    //comment form
    const commentForm = document.querySelector('.comment-form');
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.querySelector('#username').value;
      const comment = document.querySelector('#comment').value;
      addComment(meal.idMeal, username, comment,e);
    });

    // close popup

    const closeBtn = document.querySelector('.close-popup');
    closeBtn.addEventListener('click', () => {
      mealPopup.remove();
    });
  });
};

const listAllMeals = async () => {
  const allMeals = await mealsWithLikes();

  const meals = document.querySelector('.meals');
  // show meals
  allMeals.forEach((meal) => {
    const mealDiv = document.createElement('div');
    mealDiv.className = 'meal';
    mealDiv.id = meal.idMeal;
    mealDiv.innerHTML = `
            <div class="meal-image"">
                <img src="${meal.strMealThumb}" alt="meal">
            </div>
            <div class="mealInfo">
                <h3>${meal.strMeal}</h3>
                <span class="view">View</span>
               <i class="like fas fa-heart"></i>         
                <span class="likes">${meal.likes}</span>
            </div>
        `;

    const view = mealDiv.querySelector('.view');
    view.addEventListener('click', () => {
      popup(meal.idMeal);
    });

    const likeBtn = mealDiv.querySelector('.like');
    likeBtn.addEventListener('click', () => {
      like(meal.idMeal);
    });

    mealsDiv.appendChild(mealDiv);
  });
  numberOfMeals.innerHTML = `Meals [${allMeals.length}]`;
};

listAllMeals();