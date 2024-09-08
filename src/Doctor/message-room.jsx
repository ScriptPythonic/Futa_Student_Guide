import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { FaHome, FaUserEdit, FaSignOutAlt } from 'react-icons/fa';

const MessageRoom = () => {
  const { receiverId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessagesAndReceiver = async () => {
      try {
        if (!receiverId) {
          console.error('Receiver ID is undefined or null');
          setError('Invalid receiver ID.');
          return;
        }

        console.log('Receiver ID:', receiverId); // Debug line

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.error('Error fetching session:', sessionError);
          setError('Unable to fetch session. Please ensure you are logged in.');
          return;
        }

        // Fetch receiver's email
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('id', receiverId)
          .single();

        if (userError) {
          console.error('Error fetching receiver email:', userError);
          setError('Unable to fetch receiver details.');
          return;
        }

        setReceiverEmail(userData.email);

        // Fetch messages between the logged-in user and the receiver
        const { data: messageData, error: messageError } = await supabase
          .from('messages')
          .select(`
            id, 
            message, 
            created_at, 
            sender_id, 
            receiver_id, 
            sender:sender_id (email)
          `)
          .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${session.user.id})`)
          .order('created_at', { ascending: true });

        if (messageError) {
          console.error('Error fetching messages:', messageError);
          setError('Unable to fetch messages.');
          return;
        }

        setMessages(messageData);
      } catch (err) {
        console.error('An unexpected error occurred:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessagesAndReceiver();
  }, [receiverId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error('Error fetching session:', sessionError);
        setError('Unable to fetch session. Please ensure you are logged in.');
        return;
      }

      console.log('Session user ID:', session.user.id); // Debug line
      console.log('Receiver ID:', receiverId); // Debug line

      const { error } = await supabase.from('messages').insert([
        {
          sender_id: session.user.id,
          receiver_id: receiverId,
          message: newMessage.trim(),
        },
      ]);

      if (error) {
        console.error('Error sending message:', error);
        setError('Unable to send message. Please try again.');
      } else {
        setNewMessage('');
        // Fetch the latest messages again
        const { data: messageData, error: fetchError } = await supabase
          .from('messages')
          .select(`
            id, 
            message, 
            created_at, 
            sender_id, 
            receiver_id, 
            sender:sender_id (email)
          `)
          .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${session.user.id})`)
          .order('created_at', { ascending: true });

        if (fetchError) {
          console.error('Error fetching messages:', fetchError);
          setError('Unable to fetch messages.');
        } else {
          setMessages(messageData);
        }
      }
    } catch (err) {
      console.error('An unexpected error occurred:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      setError('Unable to log out.');
    } else {
      navigate('/login');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-blue-600 text-white p-4 text-center font-bold text-lg">
        Chat with {receiverEmail || 'Loading...'}
      </div>

      {/* Messages display */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender_id === receiverId ? 'justify-start' : 'justify-end'}`}>
              <div className={`bg-${message.sender_id === receiverId ? 'gray-200' : 'blue-600'} text-${message.sender_id === receiverId ? 'gray-800' : 'white'} p-3 rounded-lg max-w-xs`}>
                <p>{message.message}</p>
                <span className="text-xs text-gray-500 block mt-2">{new Date(message.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No messages yet.</p>
        )}
      </div>

      {/* Message input */}
      <div className="bg-white p-4 flex items-center">
        <input
          type="text"
          className="flex-1 form-input w-full border border-gray-300 rounded-full p-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-full ml-2 hover:bg-blue-700 transition duration-300"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>

      {/* Bottom bar */}
      <div className="bg-white p-4 flex justify-around shadow-inner">
        <Link to="/message-list" className="text-gray-600 hover:text-blue-600">
          <FaHome size={24} />
        </Link>
        <Link to="/update-medical-details" className="text-gray-600 hover:text-blue-600">
          <FaUserEdit size={24} />
        </Link>
        <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600">
          <FaSignOutAlt size={24} />
        </button>
      </div>
    </div>
  );
};

export default MessageRoom;
