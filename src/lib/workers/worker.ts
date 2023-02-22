/* eslint-disable no-console */
function doJob() {
  // Code to perform the task
  console.log(`doJob`);
}

onmessage = function (event) {
  if (event.data === 'start') {
    console.log(`event.data === 'start'`, event);
    doJob();
    postMessage('done');
  }
};
