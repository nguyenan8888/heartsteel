// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Dialog from '@mui/material/Dialog';
// import PersonIcon from '@mui/icons-material/Person';
// import AddIcon from '@mui/icons-material/Add';
// import Typography from '@mui/material/Typography';
// import { blue } from '@mui/material/colors';
// import MoreVertIcon from '@mui/icons-material/MoreVert';

// const emails = ['Reoprt', 'Unfollow', 'Add to favorites', 'Go to post', 'Sheare', 'Cancel'];

// export interface SimpleDialogProps {
//   open: boolean;
//   selectedValue: string;
//   onClose: (value: string) => void;
// }

// import IconButton, { IconButtonProps } from '@mui/material/IconButton';

// function SimpleDialog(props: SimpleDialogProps) {
//   const { onClose, selectedValue, open } = props;

//   const handleClose = () => {
//     onClose(selectedValue);
//   };

//   const handleListItemClick = (value: string) => {
//     onClose(value);
//   };

//   return (
//     <Dialog onClose={handleClose} open={open}>
      // <List sx={{ pt: 0 }}>
      //   {emails.map((email) => (
      //     <ListItem disableGutters key={email}>
      //       <ListItemButton onClick={() => handleListItemClick(email)}>
      //         <ListItemText primary={email} />
      //       </ListItemButton>
      //     </ListItem>
      //   ))}
      // </List>
//     </Dialog>
//   );
// }

// export default function SimpleDialogDemo() {
//   const [open, setOpen] = React.useState(false);
//   const [selectedValue, setSelectedValue] = React.useState(emails[1]);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = (value: string) => {
//     setOpen(false);
//     setSelectedValue(value);
//   };

//   return (
//     <div>
      // <IconButton aria-label="settings" onClick={handleClickOpen}>
      // <MoreVertIcon/>
      // </IconButton>
//       <SimpleDialog
//         selectedValue={selectedValue}
//         open={open}
//         onClose={handleClose}
//       />
//     </div>
//   );
// }

// ** React Imports
import { Fragment, useState, ChangeEvent } from 'react'

// ** MUI Imports

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Breakpoint } from '@mui/material/styles'
import MoreVertIcon from '@mui/icons-material/MoreVert';

// ** Custom Component Import
import { IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material'


const emails = ['Report', 'Unfollow', 'Add to favorites', 'Go to post', 'Sheare', 'Cancel'];
const DialogSizes = () => {
  // ** States
  const [open, setOpen] = useState<boolean>(false)
  const [fullWidth, setFullWidth] = useState<boolean>(true)
  const [maxWidth, setMaxWidth] = useState<Breakpoint>('sm')

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  // const handleMaxWidthChange = (event: SelectChangeEvent) => {
  //   setMaxWidth(event.target.value as Breakpoint)
  // }

  // const handleFullWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setFullWidth(event.target.checked)
  // }

    const handleListItemClick = (value: string) => {
    if (value) handleClose();
  };
  
  return (
    <Fragment>
      <IconButton aria-label="settings" onClick={handleClickOpen}>
      <MoreVertIcon/>
      </IconButton>
      <Dialog
        open={open}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        onClose={handleClose}
        aria-labelledby='max-width-dialog-title'
      >
      <DialogContent>
      <List sx={{ pt: 0 }}>
        {emails.map((email) => (
          <ListItem disableGutters key={email}>
            <ListItemButton onClick={() => handleListItemClick(email)}>
              <ListItemText style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} primary={email} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default DialogSizes
