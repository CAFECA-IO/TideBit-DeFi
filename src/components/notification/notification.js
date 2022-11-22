import useOuterClick from '../../hooks/lib/useOuterClick';

export default function Notification() {
  const {ref, componentVisible, setComponentVisible} = useOuterClick(false);

  const sidebarOpenHandler = () => {
    // setSidebarOpen(!sidebarOpen);
    setComponentVisible(!componentVisible);
    // console.log('sidebarOpenHandler clicked, componentVisible: ', componentVisible);
  };

  return <div></div>;
}
