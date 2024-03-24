/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { ChangeEvent, FormEvent, Fragment, useState, SyntheticEvent } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { styled, Breakpoint } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Radio from '@mui/material/Radio'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Custom Component Import
import { Icon } from '@iconify/react'
import { IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { userApi, postApi } from 'src/@core/apis'
import toast from 'react-hot-toast'

const listItems = [
  <Typography style={{ color: 'red', margin: 0 }} key='Block'>Block</Typography>,
  // <Typography style={{ color: 'red', margin: 0 }} key='Restrict'>Restrict</Typography>,
  <Typography style={{ color: 'red', margin: 0 }} key='Report'>Report</Typography>,
  // <Typography style={{ margin: 0 }} key='Share to...'>Share to...</Typography>,
  // <Typography style={{ margin: 0 }} key='About this account'>About this account</Typography>,
  <Typography style={{ margin: 0 }} key='Cancel'>Cancel</Typography>
];

const listShares = [
  // {
  //   key: 'facebook',
  //   value: <div style={{ display: 'flex', alignItems: 'center' }}>
  //     <Icon icon='la:facebook' fontSize={30} style={{ marginRight: '15px' }} />
  //     <Typography>Share to Facebook</Typography>
  //   </div>
  // },
  // {
  //   key: 'messeger',
  //   value: <div style={{ display: 'flex', alignItems: 'center' }}>
  //     <Icon icon='ph:messenger-logo' fontSize={30} style={{ marginRight: '15px' }} />
  //     <Typography>Share to Messeger</Typography>
  //   </div>
  // },
  // {
  //   key: 'twitter',
  //   value: <div style={{ display: 'flex', alignItems: 'center' }}>
  //     <Icon icon='basil:twitter-outline' fontSize={30} style={{ marginRight: '15px' }} />
  //     <Typography>Share to Twitter</Typography>
  //   </div>
  // },
  // {
  //   key: 'email',
  //   value: <div style={{ display: 'flex', alignItems: 'center' }}>
  //     <Icon icon='carbon:email' fontSize={30} style={{ marginRight: '15px' }} />
  //     <Typography>Share via Email</Typography>
  //   </div>
  // },
  {
    key: 'qr',
    value: <div style={{ display: 'flex', alignItems: 'center' }}>
      <Icon icon='streamline:qr-code' fontSize={30} style={{ marginRight: '15px' }} />
      <Typography>QR code</Typography>
    </div>
  },
  {
    key: 'link',
    value: <div style={{ display: 'flex', alignItems: 'center' }}>
      <Icon icon='tabler:link' fontSize={30} style={{ marginRight: '15px' }} />
      <Typography>Copy link</Typography>
    </div>
  },
  
  // {
  //   key: 'all',
  //   value: <div style={{ display: 'flex', alignItems: 'center' }}>
  //     <Icon icon='carbon:direction-bear-right-01' fontSize={30} style={{ marginRight: '15px' }} />
  //     <Typography>See all</Typography>
  //   </div>
  // },
  {
    key: 'cancel',
    value: <div style={{ display: 'flex', alignItems: 'center' }}>
      <Icon icon='material-symbols-light:close' fontSize={30} style={{ marginRight: '15px' }} />
      <Typography>Cancel</Typography>
    </div>
  },
];

interface DialogActionUser {
  userData: any,
}

const DialogActionUser = (props: DialogActionUser) => {
  const { userData } = props
  const router = useRouter();

  // ** States
  const [open, setOpen] = useState<boolean>(false)
  const [openBlock, setOpenBlock] = useState<boolean>(false)
  const [openRestrict, setOpenRestrict] = useState<boolean>(false)
  const [openReport, setOpenReport] = useState<boolean>(false)
  const [openReportNoti, setOpenReportNoti] = useState<boolean>(false)
  const [openShare, setOpenShare] = useState<boolean>(false)
  const [fullWidth, setFullWidth] = useState<boolean>(true)
  const [maxWidth, setMaxWidth] = useState<Breakpoint>('xs')
  const [expanded, setExpanded] = useState<string | false>(false)
  const [valueReport, setValueReport] = useState<string>('')

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const handleClickOpenBlock = () => setOpenBlock(true)

  const handleCloseBlock = () => setOpenBlock(false)

  const handleClickOpenRestrict = () => setOpenRestrict(true)

  const handleCloseRestrict = () => setOpenRestrict(false)

  const handleClickOpenReport = () => setOpenReport(true)

  const handleCloseReport = () => setOpenReport(false)

  const handleClickOpenReportNoti = () => setOpenReportNoti(true)

  const handleCloseReportNoti = () => setOpenReportNoti(false)

  const handleClickOpenShare = () => setOpenShare(true)

  const handleCloseShare = () => setOpenShare(false)

  const handleListItemClick = (value: any) => {
    if (value === 'Cancel') handleClose();
    if (value === 'Block') {
      handleClose();
      handleClickOpenBlock();
    };
    if (value === 'Restrict') {
      handleClose();
      handleClickOpenRestrict();
    };
    if (value === 'Share to...') {
      handleClose();
      handleClickOpenShare();
    };
    if (value === 'Report') {
      handleClose();
      handleClickOpenReport();
    };
  };

  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
    setValueReport(null)
  }

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValueReport((event.target as HTMLInputElement).value)
  }

  const handleSubmitReport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    handleCloseReport();
    handleClickOpenReportNoti();
  }

  const handleBlock = (id: string) => {
    userApi.blockUser(id)
      .then(({ data }) => {
        if (data.isSuccess) {
          handleClose();
          handleCloseBlock();
          router.push(`/home`)
          setTimeout(() => {
            toast.success(`Block ${userData.username} successfully`)
          }, 1000);
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
  }

  const onReportUserFormSubmit = (id: string, reportContent: string, type: string, reason: any) => {
    postApi
      .post_Report(id, {reportContent: reportContent, type: type, reason: reason})
      .then(({ data }) => {
        toast.success(data.message)
      })
      .catch(err => {
        toast.error(err?.response.data.message[0].msg)
      })
      .finally(() => {
        handleCloseReport()
      })
  }

  return (
    <Fragment>
      <Button variant='text' onClick={handleClickOpen} style={{ borderRadius: "100%" }}>
        <Icon icon='ph:dots-three-bold' fontSize={20} />
      </Button>
      <Dialog
        open={open}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        onClose={handleClose}
        aria-labelledby='max-width-dialog-title'
      >
        <DialogContent>
          <List sx={{ pt: 0 }}>
            {listItems.map((e) => (
              <ListItem disableGutters key={e.props.children}>
                <ListItemButton onClick={() => handleListItemClick(e.props.children)}>
                  <ListItemText style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} primary={e} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openBlock}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        onClose={handleCloseBlock}
        aria-labelledby='max-width-dialog-title'
      >
        <DialogTitle id='alert-dialog-title'>Block {userData.username}?</DialogTitle>
        <DialogContent>
          They won't be able to find your profile, posts or story on Heartsteel. Heartsteel won't let them know you blocked them.
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button style={{ color: 'red' }} onClick={() => handleBlock(userData._id)}>Block</Button>
          <Button onClick={handleCloseBlock}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRestrict}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        onClose={handleCloseRestrict}
        aria-labelledby='max-width-dialog-title'
      >
        <DialogTitle id='alert-dialog-title'>Are you having a problem with {userData.username}?</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', alignItems: 'center', margin: '10px auto' }}>
            <Icon icon='solar:shield-plus-linear' fontSize={40} style={{ marginRight: '15px' }} />
            <Typography>Limit unwanted interactions without having to block or unfollow someone you know.</Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '10px auto' }}>
            <Icon icon='bytesize:message' fontSize={30} style={{ marginRight: '15px' }} />
            <Typography>You'll control if others can see their new comments on your posts.</Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '10px auto' }}>
            <Icon icon='teenyicons:direction-outline' fontSize={40} style={{ marginRight: '15px' }} />
            <Typography>Their chat will be moved to your Message Requests, so they won't see when you've read it.</Typography>
          </div>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button style={{ color: 'red' }} onClick={handleCloseRestrict}>Restrict Account</Button>
          <Button onClick={handleCloseRestrict}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openReport}
        maxWidth='sm'
        fullWidth={fullWidth}
        onClose={handleCloseReport}
        aria-labelledby='max-width-dialog-title'
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant='h6' component='span'>
            Report
          </Typography>
          <IconButton aria-label="close" onClick={handleCloseReport}>
            <Icon icon='material-symbols:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{ marginTop: '16px' }}>
          <Typography>Why are you reporting this account?</Typography>
          <div>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary
                id='controlled-panel-header-1'
                aria-controls='controlled-panel-content-1'
                expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
              >
                <Typography>It's posting content that shouldn't be on Heartsteel</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <FormControl>
                    <FormLabel component='legend'>What's the problem with the content?</FormLabel>
                    <RadioGroup aria-label='quiz' name='quiz' value={valueReport} onChange={handleRadioChange}>
                      <FormControlLabel value="It's spam" control={<Radio />} label="It's spam" />
                      <FormControlLabel value="I just don't like it" control={<Radio />} label="I just don't like it" />
                      <FormControlLabel value="Suicide, self-injury or eating disorders" control={<Radio />} label="Suicide, self-injury or eating disorders" />
                      <FormControlLabel value="Sale of illegal or regulated goods" control={<Radio />} label="Sale of illegal or regulated goods" />
                      <FormControlLabel value="Nudity or sexual activity" control={<Radio />} label="Nudity or sexual activity" />
                      <FormControlLabel value="Hate speech or symbols" control={<Radio />} label="Hate speech or symbols" />
                      <FormControlLabel value="Violence or dangerous organizations" control={<Radio />} label="Violence or dangerous organizations" />
                      <FormControlLabel value="Bullying or harassment" control={<Radio />} label="Bullying or harassment" />
                      <FormControlLabel value="Intellectual property violation" control={<Radio />} label="Intellectual property violation" />
                      <FormControlLabel value="Scam or fraud" control={<Radio />} label="Scam or fraud" />
                      <FormControlLabel value="False information" control={<Radio />} label="False information" />
                    </RadioGroup>
                    <Button type='submit' disabled={!valueReport} variant='outlined' sx={{ mt: 3 }} onClick={() => onReportUserFormSubmit(userData._id, "It's posting content that shouldn't be on Heartsteel", 'User', valueReport)}>
                      Submit Report
                    </Button>
                  </FormControl>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary
                id='controlled-panel-header-2'
                aria-controls='controlled-panel-content-2'
                expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
              >
                <Typography>It's pretend to be someone else</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <FormControl>
                    <FormLabel component='legend'>Who is this account pretending to be?</FormLabel>
                    <RadioGroup aria-label='quiz' name='quiz' value={valueReport} onChange={handleRadioChange}>
                      <FormControlLabel value="Me" control={<Radio />} label="Me" />
                      <FormControlLabel value="Someone I follow" control={<Radio />} label="Someone I follow" />
                      <FormControlLabel value="A celebrity or public figure" control={<Radio />} label="A celebrity or public figure" />
                      <FormControlLabel value="A business or organization" control={<Radio />} label="A business or organization" />
                    </RadioGroup>
                    <Button type='submit' disabled={!valueReport} variant='outlined' sx={{ mt: 3 }} onClick={() => onReportUserFormSubmit(userData._id, "It's pretend to be someone else", 'User', valueReport)}>
                      Submit Report
                    </Button>
                  </FormControl>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
              <AccordionSummary
                id='controlled-panel-header-3'
                aria-controls='controlled-panel-content-3'
                expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
              >
                <Typography>It may be under the age of 13</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: 'text.secondary', fontWeight: 'bold', marginTop: '20px' }}>
                  About reporting a child under the age of 13
                </Typography>
                <Typography sx={{ color: 'text.secondary', marginTop: '20px' }}>
                  Heartsteel requires everyone to be at least 13 years old before they can create an account. In some jurisdictions, this age limit may be higher. If you'd like to report an account belonging to someone under 13 or if you believe someone is impersonating your child who's under 13, visit our Help Center.
                </Typography>
                <Button variant='contained' style={{ width: '100%', marginTop: '20px' }}>Learn More</Button>
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
              <AccordionSummary
                id='controlled-panel-header-4'
                aria-controls='controlled-panel-content-4'
                expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}
              >
                <Typography>It may be been hack</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <FormControl>
                    <FormLabel component='legend'>What's unusual about this account?</FormLabel>
                    <RadioGroup aria-label='quiz' name='quiz' value={valueReport} onChange={handleRadioChange}>
                      <FormControlLabel value="Posts or Stories" control={<Radio />} label="Posts or Stories" />
                      <FormControlLabel value="Comments" control={<Radio />} label="Comments" />
                      <FormControlLabel value="Direct messages" control={<Radio />} label="Direct messages" />
                      <FormControlLabel value="Following list" control={<Radio />} label="Following list" />
                      <FormControlLabel value="Profile was changed" control={<Radio />} label="Profile was changed" />
                      <FormControlLabel value="Something else" control={<Radio />} label="Something else" />
                    </RadioGroup>
                    <Button disabled={!valueReport} type='submit' variant='outlined' sx={{ mt: 3 }} onClick={() => onReportUserFormSubmit(userData._id, "It may be been hack", 'User', valueReport)}>
                      Submit Report
                    </Button>
                  </FormControl>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openReportNoti}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        onClose={handleCloseReportNoti}
        aria-labelledby='max-width-dialog-title'
      >
        <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Icon icon="clarity:success-standard-line" fontSize={50} color="green" />
          <Typography variant="h6" sx={{ mt: 5, mb: 5, color: 'text.secondary', fontWeight: 'bold' }}>
            Thanks for letting us know
          </Typography>
          <Typography sx={{ width: '90%', color: 'text.secondary', textAlign: 'center' }}>
            Your feedback is important in helping us keep the Heartsteel community safe.
          </Typography>
        </DialogTitle>
        <DialogContent className="dialog-actions-dense">
          <Button
            sx={{ color: 'red', width: '100%' }}
            onClick={() => { handleClickOpenBlock(); handleCloseReportNoti(); }}
          >
            Block {userData.username}
          </Button>
          <Button sx={{ width: '100%' }} onClick={handleCloseReportNoti}>
            Unfollow {userData.username}
          </Button>
          <Button sx={{ width: '100%' }} onClick={handleCloseReportNoti}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openShare}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        onClose={handleCloseShare}
        aria-labelledby='max-width-dialog-title'
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant='h6' component='span'>
            Share to...
          </Typography>
          <IconButton aria-label="delete" onClick={handleCloseShare}>
            <Icon icon='material-symbols:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{ marginTop: '16px' }}>
          <List sx={{ pt: 0 }}>
            {listShares.map((e) => (
              <ListItem disableGutters key={e.key}>
                <ListItemButton onClick={() => handleListItemClick(e.key)}>
                  <ListItemText style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} primary={e.value} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default DialogActionUser
