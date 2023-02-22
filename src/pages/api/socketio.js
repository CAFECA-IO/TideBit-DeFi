/* eslint-disable no-console */
import {Server, Socket} from 'socket.io';
import {TideBitEvent} from '../../constants/tidebit_event';
import {getDummyCandlestickChartData} from '../../interfaces/tidebit_defi_background/candlestickData';
import {dummyNotifications} from '../../interfaces/tidebit_defi_background/notification_item';
import {getDummyTicker} from '../../interfaces/tidebit_defi_background/ticker_data';
import {getDummyTickerLiveStatistics} from '../../interfaces/tidebit_defi_background/ticker_live_statistics';
import {getDummyTickerStatic} from '../../interfaces/tidebit_defi_background/ticker_static';

let dummyTickerInterval = null;

const dummyTickerUpdate = (currency, socket) => {
  if (dummyTickerInterval) clearInterval(dummyTickerInterval);
  dummyTickerInterval = setInterval(() => {
    socket.emit(TideBitEvent.TICKER, getDummyTicker(currency));
    socket.emit(TideBitEvent.TICKER_STATISTIC, getDummyTickerStatic(currency));
    socket.emit(TideBitEvent.TICKER_LIVE_STATISTIC, getDummyTickerLiveStatistics(currency));
    socket.emit(TideBitEvent.CANDLESTICK, getDummyCandlestickChartData());
  }, 1000);
};

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');

    const io = new Server(res.socket.server);

    io.on('connection', socket => {
      socket.broadcast.emit('a user connected');
      socket.on(TideBitEvent.NOTIFICATIONS, msg => {
        socket.emit(TideBitEvent.NOTIFICATIONS, dummyNotifications);
      });
      socket.on(TideBitEvent.TICKER_CHANGE, currency => dummyTickerUpdate(currency, socket));
    });

    res.socket.server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
