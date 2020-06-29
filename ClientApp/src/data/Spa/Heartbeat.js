import { apiGet } from '@utils/net';


let heartbeatFailures = 0;
export function spaHeartbeat() {
  return new Promise(function(resolve, reject) {
    const uri = '/heartbeat';

    let result = {}, ok = false;

    apiGet(uri)
    .then(response => {
      // console.log(`${uri} -> response`, response);
      ok = response.ok
      if (ok) {
        heartbeatFailures = 0;
      }
      return response.json();
    })
    .then((data = {}) => {
      if(ok) {
        result = {
          ok,
          ...data
        }
      } else {
        console.debug.warn(`${uri} -> data`, data);
        result = {
          ok: false,
          failures: ++heartbeatFailures,
          ...data
        }
      }
    }).catch(error => {
      console.log(`${uri} -> error`, error);
      result = {
        ok: false,
        failures: ++heartbeatFailures,
        error
      }
    })
    .finally(() => {
      resolve(result);
    });
  });
}
