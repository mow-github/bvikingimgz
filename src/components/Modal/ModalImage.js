import React, { Component } from 'react';

class ModalImage extends Component {
  render() {

    const {
      src,
      title,
      thumbs_up_tot,
      thumbs_down_tot,
      comments_tot
    } = this.props.image_modal;

    return (
      <div className="modal fade" id="modalImage">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <img src={src} alt=""/>
            </div>
            <div className="modal-footer">
              <div className="row">
                <span className="fa fa-comment-o col-12" aria-hidden="true">{ comments_tot }</span>
                <span className="fa fa-thumbs-o-up col-12" aria-hidden="true">{ thumbs_up_tot }</span>
                <span className="fa fa-thumbs-o-down col-12" aria-hidden="true">{ thumbs_down_tot }</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalImage;
