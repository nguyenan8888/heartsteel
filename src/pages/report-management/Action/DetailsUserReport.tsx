import React from 'react'
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Avatar, Button, ButtonGroup, Card, CardContent, Divider, Grid, TextField } from '@mui/material'


interface RowProps {
    row: any;
}
interface DataUser {
    selectedRow: any;
}

const Row: React.FC<RowProps> = ({ row }) => {
    const [open, setOpen] = React.useState(true);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Avatar src={row.user.avatar} alt="Caroline Black" sx={{ height: 36, width: 36 }} />
                </TableCell>
                <TableCell align="right">{row.user.username}</TableCell>
                <TableCell align="right">{row.user.firstName}</TableCell>
                <TableCell align="right">{row.user.lastName}</TableCell>
                <TableCell align="right">{row.user._id}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit style={{marginLeft:'70px'}}>
                        <Box sx={{ margin: 1 }}>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Report Content
                                </Typography>
                                <Box sx={{ border: '1px solid red', padding: '4px', borderRadius: '4px', width: '100%', fontSize: '15px', fontWeight: '600' }}>
                                    {row.reportContent}
                                </Box>
                            </Box>
                            <Typography variant="h6" gutterBottom component="div">
                                Reason
                            </Typography>
                            <Box>
                                {
                                    row.reason.map((reason: any) => (
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            component="div"
                                            sx={{
                                                padding: '8px 20px',
                                                background: '#A9A9A980',
                                                borderRadius: '999px',
                                                display: 'inline-block',
                                            }}
                                        >
                                            {reason}
                                        </Typography>
                                    ))
                                }
                            </Box>
                        </Box>

                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};


const DetailsUserReport: React.FC<DataUser> = ({ selectedRow }) => {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Avatar</TableCell>
                        <TableCell align="right">User Name</TableCell>
                        <TableCell align="right">First Name</TableCell>
                        <TableCell align="right">Last Name</TableCell>
                        <TableCell align="right">User ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {selectedRow.reports.map((row: any, index: number) => (
                        <Row key={index} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};


export default DetailsUserReport
