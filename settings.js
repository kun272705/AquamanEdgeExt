
import { DouyinChannelExporter } from './agents/douyin-channel-exporter/douyin-channel-exporter.js';

export class settings {

  static extName = 'Aquaman Edge Ext';

  static nativeMessagingHostName = 'com.kun272705.aquaman';

  static CDPVersion = '1.3';
      
  static registeredAgents = [
    DouyinChannelExporter
  ];
};
