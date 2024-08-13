'use client'

import { Box, Button, Stack, TextField, Modal, AppBar, Toolbar, IconButton, Typography, Drawer } from '@mui/material'
import { useState } from 'react'
import { firestore } from "@/app/firebase";
import { collection, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [questName, setQuestName] = useState('')
  const [question, setQuestion] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)



  const style = {
    transform: 'translate(-50%, -50%)',
  }

  const backgroundStyle = {
    //background: 'linear-gradient(rgba(250,0,0,0.5),transparent);',
    background: 'rgb(10,0,184);',
    background: 'radial-gradient(circle, rgba(10,0,184,1) 0%, rgba(168,168,255,1) 35%, rgba(0,255,150,1) 100%);'
  }

  const textAreaStyle = {
    height: '100px'
  }

  const styleButton = {
    transform: 'translate(0%, 0%)',
  }

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return; // don't send empty messages or while loading
    setIsLoading(true)
    
    setMessage('')  // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },  // Add the user's message to the chat
      { role: 'assistant', content: '' },  // Add a placeholder for the assistant's response
    ])

    // Send the message to the server
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }

    setIsLoading(false)
  }

  const addQuestion = async (name, question) =>{
    if (name == ''){
      return;
    }

    const docRef = doc(collection(firestore, 'Question'), name)
    const docSnap = await getDoc(docRef)
    
    await setDoc(docRef, {quest: question})
    

  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const [openDrawer, setOpenDrawer] = useState(false);

  const openingDrawer = () =>setOpenDrawer(true);
  const closingDrawer = () =>setOpenDrawer(false);

  const [openReview, setOpenReview] = useState(false);

  const openReviewWin = () => setOpenReview(true)
  const closeReviewWin = () => setOpenReview(false)

  const [link, setLink] = useState("");

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

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={backgroundStyle}
    >
      <AppBar 
        //position="static"
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
      
      <Box
        height={"25%"}
      >

      </Box>
      
      <Box
        bgcolor={"white"}
        width={400}
        height={400}
        display={"flex"}
        justifyContent={"center"}
      >
        <Stack
        padding={10}
          gap={3}
        >
          <TextField
            label={"Email"}
          >

          </TextField>
          <TextField
            label="Password"
          >

          </TextField>
          <Button
            color='inherit'
            variant='contained'
          >
            Submit!!!
          </Button>
        </Stack>
      </Box>

    </Box>
  )
}