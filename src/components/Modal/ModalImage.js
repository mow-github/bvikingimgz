import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import { bindActionCreators } from 'redux';

class ModalImage extends Component {

  state = {
    toggleUpdateInput: false,
    postComment: "hii",
    timestampRaw: null,

    commentsMapped: [],

  };

  postComment = (e) => {
    e.preventDefault();
    console.log("form submitted");

    const text = this.state.postComment;
    const timestampRaw = this.state.timestampRaw;
    const imgid = this.props.image_modal.imgid;

    const commentObj = { timestampRaw, text, imgid };
    console.log( commentObj );

    this.props.actions.postComment(commentObj);
  };

  render() {

    if(!this.props.showModalImage) {

      if(this.props.comments.length > 0){
        console.log("reset comments array.. must click open comments btn again");
        this.props.actions.resetComments();
      }
      return null;
    }


    const {
      src,
      title,
      thumbs_up_tot,
      thumbs_down_tot,
      comments_tot,
      imgid
    } = this.props.image_modal;


    const commentsMapped = this.props.comments
      .sort((x, y) => y.timestampRaw - x.timestampRaw)
      .map((comment, key) => {


       return (
         <p key={key}><span className="commentTimestamp">{new Date(comment.timestampRaw).toLocaleString()}</span>
           <span className="commentAuthor">{comment.email}</span>
           <span className="commentText">{comment.text}</span>

           { this.state.toggleUpdateInput &&
            <input type="text" className="form-control updateCommentInput" placeholder="please, update your comment here" onKeyPress={(e) => {
             if(e.key === "Enter") {
               const text = e.target.value;
               comment.text = text;
               this.props.actions.updateComment(comment, this.props.users.role);
             }
             }} />
           }

           <span className="fa fa-times removeCommentBtn" aria-hidden="true" title="Remove comment" onClick={() => {
             this.props.actions.removeComment(comment, this.props.users.role);
           }} ></span>
           <span className="fa fa-refresh removeCommentBtn" aria-hidden="true" title="Update comment" onClick={() => {
             this.setState({ toggleUpdateInput: !this.state.toggleUpdateInput })
           }}></span>
         </p>
       );
    });

    return (
      <div className="modal" id="modalImage">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={()=> this.props.closeModalImage(false) }>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <img src={src} alt=""/>
            </div>

            <div className="modal-footer">
              <div className="row">
                <span className="fa fa-comment-o fa-lg col-4" aria-hidden="true">{ comments_tot }</span>
                <span className="fa fa-thumbs-o-up fa-lg col-4" aria-hidden="true">{ thumbs_up_tot }</span>
                <span className="fa fa-thumbs-o-down fa-lg col-4" aria-hidden="true">{ thumbs_down_tot }</span>
              </div>
              <div>
                <form className="row my-4 mx-4" onSubmit={this.postComment}>
                  <input type="text" className="form-control col-12" placeholder="please, leave a comment"  name="postComment" value={this.state.postComment}
                         onChange={(e) => this.setState({ postComment: e.target.value, timestampRaw: Date.now() }) }/>
                  <input className="form-control col-12" type="submit" value="Post a comment" />
                </form>
                  <button className="btn btn-primary col-12" onClick={() => this.props.actions.getComments(imgid) }>Show all comments</button>
                  <div className="col-12 my-4 commentParent">
                    {commentsMapped}
                  </div>


              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    comments: state.comments,
    users: state.users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalImage);