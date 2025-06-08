import { Autocomplete, CircularProgress, debounce, TextField } from '@mui/material';
import { ChangeEvent, FC, useState } from 'react';

import { useLazySearchUsersQuery } from '@/services/user';
import { User } from '@/types';

export interface UserSearchProps {
  onChange: (user: User | null) => void;
  userIdsToFilterOut?: string[];
}

export const UserSearch: FC<UserSearchProps> = ({ onChange, userIdsToFilterOut = [] }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly User[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchUsers] = useLazySearchUsersQuery();

  const handleOpen = () => {
    setOpen(true);
    (async () => {
      setLoading(true);
      const initialUsers = await searchUsers('').unwrap();
      setLoading(false);

      setOptions([...initialUsers].filter((user) => !userIdsToFilterOut.includes(user.id)));
    })();
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  const handleSearchUsers = debounce(async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (query.length > 0) {
      const users = await searchUsers(query).unwrap();
      setOptions([...users].filter((user) => !userIdsToFilterOut.includes(user.id)));
    } else {
      setOptions([]);
    }
  }, 300);

  return (
    <Autocomplete
      sx={{ width: 300 }}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.username}
      onChange={(_e, value) => onChange(value)}
      filterOptions={(x) => x}
      options={options}
      loading={loading}
      value={null}
      forcePopupIcon={false}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Add Members..."
          onChange={handleSearchUsers}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};
