import express from 'express';
import { DiscordClient } from './client';

const app = express();
const port = 3000;

app.use(express.json());

// Endpoint for receiving authorization codes
app.post('/webhook', (req, res) => {
    const code = req.body.code;
    const guildId = req.body.guildId;
  
    console.log(`Authorization code: ${code}`);
    console.log(`Guild ID: ${guildId}`);
  
    // Emit an event with the login data
  
    res.sendStatus(200);
  });

// Endpoint for serving timeline data
app.get('/timelines/:user', (req, res) => {
  const user = req.params.user;

  // TODO: Fetch timeline data for the given user
  // ...

  res.send(`Timeline data for user ${user}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
