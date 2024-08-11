'use client'

import { Box, Button, Stack, TextField, Modal } from '@mui/material'
import { useState } from 'react'
import { firestore } from "@/app/firebase";
import { collection, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';

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

  const style = {
    transform: 'translate(-50%, -50%)',
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

  const [openReview, setOpenReview] = useState(false);

  const openReviewWin = () => setOpenReview(true)
  const closeReviewWin = () => setOpenReview(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Modal
        open = {openReview}
        onClose={closeReviewWin}
      >
        <Box
          sx={style}
          position='absolute' 
          top='50%' 
          left='50%' 
          //transform = 'translate(-50%, -50%)'
          width={400}
          bgcolor= 'white'
          border = "2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Stack 
            width={300}
            gap={3}
          >
          <h1>
            What can we do to improve this site?
          </h1>
          <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              fullWidth ={true}
              value={questName}
              onChange={(e) => setQuestName(e.target.value)}
            >
              
          </TextField>
          <TextField
              id="outlined-basic"
              label="Question"
              variant="outlined"
              fullWidth ={true}
              value={question}
              sx={textAreaStyle}
              onChange={(e) => setQuestion(e.target.value)}
            >
              
            </TextField>
            <Button 
              variant="outlined"
              onClick={ () => {
                  addQuestion(questName, question)
                  setQuestName('')
                  setQuestion('')
                  closeReviewWin()
                }  
              }
            >
              Send
            </Button>
          </Stack>

        </Box>
      </Modal>
      
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            
          />
          <Button 
            variant="contained" 
            onClick={sendMessage}
            disabled = {isLoading}
          >
            {isLoading ? 'Sending' : 'Send'}
          </Button>
        </Stack>
      </Stack>
      <Box height = "30px">

      </Box>
      <Button 
        variant="contained" 
        onClick={openReviewWin}
        position='absolute' 
        //transform = 'translate(-100%, -100%)'  
        sx={styleButton}
      >
        ?
      </Button>
    </Box>
  )
}