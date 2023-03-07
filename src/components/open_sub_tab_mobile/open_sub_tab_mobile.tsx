import React, {useContext} from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';

const OpenSubTabMobile = () => {
  const {openCFDs} = useContext(UserContext);
  const openPositionList = openCFDs.map(cfd => {
    return (
      <div key={cfd.id}>
        {/* <OpenPositionItem openCfdDetails={cfd} /> */}
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </div>
    );
  });

  return (
    <>
      <div className="flex w-screen flex-col overflow-x-hidden px-8 sm:w-700px">
        <div className="h-80vh overflow-y-auto px-4">{openPositionList}</div>
      </div>
    </>
  );
};

export default OpenSubTabMobile;
