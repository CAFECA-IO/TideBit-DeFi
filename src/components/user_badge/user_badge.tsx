import React, {useEffect} from 'react';
import useUserStore from '../../stores/user_store';
import useMarketStore from '../../stores/market_store';

const UserBadge = () => {
  const badge = useUserStore(s => s.badge);
  const userInit = useUserStore(s => s.init);
  const num = useMarketStore(s => s.randNum);

  // eslint-disable-next-line no-console
  console.log('in UserBadge, badge: ', badge);

  useEffect(() => {
    userInit();
  }, []);

  return (
    <div>
      <div className="flex flex-col">
        UserBadge: {badge[badge.length - 1]}
        randNum: {num}
      </div>
    </div>
  );
};

export default UserBadge;
