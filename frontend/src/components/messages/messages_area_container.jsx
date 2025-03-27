import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { fetchMessages, receiveMessage } from '../../actions/message_actions';
import { fetchRoom } from '../../actions/room_actions';
import { fetchUsers } from '../../actions/user_actions';

import MessagesArea from './messages_area';

const mapStateToProps = (state) => {
  return {
    room: state.ui.room,
    messages: Object.values(state.entities.messages),
    users: state.entities.users,
    currentUser: state.entities.users[state.session.currentUserId],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    receiveMessage: (message) => dispatch(receiveMessage(message)),
    fetchUsers: () => dispatch(fetchUsers()),
    fetchMessages: (roomId) => dispatch(fetchMessages(roomId)),
    fetchRoom: (id) => dispatch(fetchRoom(id)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MessagesArea));
