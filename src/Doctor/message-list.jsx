import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUserEdit, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { supabase } from '../supabase';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState(null);
  const [reply, setReply] = useState('');
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorIdAndMessages = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        console.error('Error fetching session:', sessionError);
        setError('Unable to fetch session. Please ensure you are logged in.');
        return;
      }

      setSession(sessionData.session);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'doctor')
        .single();

      if (userError) {
        console.error('Error fetching doctor ID:', userError);
        setError('Unable to fetch doctor information.');
        return;
      }

      setDoctorId(userData.id);

      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select('id, message, created_at, sender_id, receiver_id, users!messages_sender_id_fkey(email)')
        .or(`sender_id.eq.${sessionData.session.user.id},receiver_id.eq.${sessionData.session.user.id}`)
        .order('created_at', { ascending: false });

      if (messageError) {
        console.error('Error fetching messages:', messageError);
        setError('Unable to fetch messages.');
        return;
      }

      const groupedMessages = Object.values(
        messageData.reduce((acc, message) => {
          const otherPartyId = message.sender_id === sessionData.session.user.id ? message.receiver_id : message.sender_id;

          if (!acc[otherPartyId] || new Date(message.created_at) > new Date(acc[otherPartyId].created_at)) {
            acc[otherPartyId] = message;
          }
          return acc;
        }, {})
      );

      const formattedMessages = groupedMessages.map((msg) => ({
        ...msg,
        otherPartyEmail: msg.sender_id === userData.id ? msg.receiver_id : msg.sender_id,
        message: msg.sender_id === userData.id ? `doctor: ${msg.message}` : msg.message,
      }));

      setMessages(formattedMessages);
    };

    fetchDoctorIdAndMessages();
  }, [doctorId]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      setError('Unable to log out.');
    } else {
      navigate('/login');
    }
  };

  const handleOpenMessages = async (otherPartyId) => {
    if (!session || !session.user || !otherPartyId) {
      console.error('Session or other party ID is missing');
      setError('Invalid session or other party ID.');
      return;
    }

    setReceiverId(otherPartyId);

    const { data: conversationMessages, error } = await supabase
      .from('messages')
      .select('message, created_at, sender_id, receiver_id')
      .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
      .or(`sender_id.eq.${otherPartyId},receiver_id.eq.${otherPartyId}`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching conversation messages:', error);
      setError('Unable to fetch messages.');
      return;
    }

    setSelectedMessages(conversationMessages.map(msg => ({
      ...msg,
      isDoctor: msg.sender_id === doctorId
    })));
  };

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    if (!session || !session.user || !receiverId) {
      console.error('Session, user data, or receiver ID is missing');
      setError('Invalid session, user data, or receiver ID.');
      return;
    }

    const { error } = await supabase
      .from('messages')
      .insert([{ message: reply, sender_id: session.user.id, receiver_id: receiverId }]);

    if (error) {
      console.error('Error sending message:', error);
      setError('Unable to send message.');
      return;
    }

    setReply('');
    handleOpenMessages(receiverId);
  };

  const handleCloseOverlay = () => {
    setSelectedMessages(null);
    setReply('');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="bg-blue-600 text-white p-4 text-center font-bold text-lg">
        Doctor Dashboard
      </div>

      <div className="flex-1 p-4 space-y-4">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className="block bg-white p-4 rounded-lg shadow hover:bg-gray-50 cursor-pointer"
              onClick={() => handleOpenMessages(message.sender_id === doctorId ? message.receiver_id : message.sender_id)}
            >
              <h2 className="text-lg font-bold">{message.otherPartyEmail}</h2>
              <p className="text-gray-600">{message.message}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No messages found.</p>
        )}
      </div>

      {selectedMessages && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Conversation</h2>
            <button onClick={handleCloseOverlay} className="text-gray-600 hover:text-red-600">
              <FaTimes size={20} />
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`p-2 rounded-lg ${
                  msg.isDoctor ? 'bg-blue-100' : 'bg-gray-100'
                }`}
              >
                <p className="text-gray-700">{msg.message}</p>
                <p className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply..."
              className="w-full p-2 border border-gray-300 rounded-lg"
            ></textarea>
            <button
              onClick={handleSendReply}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}

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

export default MessageList;