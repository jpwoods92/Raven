import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useDeleteRoomMutation } from '@/services/room';
import { setCurrentRoom } from '@/slices/roomSlice';
import { useAppDispatch, useAppSelector } from '@/store';

export const RoomsListItem = ({ roomId }: { roomId: string }) => {
  const currentRoomId = useAppSelector((state) => state.rooms.currentRoomId);
  const room = useAppSelector((state) => state.rooms.rooms[roomId]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [deleteRoom] = useDeleteRoomMutation();

  const onNavigate = () => {
    navigate(`/rooms/${room.id}`);
    dispatch(setCurrentRoom(room.id));
  };

  const onDeleteRoom = () => {
    deleteRoom(roomId);
  };

  const classText = currentRoomId === roomId ? 'room-list-link active' : 'room-list-link';

  return (
    <li key={room.id} className="room-list-item" onClick={onNavigate}>
      <Link className={classText} to={`/rooms/${room.id}`}>
        # {room.name}
      </Link>

      <button className="room-list-button" onClick={onDeleteRoom}>
        X
      </button>
    </li>
  );
};
