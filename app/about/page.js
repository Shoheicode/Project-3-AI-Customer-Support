'use client'

import { AppBar, Box, Button, IconButton, Toolbar, Stack, List,ListItem, ListItemButton, ListItemIcon, Drawer } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';


export default function Home() {
  
  const [openDrawer, setOpenDrawer] = useState(false);
  
  const openingDrawer = () =>setOpenDrawer(true);
  const closingDrawer = () =>setOpenDrawer(false);

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={closingDrawer}>
      <Stack
        gap={3}
      >
        <List>
          {['Home', 'About'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                href = {text === "Home" ? "/" : "/" + text.toLowerCase()}
              >
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Button 
          fullWidth={true} 
          variant="contained"
          href='/login'
        >
          Login
        </Button>
      </Stack>
    </Box>
  )

  return <Box
    width="100vw"
    height="auto"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    //sx={backgroundStyle}
  >
    
    <AppBar 
        position="static"
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ 
              mr: 2 
            }}
            onClick={openingDrawer}
          >
            <MenuIcon>
            </MenuIcon>
          </IconButton>
          <Box
            sx = {{
              flexGrow: 1
            }}
          >

          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer open = {openDrawer} onClose={closingDrawer}>
          {DrawerList}
      </Drawer>
    </Box>
}