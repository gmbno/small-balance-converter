import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface NetworkSelectProps {
  value: number | undefined;
  onChange: (event: SelectChangeEvent<number>) => Promise<void>;
}

export function NetworkSelect({ value, onChange }: NetworkSelectProps) {
  return (
    <Select
      value={value}
      onChange={onChange}
      autoWidth
      MenuProps={{ MenuListProps: { disablePadding: true } }}
      style={{ marginRight: '10px', height: 50 }}>
      <MenuItem value={1}>
        <ListItem>
          <ListItemAvatar>
            <Avatar
              sx={{ width: 24, height: 24 }}
              src={
                'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/2048px-Ethereum-icon-purple.svg.png'
              }
            />
          </ListItemAvatar>
          <ListItemText primary={'ETH'} />
        </ListItem>
      </MenuItem>
      <MenuItem value={56}>
        <ListItem>
          <ListItemAvatar>
            <Avatar
              sx={{ width: 24, height: 24 }}
              src={
                'https://bitbill.oss-accelerate.aliyuncs.com/pics/coins/bsc.svg'
              }
            />
          </ListItemAvatar>
          <ListItemText primary={'BSC'} />
        </ListItem>
      </MenuItem>
    </Select>
  );
}
