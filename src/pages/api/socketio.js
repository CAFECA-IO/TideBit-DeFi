/* eslint-disable no-console */
import {Server, Socket} from 'socket.io';
import {ModifyType} from '../../constants/modify_type';
import {OrderState} from '../../constants/order_state';
import {OrderType} from '../../constants/order_type';
import {TideBitEvent} from '../../constants/tidebit_event';
import {getDummyCandlestickChartData} from '../../interfaces/tidebit_defi_background/candlestickData';
import {getDummyClosedCFDs} from '../../interfaces/tidebit_defi_background/closed_cfd_details';
import {
  createDummyPrivateNotificationItem,
  dummyNotifications,
} from '../../interfaces/tidebit_defi_background/notification_item';
import {getDummyOpenCFDs} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {getDummyTicker} from '../../interfaces/tidebit_defi_background/ticker_data';
import {getDummyTickerLiveStatistics} from '../../interfaces/tidebit_defi_background/ticker_live_statistics';
import {getDummyTickerStatic} from '../../interfaces/tidebit_defi_background/ticker_static';

let currencies = {};
let publicUsers = {};
let dummyTickerInterval = null;
let dummyBalanceInterval = null;
let dummyCFDsInterval = null;

const dummyTickerUpdate = (currency, socket) => {
  try {
    if (!publicUsers[socket.id]) publicUsers[socket.id] = {};
    publicUsers[socket.id][`currency`] = currency;
    if (!currencies[currency]) currencies[currency] = {};
    currencies[currency][`socketId`] = socket.id;
    if (dummyTickerInterval) clearInterval(dummyTickerInterval);
    dummyTickerInterval = setInterval(() => {
      socket.emit(TideBitEvent.TICKER, getDummyTicker(currency));
      socket.emit(TideBitEvent.TICKER_STATISTIC, getDummyTickerStatic(currency));
      socket.emit(TideBitEvent.TICKER_LIVE_STATISTIC, getDummyTickerLiveStatistics(currency));
      socket.emit(TideBitEvent.CANDLESTICK, getDummyCandlestickChartData()); // ++ 會導致 waring of [Violation] 'message' handler took
    }, 1000);
  } catch (error) {
    console.error(`received dummyTickerUpdate error`, error);
  }
};

const dummyUserBalanceUpdate = socket => {
  dummyBalanceInterval = setInterval(() => {
    socket.emit(TideBitEvent.BALANCE, {
      available: parseInt((Math.random() * 1000).toFixed(2)),
      locked: parseInt((Math.random() * 1000).toFixed(2)),
      PNL: parseInt((Math.random() * 1000).toFixed(2)),
    });
  }, 5000);
};

const dummyCFDsUpdate = socket => {
  dummyCFDsInterval = setInterval(() => {
    if (publicUsers[socket.id].currency) {
      const random = Math.random() > 0.5;
      socket.emit(TideBitEvent.ORDER, {
        orderType: OrderType.CFD,
        orderState: random ? OrderState.OPENING : OrderState.CLOSED,
        modifyType: ModifyType.Add,
        orders: random
          ? getDummyOpenCFDs(publicUsers[socket.id].currency, 1)
          : getDummyClosedCFDs(publicUsers[socket.id].currency, 1),
      });
    }
  }, 5000);
};

const registerPublicUser = socket => {
  if (!publicUsers[socket.id]) publicUsers[socket.id] = {socket};
  socket.emit(TideBitEvent.NOTIFICATIONS, dummyNotifications);
};

const unregisterPublicUser = socket => {
  // ++ TODO CHECK: remove socket by id
  if (publicUsers[socket.id]) {
    delete currencies[publicUsers[socket.id].currency][socket.id];
  }
  delete publicUsers[socket.id];
};

const registerPrivateUser = (address, socket) => {
  try {
    if (!publicUsers[socket.id]) publicUsers[socket.id] = {address: address};
    socket.emit(TideBitEvent.NOTIFICATIONS, [
      createDummyPrivateNotificationItem(address, `this is from websocket`),
    ]);
    dummyUserBalanceUpdate(socket);
    dummyCFDsUpdate(socket);
  } catch (error) {
    console.error(`received registerPrivateUser error`, error);
  }
};

const unregisterPrivateUser = (address, socket) => {
  // ++ TODO CHECK: remove socket address by id
  if (publicUsers[socket.id]) {
    delete publicUsers[socket.id][address];
  }
  socket.emit(TideBitEvent.DISCONNECTED_WALLET, address);
};

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');

    const io = new Server(res.socket.server);

    io.on('connection', socket => {
      socket.on(TideBitEvent.NOTIFICATIONS, _ => registerPublicUser(socket));
      // socket.on(TideBitEvent.TICKER_CHANGE, currency => dummyTickerUpdate(currency, socket));
      socket.on(TideBitEvent.SERVICE_TERM_ENABLED, address => registerPrivateUser(address, socket));
      socket.on(TideBitEvent.DISCONNECTED_WALLET, address =>
        unregisterPrivateUser(address, socket)
      );
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
