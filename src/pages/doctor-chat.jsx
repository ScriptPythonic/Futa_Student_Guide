import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Navbar from '../components/navbar';

const ChatWithDoctor = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [doctorId, setDoctorId] = useState(null);
  const [userId, setUserId] = useState(null); // To store the user's ID
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error('Error fetching session:', error);
        setError('Unable to fetch user session.');
        return;
      }

      setUserId(session.user.id);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchDoctorId = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'doctor')
        .single();

      if (error) {
        console.error('Error fetching doctor ID:', error);
        setError('Unable to fetch doctor information.');
        return;
      }

      setDoctorId(data.id);
    };

    fetchDoctorId();
  }, []);

  useEffect(() => {
    if (!doctorId || !userId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, message, created_at')
        .or(`sender_id.eq.${userId},receiver_id.eq.${doctorId}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        setError('Unable to fetch messages.');
      } else {
        setMessages(data);
      }
    };

    fetchMessages();
  }, [doctorId, userId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    if (!doctorId || !userId) return;

    const { error } = await supabase
      .from('messages')
      .insert([{ sender_id: userId, receiver_id: doctorId, message: newMessage }]);

    if (error) {
      console.error('Error sending message:', error);
      setError('Unable to send message.');
    } else {
      setMessages([...messages, { sender_id: userId, receiver_id: doctorId, message: newMessage, created_at: new Date() }]);
      setNewMessage('');
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      <Navbar />
      <div className="bg-white shadow p-4 text-center text-xl font-bold">
        Chat with Dr. Animashaun
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                message.sender_id === userId
                  ? 'bg-green-500 text-white' // User's message
                  : 'bg-blue-500 text-white'  // Doctor's message
              }`}
            >
              {message.message}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 flex items-center">
        <input
          type="text"
          className="flex-1 form-input w-full border border-gray-300 rounded-full p-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-full ml-2 hover:bg-blue-700 transition duration-300"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWithDoctor;
