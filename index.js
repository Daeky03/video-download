const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/getFormats', (req, res) => {
  const videoUrl = req.body.url;

  exec(`yt-dlp -F "${videoUrl}"`, (error, stdout, stderr) => {
    if (error) {
      return res.send(`Hata: ${stderr}`);
    }
    res.send(`<pre>${stdout}</pre><br>
      <form action="/download" method="POST">
        <input type="hidden" name="url" value="${videoUrl}">
        <input type="text" name="format" placeholder="Format kodu (örn: 137)" required>
        <button type="submit">İndir</button>
      </form>`);
  });
});

app.post('/download', (req, res) => {
  const { url, format } = req.body;

  const cmd = `yt-dlp -f ${format} -o "video.%(ext)s" "${url}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      return res.send(`Hata oluştu: ${stderr}`);
    }
    res.download('video.mp4', 'indirilen-video.mp4');
  });
});

app.listen(3000, () => {
  console.log('Sunucu çalışıyor: http://localhost:3000');
});
