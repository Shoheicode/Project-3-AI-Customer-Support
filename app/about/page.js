import { AppBar, Box, Button, IconButton, Toolbar } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

export default function Home() {
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
        >
          <MenuIcon>
          </MenuIcon>
        </IconButton>
        <Button
            href="/"
            color="inherit"
        >
          Home
        </Button>
        <Box
          sx = {{
            flexGrow: 1
          }}
        >

        </Box>
        <Button
          color="inherit"
          href="/about">
          Login
        </Button>
      </Toolbar>
    </AppBar>
    </Box>
}