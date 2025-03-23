import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import RoomListItem from './room_list_item_container';

import addChannel from '@/assets/add-channel-icon.png';
import { openModal } from '@/slices/modalSlice';
import { setCurrentRoom } from '@/slices/roomSlice';
import { RootState } from '@/store';

export const RoomsList = () => {
  const dispatch = useDispatch();
  const allRoomIds = useSelector((state: RootState) => state.rooms.allRoomIds);
  const rooms = useSelector((state: RootState) => state.rooms.rooms);

  const handleClick = (id: string) => {
    dispatch(setCurrentRoom(id));
  };

  const handleOpenModal = (modalName: string) => {
    dispatch(openModal(modalName));
  };

  const { privateRooms, regularRooms } = useMemo(() => {
    const rRooms: string[] = [];
    const pRooms: string[] = [];
    allRoomIds.forEach((roomId: string) => {
      if (rooms[roomId].isPrivate) {
        pRooms.push(roomId);
      } else {
        rRooms.push(roomId);
      }
    });
    return { privateRooms: pRooms, regularRooms: rRooms };
  }, [allRoomIds, rooms]);

  if (!allRoomIds.length) return null;

  return (
    <div className="rooms">
      <div className="list-header">
        <h2 className="channels">Channels</h2>
        <button className="room-form-button" onClick={() => handleOpenModal('newRoom')}>
          <img src={addChannel} alt="add-channel-icon" />
        </button>
      </div>
      <ul className="roomsList">
        {regularRooms.map((roomId) => (
          <RoomListItem key={roomId} room={rooms[roomId]} handleClick={handleClick} />
        ))}
      </ul>
      <h2 className="channels">Direct Messages</h2>
      <button className="room-form-button" onClick={() => handleOpenModal('newDMForm')}>
        <img src={addChannel} alt="add-channel-icon" />
      </button>
      <ul className="roomsList">
        {privateRooms.map((roomId) => (
          <RoomListItem key={roomId} room={rooms[roomId]} handleClick={handleClick} />
        ))}
      </ul>
    </div>
  );
};
