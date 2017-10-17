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

        })
      }else{
        dispatch({ type: actionType.SIGN_OUT, user: "" });
      }
    })
  }
}




// ------------------------------------- IMAGES -----------------------------------------
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
export function removeImage(image, currentUserRole){
  console.log("---removeImage");
  return function(dispatch){

    if(firebase.auth().currentUser){

      const currentUserUid = firebase.auth().currentUser.uid;

      let flag = false;
      if(currentUserRole === "admin"){
        // full access
        console.log("just a admin -- removeImage");
        flag = true;
      }else if( currentUserRole === "subscriber" && currentUserUid === image.uid ){
        // access to currentUser comments
        console.log("subscriber and owner of the image -- removeImage");
        flag = true;
      }else{
        const msg = "You are not the author or a admin";
        dispatch({type: "FETCH_ERROR", error:{message: msg} })
      }

      if(flag) {
        console.log("FlAG TRUE",image);

        if(image.comments){
          const commentsArray = Object.keys(image.comments);
          commentsArray.forEach((cid) => {
            firebase.database().ref(`comments/${cid}`).remove();
            firebase.database().ref(`users/${image.uid}/comments/${cid}`).remove();
          });
        }

        if(image.votes){
          const votesArray = Object.keys(image.votes);
          votesArray.forEach((vid) => {
            firebase.database().ref(`votes/${vid}`).remove();
            firebase.database().ref(`users/${image.uid}/votes/${vid}`).remove();
          });
        }


        firebase.database().ref(`images/${image.imgid}`).remove().then(() => {
        }).then(() => {
          firebase.database().ref(`users/${image.uid}/images/${image.imgid}`).remove();
        }).then(() => {
          console.log("images/image.imgid");
          console.log("users/image.uid/images/image.imgid removed");
        }).catch(error =>dispatch({type: "FETCH_ERROR", error}))

      }

    }else{
      const msg = "You are not logged in.. unable to exec. your request";
      dispatch({type: "FETCH_ERROR", error:{message: msg} })
    }

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
// ------------------------------------- IMAGES -----------------------------------------

// ------------------------------------- COMMENT -----------------------------------------
export function getComments(imgid) {

  return function(dispatch){

    if(firebase.auth().currentUser){

      firebase.database().ref(`images/${imgid}/comments`).once("value").then((cidIndices) => {

        if(!cidIndices.val()){
          dispatch({
            type: actionType.GET_COMMENT_ALL,
            comment: []
          });
          throw Error("this image has no comments");
        }
        const cidIndicesArray = Object.keys(cidIndices.val());

        const tmpArray = [];
        firebase.database().ref(`comments`).once("value").then((comments) => {
          cidIndicesArray.forEach((cid) => {
            //console.log( cid );
            const commentObj = {...comments.val()[cid], cid};
            tmpArray.push(commentObj);
          });

          dispatch({
            type: actionType.GET_COMMENT_ALL,
            comment: tmpArray
          });

        })


      }).catch(error =>dispatch({type: "FETCH_ERROR", error}))

    }else{
      // message
      const msg = "You are not logged in.. unable to fetch comments";
      console.log(msg);
      // hmm, unable to exec due to rendering component ?
      // dispatch({type: "FETCH_ERROR", error:{message: msg} })
    }

  };

}
export function postComment(commentObj) {

  return function(dispatch){

    try{

      const {uid, email} = firebase.auth().currentUser;
      commentObj.uid = uid;
      commentObj.email = email;

      firebase.database().ref("comments").push(commentObj).then((comment) => {

        const commentObjUpd = {...commentObj, cid: comment.key};
console.log( ",", commentObjUpd );
        dispatch({
          type: actionType.POST_COMMENT,
          comment: commentObjUpd
        });

        dispatch({
          type: actionType.PATCH_IMAGE_POST_COMMENT_INDEX,
          comment: commentObjUpd
        });

        return comment.key;
      }).then((cid) => {
        firebase.database().ref(`users/${uid}/comments/${cid}`).set({[cid]: true});
        firebase.database().ref(`images/${commentObj.imgid}/comments/${cid}`).set({[cid]: true})
      }).catch(error =>dispatch({type: "FETCH_ERROR", error}))

    }catch(error){ dispatch({type: "FETCH_ERROR", error}) }

  };

}
export function removeComment(comment, currentUserRole) {

  /*
  * currentUserRole:  admin / subscriber
  *   - IF subscriber can remove: firebase.auth().currentUser.uid === comment.uid  // author of the comment
  *   - IF admin can remove: if logged in // remove every comment
  *
  *
  * */

  return function(dispatch){


    if(firebase.auth().currentUser){

      const currentUserUid = firebase.auth().currentUser.uid;

      let flag = false;
      if(currentUserRole === "admin"){
        // full access
        console.log("just a admin -- removeComment");
        flag = true;
      }else if( currentUserRole === "subscriber" && currentUserUid === comment.uid ){
        // access to currentUser comments
        console.log("subscriber and owner of the comment -- removeComment");
        flag = true;
      }else{
        const msg = "You are not the author or a admin";
        dispatch({type: "FETCH_ERROR", error:{message: msg} })
      }

      if(flag) {
        console.log("FlAG TRUE");
        console.log(comment);

        firebase.database().ref(`comments/${comment.cid}`).remove().then(() => {
        }).then(() => {
          firebase.database().ref(`images/${comment.imgid}/comments/${comment.cid}`).remove();
        }).then(() => {
          firebase.database().ref(`users/${comment.uid}/comments/${comment.cid}`).remove();
        }).then(() => {
          console.log("comments/cid removed");
          console.log("images/imgid/comments/cd removed");
          console.log("users/uid/comments/cid removed");
        }).catch(error =>dispatch({type: "FETCH_ERROR", error}))

      }

    }


  };

}
export function updateComment(comment, currentUserRole) {

  /*
  * currentUserRole:  admin / subscriber
  *   - IF subscriber can remove: firebase.auth().currentUser.uid === comment.uid  // author of the comment
  *   - IF admin can remove: if logged in // remove every comment
  *
  *
  * */

  return function(dispatch){


    if(firebase.auth().currentUser){

      const currentUserUid = firebase.auth().currentUser.uid;

      let flag = false;
      if(currentUserRole === "admin"){
        // full access
        console.log("just a admin -- updateComment");
        flag = true;
      }else if( currentUserRole === "subscriber" && currentUserUid === comment.uid ){
        // access to currentUser comments
        console.log("subscriber and owner of the comment -- updateComment");
        flag = true;
      }else{
        const msg = "You are not the author or a admin";
        dispatch({type: "FETCH_ERROR", error:{message: msg} })
      }

      if(flag) {
        console.log("FlAG TRUE");

        console.log(comment);
        // we add a extra key/value: cid ( must exist.. so the path works, not neceassry in the patch )
        firebase.database().ref(`comments/${comment.cid}`).set(comment).then(() => {

        }).catch(error =>dispatch({type: "FETCH_ERROR", error}))

      }

    }


  };

}
// ------------------------------------- COMMENT -----------------------------------------

// ------------------------------------- USER -----------------------------------------
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
// ------------------------------------- USER -----------------------------------------


// ------------------------------------- VOTES -----------------------------------------
/*export function updateImageThumbUp(imageObj) {

  return function(dispatch){


    try{
      const uid = firebase.auth().currentUser.uid;
      console.log(uid);
      console.log("FIX this.. vote and text CONNECTED to a user");

    }catch(error){ dispatch({type: "FETCH_ERROR", error}) }



  };

}*/
export function postVote(voteObj) {

  return function(dispatch){

    try{

      const {uid} = firebase.auth().currentUser;
      voteObj.uid = uid;
      console.log("---", voteObj);

      firebase.database().ref("votes").push(voteObj).then((vote) => {
        const voteObjUpd = {...voteObj, vid: vote.key};
        console.log( ",", voteObjUpd );

        // dispatch({ type: actionType.POST_VOTE, vote: voteObjUpd });
        dispatch({
          type: actionType.PATCH_IMAGE_POST_VOTE_INDEX,
          vote: voteObjUpd
        });

        return vote.key;
      }).then((vid) => {
        firebase.database().ref(`users/${uid}/votes/${vid}`).set({[vid]: true});
        firebase.database().ref(`images/${voteObj.imgid}/votes/${vid}`).set({[vid]: true})
      }).catch(error =>dispatch({type: "FETCH_ERROR", error}))

    }catch(error){ dispatch({type: "FETCH_ERROR", error}) }

  };

}
// ------------------------------------- VOTES -----------------------------------------






// ------------------------------------- LISTENER IMAGES -----------------------------------------
export function postImagesListener(){
  console.log( "postImagesListener" );

  return function(dispatch){
    firebase.database().ref("images")
      .on("child_added", (ss) => {
        const image = {...ss.val(), imgid: ss.key};


        // console.log("child_added", image);

        dispatch({
          type: actionType.POST_IMAGE,
          image: image
        });

        dispatch({
          type: actionType.COUNT_IMAGE,
          imgCount: 1
        });

        const currentUser = firebase.auth().currentUser;
        if( currentUser ){
          dispatch({
            type: actionType.POST_USER_IMAGE_INDEX,
            imgid: image.imgid
          });
        }

        /*      MOVED TO LISTENER - postComments

                if(image.comments){
                  const commentsArray = Object.keys(image.comments);
                  commentsArray.forEach((cid) => {
                    firebase.database().ref(`comments/${cid}`).on("value", (ss) => {
                    console.log("increment comments 1");
                      dispatch({
                        type: actionType.PATCH_IMAGE_COMMENT_UP_1,
                        imgid: image.imgid
                      });
                    });
                  });
                }*/
        /*      MOVED TO LISTENER - postVotes

                if(image.votes){
                  const votesArray = Object.keys(image.votes);
                  votesArray.forEach((vid) => {
                    firebase.database().ref(`votes/${vid}`).on("value", (ss) => {
                      const value = ss.val().value;
                      if(value === 1){
                        console.log( "thumbs_up_tot: +1" );
                        dispatch({
                          type: actionType.PATCH_IMAGE_THUMB_UP_1,
                          imgid: image.imgid
                        });
                      }else if(value === -1){
                        console.log( "thumbs_down_tot: +1" );
                        dispatch({
                          type: actionType.PATCH_IMAGE_THUMB_DOWN_1,
                          imgid: image.imgid
                        });
                      }
                    });
                  });
                }*/

      })
  }
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

          dispatch({
            type: actionType.COUNT_IMAGE,
            imgCount: -1
          });

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
export function updateImagesListener(){
  console.log( "updateImagesListener" );

  return function(dispatch){
    firebase.database().ref("images")
      .on("child_changed", (ss) => {
        const image = {...ss.val(), imgid: ss.key};

        console.log( "child_changed -- updateImagesListener ", image);


      })
  }
}
// ------------------------------------- LISTENER IMAGES -----------------------------------------

// ------------------------------------- LISTENER COMMENTS -----------------------------------------
export function postCommentsListener(){
  console.log( "postCommentsListener" );

  return function(dispatch){
    firebase.database().ref("comments")
      .on("child_added", (ss) => {

        const comment = {...ss.val(), cid: ss.key};


        // console.log("child_added -- comment -- ", comment);

        dispatch({
          type: actionType.PATCH_IMAGE_COMMENT_UP_1,
          imgid: comment.imgid
        });

        dispatch({
          type: actionType.COUNT_COMMENT,
          commentCount: 1
        });



      })
  }
}
export function removeCommentsListener(){
  console.log( "removeCommentsListener" );

  return function(dispatch){
    firebase.database().ref("comments").on("child_removed", (ss) => {
      const cid = ss.key;

        dispatch({
          type: actionType.REMOVE_COMMENT,
          cid
        });

      dispatch({
        type: actionType.COUNT_COMMENT,
        commentCount: -1
      });

      })
  }
}
export function updateCommentsListener(){
  console.log( "updateCommentsListener" );

  return function(dispatch){
    firebase.database().ref("comments").on("child_changed", (ss) => {
      const cid = ss.key;
      console.log("-----", cid, ss.val() );

      dispatch({
        type: actionType.PATCH_COMMENT,
        comment: {...ss.val(), cid}
      });

    })
  }
}
// ------------------------------------- LISTENER COMMENTS -----------------------------------------

// ------------------------------------- LISTENER USER -----------------------------------------
export function postUserListener(){
  console.log( "postUserListener" );

  return function(dispatch){
    firebase.database().ref("users")
      .on("child_added", (ss) => {

        dispatch({
          type: actionType.COUNT_USER,
          userCount: 1
        });


      })
  }
}
export function updateUsersListener(){
  console.log( "updateUsersListener" );

  return function(dispatch){
    firebase.database().ref("users")
      .on("child_changed", (ss) => {

/*          dispatch({
            type: actionType.COUNT_IMAGE,
            imgCount: 1
          });*/


      })
  }
}
// ------------------------------------- LISTENER USER -----------------------------------------

// ------------------------------------- LISTENER VOTES -----------------------------------------
export function postVotesListener(){

  return function(dispatch){
    firebase.database().ref("votes")
      .on("child_added", (ss) => {

        const vote = {...ss.val(), vid: ss.key};

        // console.log("child_added -- vote listener", vote);
        if(vote.value === 1){
          dispatch({
            type: actionType.PATCH_IMAGE_THUMB_UP_1,
            imgid: vote.imgid
          });
        }else if(vote.value === -1){
          dispatch({
            type: actionType.PATCH_IMAGE_THUMB_DOWN_1,
            imgid: vote.imgid
          });
        }


      })
  }
}
export function removeVotesListener(){

  return function(dispatch){
    firebase.database().ref("votes")
      .on("child_removed", (ss) => {

        const vote = {...ss.val(), vid: ss.key};
        console.log( vote );
        console.log("------------------------VOTES REMOVED - not active in app.js yet");


      })
  }
}
// ------------------------------------- LISTENER VOTES -----------------------------------------

export function redirectAcessDenied(redirectMsg) {
  return function(dispatch) {
    dispatch({
      type: 'REDIRECT_ACCESS_DENIED',
      redirectMsg
    });
  }
}
export function updateError() {
  return function(dispatch){
    dispatch({type: "UPDATE_ERROR", error: ""})
  };
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