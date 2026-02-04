
import { DouyinChannelDownloader } from './agents/douyin-channel-downloader/douyin-channel-downloader.js';

export class settings {

  static extName = 'Aquaman Edge Ext';

  static CDPVersion = '1.3';

  static nativeMessagingHostName = 'com.kun272705.aquaman';
      
  static agentRegistry = [
    {
      'patterns': ["https://www.douyin.com/user/*"],
      'class': DouyinChannelDownloader
    }
  ];
};
