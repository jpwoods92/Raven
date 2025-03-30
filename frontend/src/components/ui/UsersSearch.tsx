import React, { useState, useEffect, useRef, Fragment } from 'react';

import { useLazySearchUsersQuery } from '@/services/user';
import { useAppSelector } from '@/store';
import { User } from '@/types';

interface UsersSearchProps {
  selectedUsers: User[];
  handleUsernameClick: (user: User) => void;
  removeUser: (e: React.MouseEvent) => void;
  isPrivate?: boolean;
}

const UsersSearch: React.FC<UsersSearchProps> = ({
  selectedUsers,
  handleUsernameClick,
  removeUser,
  isPrivate = false,
}) => {
  const [users, setUsers] = useState<User[] | undefined>([]);
  const [input, setInput] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentUser = useAppSelector((state) => state.auth.user);

  const [searchUsers] = useLazySearchUsersQuery();

  useEffect(() => {
    setUsers([]);
    setInput('');
    searchInputRef.current?.focus();
  }, [selectedUsers.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    searchUsers(value).then((response) => {
      setUsers(
        response.data?.filter((user: User) => {
          const notCurrentUser = user.id !== currentUser?.id;
          const notSelected = !selectedUsers.some((selectedUser) => selectedUser.id === user.id);
          return notCurrentUser && notSelected;
        })
      );
    });
    setInput(value);
  };

  const dmClass = isPrivate ? 'dm' : '';
  const limitedList = users?.slice(0, 5);

  const results = (
    <ul className={`search-list ${dmClass}`}>
      {limitedList?.map((user) => (
        <li onClick={() => handleUsernameClick(user)} key={user.id}>
          {user.username}
        </li>
      ))}
    </ul>
  );

  return (
    <Fragment>
      <div className={`users-search-container ${dmClass}`}>
        {selectedUsers.length > 0 && (
          <ul>
            {selectedUsers.map((user, idx) => (
              <li onClick={removeUser} key={idx}>
                {user.username}
              </li>
            ))}
          </ul>
        )}
        <input
          ref={searchInputRef}
          className={`newroom-input search ${dmClass}`}
          type="text"
          onChange={handleChange}
          placeholder="search users..."
          value={input}
        />
      </div>
      {(users?.length || 0) > 0 && input ? results : null}
    </Fragment>
  );
};

export default UsersSearch;
