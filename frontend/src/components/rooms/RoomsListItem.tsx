import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { useDeleteRoomMutation } from '@/services/room';
import { setCurrentRoom } from '@/slices/roomSlice';
import { useAppDispatch, useAppSelector } from '@/store';

export const RoomsListItem = ({ roomId }: { roomId: string }) => {
  const { id = '' } = useParams();
  const room = useAppSelector((state) => state.rooms.rooms[roomId]);
  const currentRoom = useAppSelector((state) => state.rooms.rooms[id as string]);
  const dispatch = useAppDispatch();

  const [deleteRoom] = useDeleteRoomMutation();

  const onNavigate = () => {
    dispatch(setCurrentRoom(roomId));
  };

  const onDeleteRoom = () => {
    deleteRoom(roomId);
  };

  const classText = currentRoom?.id === roomId ? 'room-list-link active' : 'room-list-link';

  return (
    <li key={roomId} className="room-list-item" onClick={onNavigate}>
      <Link className={classText} to={`/rooms/${roomId}`}>
        # {room.title}
      </Link>

      <button className="room-list-button" onClick={onDeleteRoom}>
        X
      </button>
    </li>
  );
};
