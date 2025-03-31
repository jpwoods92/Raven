import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { RoomsListItem } from './RoomsListItem';

import addRoom from '@/assets/add-room-icon.png';
import { useGetRoomsQuery } from '@/services/room';
import { openModal } from '@/slices/modalSlice';
import { useAppSelector } from '@/store';

export const RoomsList = () => {
  const dispatch = useDispatch();
  const allRoomIds = useAppSelector((state) => state.rooms.allRoomIds);
  const rooms = useAppSelector((state) => state.rooms.rooms);

  useGetRoomsQuery();

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

  return (
    <div className="rooms">
      <div className="list-header">
        <h2 className="rooms">Rooms</h2>
        <button className="room-form-button" onClick={() => handleOpenModal('newRoom')}>
          <img src={addRoom} alt="add-room-icon" />
        </button>
      </div>
      <ul className="roomsList">
        {regularRooms.map((roomId) => (
          <RoomsListItem key={roomId} roomId={roomId} />
        ))}
      </ul>
      <ul className="roomsList">
        {privateRooms.map((roomId) => (
          <RoomsListItem key={roomId} roomId={roomId} />
        ))}
      </ul>
    </div>
  );
};
