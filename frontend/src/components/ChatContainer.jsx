import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from "./ChatHeader"
import MessageSkeleton from "./skeletons/MessageSkeleton"
import MessageInput from './MessageInput'
import { formatMessageTime } from '../lib/utilts'
import { useAuthStore } from '../store/useAuthStore'
import { useRef } from 'react'

function ChatContainer() {

  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore()
  const { authUser } = useAuthStore()
  const MessageEndRef = useRef()

  useEffect(() => {
    getMessages(selectedUser._id)
    subscribeToMessages()
    return () => unsubscribeFromMessages()
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages])


  useEffect(()=> {
    if(MessageEndRef.current && messages){
      MessageEndRef.current.scrollIntoView({behavior :"smooth"})
    }
  },[messages])

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  console.log("messages",messages)



  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages && messages.map((message) => (
          <div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`} ref={MessageEndRef}>
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img src={message.senderId === authUser._id ? authUser.profilePic || "../../public/avatar.png" : selectedUser.profilePic || "../../public/avatar.png"} alt="profile pic" />
              </div>
            </div>
            <div className='hidden lg:black mb-1'>
              <time className='text-xs opacity-50 ml-l'>
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className='chat-bubble flex flex-col'>
              {message.image && (
                <img src={message.image} alt="Attachment" className='sm:max-w-[200px] rounded-md mb-2' />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  )
}

export default ChatContainer