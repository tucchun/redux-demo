export const REQUEST_POSTS = 'REQUEST_POSTS'; // request post
export const RECEIVE_POSTS = 'RECEIVE_POSTS'; // receive post
export const SELECT_REDDIT = 'SELECT_REDDIT'; // select reddit
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'; // invalidate reddit 过期

export const selectReddit = reddit => ({type: SELECT_REDDIT, reddit})

export const invalidateReddit = reddit => ({type: INVALIDATE_REDDIT, reddit})

export const requestPosts = reddit => ({type: REQUEST_POSTS, reddit});

export const receivePosts = (reddit, json) => ({type: RECEIVE_POSTS, reddit, posts: json.data.children, receivedAt: Date.now()})

/*
{
  selectedsubreddit: 'frontend',
  postsBySubreddit: {
    frontend: {
      isFetching: true,
      didInvalidate: false,
      items: []
    },
    reactjs: {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: 1439478405547,
      items: [
        {
          id: 42,
          title: 'Confusion about Flux and Relay'
        },
        {
          id: 500,
          title: 'Creating a Simple Application Using React JS and Flux Architecture'
        }
      ]
    }
  }
}
*/

const data = {
  frontend: {
    "data": {
      "children": [
        {
          id: 1,
          "title": "1"
        }, {
          id: 2,
          "title": "2"
        }, {
          id: 3,
          "title": "3"
        }
      ]
    }
  },
  reactjs: {
    "data": {
      "children": [
        {
          id: 4,
          "title": "4"
        }, {
          id: 5,
          "title": "5"
        }, {
          id: 6,
          "title": "6"
        }
      ]
    }
  }
};

const fetchPosts = reddit => dispatch => {
  dispatch(requestPosts(reddit));
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data[reddit]);
    }, 1 * 1000);
  }).then(json => dispatch(receivePosts(reddit, json)));
  // return fetch(`../src/rss/${reddit}.json`)
  // .then(response => {
  //   debugger;
  //   return response.json();
  // })
  // .then(json => dispatch(receivePosts(reddit, json))).catch(err => {
  //   console.log(err)
  // });
}

const shouldFetchPosts = (state, reddit) => {
  const posts = state.postsByReddit[reddit];
  if (!posts) {
    return true;
  }
  if (posts.isFetching) {
    return false;
  }
  return posts.didInvalidate;
}

// 返回函数
export const fetchPostsIfNeeded = reddit => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), reddit)) {
    return dispatch(fetchPosts(reddit));
  }else{
    return Promise.resolve();
  }
}
