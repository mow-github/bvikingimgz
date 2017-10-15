import * as actionType from './actionTypes';
import firebase from '../firebase';





export function userChanged(){
  return function(dispatch){

    // 1. GET user from firebase AUTH DB
    // 2. make a "GET req from the "normal" DB.. fetch user"
    // 3. dispatch and set redux user: user

    return firebase.auth().onAuthStateChanged((user) => {
      if(user){

        firebase.database().ref(`users/${user.uid}`).once("value").then((user) => {
          dispatch({ type: actionType.SIGN_IN, user: user.val() });
          return user.val().images;
        }).then((imagesIndexObj) => {

/*          if(imagesIndexObj){

            const imagesIndexArr = Object.keys(imagesIndexObj);
            let imagesArray = [];
            imagesIndexArr.forEach((imgid) => {
              firebase.database().ref(`images/${imgid}`).once("value").then((userImg) => {

                const image = {...userImg.val(), imgid: userImg.key};
                imagesArray.push(image);

                dispatch({
                  type: actionType.POST_USER_IMAGE,
                  image
                });

              })
            });

/!*            dispatch({
              type: actionType.POST_USER_IMAGE,
              image: imagesArray
            });*!/


          }*/


        })
      }else{
        dispatch({ type: actionType.SIGN_OUT, user: "" });
      }
    })
  }
}

export function redirectAcessDenied(redirectMsg) {
  return function(dispatch) {
    dispatch({
      type: 'REDIRECT_ACCESS_DENIED',
      redirectMsg
    });
  }
}


export function removeAllUsers() {
  return function(dispatch){

    firebase.database().ref(`users`).remove().then(() => {
      console.log("removeAllUsers from FB");
    }).catch((error) => {
      dispatch({type: "FETCH_ERROR", error})
    });
  };
}

export function removeLoggedinUserFB() {
  return function(dispatch){

    try{

      const uid = firebase.auth().currentUser.uid;

      firebase.auth().currentUser.delete().then(() => {
        firebase.database().ref(`users/${uid}`).remove();
      }).then(() => {
        console.log("remove Loggedin User FB + user FB row");
      }).catch((error) => {
        dispatch({type: "FETCH_ERROR", error})
      });

    }catch(error){ dispatch({type: "FETCH_ERROR", error}) }

  };

}


export function updateError() {
  return function(dispatch){
    dispatch({type: "UPDATE_ERROR", error: ""})
  };
}


export function postImages(imageObj) {

  // POST 1x image to "images" collection
  //  1. add inserted img- key/id to the org. image obj ( so we can update the users/... )
  // update users/uid/images/imgid with: imgid: true (a images index )

  return function(dispatch){

    try{

      const uid = firebase.auth().currentUser.uid;
      const imageObjUpd = {...imageObj, uid};
      firebase.database().ref("images").push(imageObjUpd).then((image) => {

        // replace this dispatch with a listener ? images changes in FB ?
/*        dispatch({
          type: actionType.POST_IMAGE,
          image: imageObjUpd
        });*/
        return image.key;
      }).then((imgid) => {
        firebase.database().ref(`users/${uid}/images/${imgid}`).set({[imgid]: true})
      }).catch(error =>dispatch({type: "FETCH_ERROR", error}))


    }catch(error){ dispatch({type: "FETCH_ERROR", error}) }

  };

}



export function removeAllImages(){

  // TODO add/update this fn so it remove images from user index as well etc | 1. fetch every image-key for this user and ...

  return function(dispatch){
    firebase.database().ref(`images`).remove().then(() => {
      console.log("removeAllImages from FB");
    }).catch((error) => {
      dispatch({type: "FETCH_ERROR", error})
    });
  };
}
export function deleteImageListener(){
  return function(dispatch){
    firebase.database().ref("images")
      .on("child_removed", (ss) => {

        const imgObj = {uid: ss.val().uid, imgid: ss.key};
        dispatch({
          type: actionType.REMOVE_IMAGE,
          imgid: imgObj.imgid
        });

        firebase.database().ref(`users/${imgObj.uid}/images/${imgObj.imgid}`).remove().then(() => {
          // TODO move this to another fn ?.
          console.log("rm user images index");
        }).catch((error) => {
          dispatch({type: "FETCH_ERROR", error})
        });

        const currentUser = firebase.auth().currentUser;
        if( currentUser ){
          dispatch({
            type: actionType.REMOVE_USER_IMAGE_INDEX,
            imgid: imgObj.imgid
          });
        }

      })
  }
}
export function postImagesListener(){
  console.log( "postImagesListener" );

  return function(dispatch){
    firebase.database().ref("images")
      .on("child_added", (ss) => {
        const image = {...ss.val(), imgid: ss.key};
        dispatch({
          type: actionType.POST_IMAGE,
          image: image
        });

        const currentUser = firebase.auth().currentUser;
        if( currentUser ){
          dispatch({
            type: actionType.POST_USER_IMAGE_INDEX,
            imgid: image.imgid
          });
        }

      })
  }
}
export function postUserListener(){
  console.log( "postUserListener" );

  return function(dispatch){
    firebase.database().ref("users")
      .on("child_added", (ss) => {

        const imgKeysObj      = ss.child("images").val();
        const commentKeysObj  = ss.child("comments").val();

        if( imgKeysObj ) {
          dispatch({
            type: actionType.COUNT_IMAGE,
            imgCount: Object.keys(imgKeysObj).length
          });
        }

        if( commentKeysObj ){
          dispatch({
            type: actionType.COUNT_COMMENT,
            commentCount: Object.keys( commentKeysObj ).length
          });
        }

        dispatch({
          type: actionType.COUNT_USER,
          userCount: 1
        });


      })
  }
}


/*export function getAllImages() {
  return function(dispatch){

    firebase.database().ref(`images`).once("value").then((images) => {
      console.log("getAllImages from FB");

      let tmpArray = [];
      images.forEach((child) => {
        tmpArray.push( {...child.val(), imgid: child.key} );
      });

      dispatch({
        type: actionType.GET_ALL_IMAGES,
        images: tmpArray
      });

    }).catch((error) => {
      dispatch({type: "FETCH_ERROR", error})
    });
  };
}*/


/*
*   child_added      // POST
*   child_changed    // UPDATE
*   child_removed    // DELETE
*
*   ss.numChildren()  // count x children in a collection
*
*   firebase.User     // a fn with user data ? add .val() ?
*
*   firebase.database.enableLogging(true/false);
*
* */