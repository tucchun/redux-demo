export const REQUEST_POSTS = 'REQUEST_POSTS'; // request post
export const RECEIVE_POSTS = 'RECEIVE_POSTS'; // receive post
export const SELECT_REDDIT = 'SELECT_REDDIT'; // select reddit
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'; // invalidate reddit 过期

export const selectReddit = reddit => ({type: SELECT_REDDIT, reddit})

export const invalidateReddit = reddit => ({type: INVALIDATE_REDDIT, reddit})

export const requestPosts = reddit => ({type: REQUEST_POSTS, reddit});

export const receivePosts = (reddit, json) => ({
  type: RECEIVE_POSTS,
  reddit,
  posts: json.data.children.map(child => child.data),
  receivedAt: Date.now()
})

const fetchPosts = reddit => dispatch => {
  dispatch(requestPosts(reddit));
  return fetch(`../src/rss/${reddit}.json`)
  .then(response => {
    debugger;
    return response.json();
  })
  .then(json => dispatch(receivePosts(reddit, json))).catch(err => {
    console.log(err)
  });
}

const shouldFetchPosts = (state, reddit) => {
  const posts = state.postsByReddit[reddit];
  if(!posts){
    return true;
  }
  if(posts.isFetching){
    return false;
  }
  return posts.didInvalidate;
}

export const fetchPostsIfNeeded = reddit => (dispatch, getState) => {
  if(shouldFetchPosts(getState(), reddit)){
    return dispatch(fetchPosts(reddit));
  }
}
