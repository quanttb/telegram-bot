import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = (props) => {
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatIDs, setTelegramChatIDs] = useState([]);
  const [message, setMessage] = useState('');

  const handleTelegramBotTokenChange = (e) => {
    setTelegramBotToken(e.target.value);
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  }

  const fetchChatIDs = async () => {
    if (telegramBotToken) {
      setTelegramChatIDs([]);
      await axios
        .get(
          `https://api.telegram.org/bot${telegramBotToken}/getUpdates`
        )
        .then(function (response) {
          const data = response.data;
          if (data.result.length === 0) {
            alert('No Chat ID found!');
            return;
          }
          const IDs = [];
          for (let id of data.result) {
            if (id.my_chat_member) {
              IDs.push({
                id: id.my_chat_member.chat.id,
                title: id.my_chat_member.chat.title
              });
            }
          }
          setTelegramChatIDs(IDs);
        })
        .catch(function (error) {
          alert('Error!')
        });
    } else {
      alert('Telegram Bot Token not found!');
    }
  };

  const sendMessage = async () => {
    if (message && telegramBotToken && telegramChatIDs && telegramChatIDs.length > 0) {
      for (let chat of telegramChatIDs) {
        await axios
          .get(
            `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
            {
              params: {
                chat_id: chat.id,
                text: message,
              },
            },
          )
          .then(function (response) {
          })
          .catch(function (error) {
          });
      }
      alert('Done!');
    } else {
      alert('Cannot send!');
    }
  };

  return (
    <div>
      <h2>TokenPlay Telegram Bot</h2>
      <div>
        <label>Telegram Bot Token: </label>
        <input
          value={telegramBotToken}
          onChange={handleTelegramBotTokenChange}
        />
        <button
          onClick={fetchChatIDs}
        >
          Fetch Chat IDs
        </button>
      </div>
      <br/>
      <textarea
        readOnly
        rows="5"
        cols="40"
        value={telegramChatIDs.map(id => id.title).join('\n')}
      />
      <br/>
      <label>Message: </label>
      <br/>
      <textarea
        rows="20"
        cols="100"
        value={message}
        onChange={handleMessageChange}
      />
      <br/>
      <button
        onClick={sendMessage}
      >
        SEND
      </button>
    </div>
  );
}

export default App;
