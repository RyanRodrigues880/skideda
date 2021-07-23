/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const venom = require('venom-bot');
const fs = require('fs');
const mime = require('mime-types');
const ffmpeg = require('fluent-ffmpeg');

venom
    .create()
    .then((client) => start(client));

async function start(client) {
  client.onMessage(async (message) => {
    // Mensagens personalizadas layout
    const customMessage = (content) => {
      client
          .reply(message.from, ` *[BOT] 🦅* \n *${content}*` , message.id)
          .then(() => {
            console.log(`${message.sender.pushname}:`, message.body);
          })
          .catch((erro) => {
            console.error('Erro ao enviar mensagem: ', erro);
          });
    };

    // Audio messages layout
    const audioMessage = (nome, extension, reply) => {
      if (message.body === `#${nome}`) {
        client.sendFile(
            message.chatId,
            `./files/audios/${nome}.${extension}`,
            `${nome}`,
        ).then(() => {
          if (reply) customMessage('Pronto aew, vagabunda.');
          console.log(`${message.sender.pushname}:`, `Audio ${nome}`);
        }).catch((err) => {
          console.error('AudioMessage_ERROR: ', err);
        });
      }
    };

    // Help menssage
    if (message.body === '!help') {
      customMessage('[HELP] 🦅* \n\nPara criar uma figurinha, digite *!sticker.* \n \nPara criar um GIF, digite *!gif.');
    }

    // Image sticker
    if (message.type === 'image') {
      if (message.caption === '!sticker') {
        const buffer = await client.decryptFile(message);
        const fileName = `./files/img-sticker_${message.sender.pushname}+${message.sender.id}.${mime.extension(message.mimetype)}`;
        await fs.writeFile(fileName, buffer, (err) => {
          if (err) throw err;
          client
              .sendImageAsSticker(message.chatId, fileName)
              .then(() => {
                console.log(`${message.sender.pushname}:`, 'image');
              });
        });
      }
    }

    // Gif sticker
    if (message.caption === '!gif') {
      const buffer = await client.decryptFile(message);

      const videoFile = `./files/img-gif-sticker_${message.sender.pushname}+${message.sender.id}.${mime.extension(message.mimetype)}`;
      const gifFile = `./files/img-gif-sticker_tmp_${message.sender.pushname}+${message.sender.id}.${mime.extension('image/gif')}`;

      // Verificando se existe arquivos antigos e removendo-os
      if (fs.existsSync(videoFile)) {
        try {
          fs.unlinkSync(videoFile);
        } catch (err) {
          console.log('WARNING: unlinkSync', err);
        }
      }
      if (fs.existsSync(gifFile)) {
        try {
          fs.unlinkSync(gifFile);
        } catch (err) {
          console.log('WARNING: unlinkSync', err);
        }
      }

      // Enviando gifsticker
      const messageSend = () => {
        client
            .sendImageAsStickerGif(message.chatId, gifFile)
            .then(() => {
              console.log('Result: ', 'Gifsticker');
            }).catch((err) => {
              console.log('saveVideo_INSIDE_FUNCTION_ERROR: ', err);
              customMessage('Erro ao criar sticker. Manda um gif curto, sua vagabunda do caralho!');
            });
      };

      // Convertendo o video(input) para gif(output)
      const convert = (input, output) => {
        ffmpeg(input)
            .output(output)
            .size('256x256')
            .run();
      };

      // Salvando o gif
      await fs.writeFileSync(gifFile, buffer, (err) => {
        if (err) console.log('saveGif_INSIDE_FUNCTION_ERROR: ', err);
      });

      // Salvando o video
      fs.writeFile(videoFile, buffer, (err) => {
        if (err) console.log('saveVideo_INSIDE_FUNCTION_ERROR: ', err);
        try {
          convert(videoFile, gifFile);
        } catch (err) {
          console.log('convert_TRY_INSIDE_FUNCTION_ERROR: ', err);
        }
        setTimeout(messageSend, 500);
      });
    }

    // Mensagens personalizadas
      if (message.body === 'Renan') {
        customMessage('Renan é o caralho.');
      }
    
      if (message.body === 'QI') {
        client
          .sendText(`${message.from}`, '*[BOT] Seu QI de Leo do caralho.*')
          .then(() => {
            console.log(`${message.sender.pushname}:`, message.body);
          })
          .catch((erro) => {
            console.error('Erro ao enviar mensagem: ', erro);
          });
      }
  
      if (message.body === 'qi') {
        client
          .sendText(`${message.from}`, '*[BOT] Seu QI de Leo do caralho.*')
          .then(() => {
            console.log(`${message.sender.pushname}:`, message.body);
          })
          .catch((erro) => {
            console.error('Erro ao enviar mensagem: ', erro);
          });
      }
  
      if (message.body === 'Qi') {
        client
          .sendText(`${message.from}`, '*[BOT] Seu QI de Leo do caralho.*')
          .then(() => {
            console.log(`${message.sender.pushname}:`, message.body);
          })
          .catch((erro) => {
            console.error('Erro ao enviar mensagem: ', erro);
          });
      }
      
    /*  Adminstration and security  */
    if (message.sender.id === `${'35998402227' || '21966944292'}@c.us`) {
      // Profile config
      if (message.isMedia === false) {
        if (message.body.substring(17) === `!setProfileStatus`) {
          await client.setProfileStatus(message.body.substring(18));
        }

        if (message.body.substring(15) === `!setProfileName`) {
          await client.setProfileName(message.body.substring(16));
        }
      }

      if (message.caption === `!setProfilePic`) {
        const buffer = await client.decryptFile(message);
        const profilePic = `./files/bot-profile-img-by${message.sender.pushname}+${message.sender.id}.${mime.extension(message.mimetype)}`;

        await fs.writeFile(profilePic, buffer, (err) => {
          if (err) console.log('profilePic_ERROR:', err);
          client.setProfilePic(profilePic);
        });
      }

      // Device security
      if (message.body === `!battery`) {
        await client.getBatteryLevel();
      }

      if (message.body === `!kill`) {
        await client.killServiceWorker();
      }

      if (message.body === `!restart`) {
        await client.restartService();
      }

      if (message.body === `!device`) {
        await client.getHostDevice();
      }

    }
  });
}