import React, { useEffect, useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    Select, MenuItem, FormControl, InputLabel, Accordion, AccordionSummary, 
    AccordionDetails, Typography, Avatar 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';

const OrderHistory = () => {
    const [filterStatus, setFilterStatus] = useState('');
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const user = useSelector(state => state.auth.user);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        if (user && user._id) {
            fetch(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/orders/history/${user._id}`)
            .then(res => res.json())
            .then(data => {
                setOrders(data);
            });
        }
    }, [user]);

    useEffect(() => {
        setFilteredOrders(orders.filter(order =>
            filterStatus === '' || order.order_status === filterStatus
        ).sort((a, b) => new Date(b.order_date) - new Date(a.order_date)));
    }, [filterStatus, orders]);

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
        <FormControl variant="outlined" style={{ marginBottom: '20px' }}>
        <InputLabel id="order-status-label">Order Status</InputLabel>
        <Select
          labelId="order-status-label"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          label="Order Status"
          style={{ width: '200px' }}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {['Placed', 'In Progress', 'Completed', 'Canceled'].map(status => (
            <MenuItem key={status} value={status}>{status}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {filteredOrders.map((order) => (
        <Accordion key={order._id} expanded={expandedOrderId === order._id} onChange={() => setExpandedOrderId(expandedOrderId !== order._id ? order._id : null)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Table style={{ tableLayout: 'fixed', width: '100%' }}>
            <TableBody>
                <TableRow>
                <TableCell style={{ width: '150px' }}>{new Date(order.order_date).toLocaleString()}</TableCell>
                <TableCell style={{ width: '120px' }}>{order.order_status}</TableCell>
                <Tooltip title={order.delivery_address}>
                    <TableCell style={{ 
                    width: '300px', 
                    textOverflow: 'ellipsis', 
                    overflow: 'hidden', 
                    whiteSpace: 'nowrap' 
                    }}>
                    {order.delivery_address}
                    </TableCell>
                </Tooltip>
                <TableCell style={{ width: '100px' }}>${order.total_price.toFixed(2)}</TableCell>
                </TableRow>
            </TableBody>
            </Table>
          </AccordionSummary>
          <AccordionDetails>
            <Typography component="div">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.order_items.map(item => (
                    <TableRow key={item._id}>
                      <TableCell><Avatar src={item.image_url} alt={item.name} /></TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
    );
}

export default OrderHistory;
