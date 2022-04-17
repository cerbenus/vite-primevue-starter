export default function(axiosConfig, resolve, reject, result)
{
  const fakeTimeout = 1500; // in milliseconds

  // axiosConfig contains things like the URL and POST payload
  setTimeout(() =>
  {
    const chance = Math.random();
    if (chance >= 0.00)
    {
      // return an array in the form of [status, data, headers]
      resolve([200, {
        data: result
      }]);
    }
    else if (chance > 0.04)
    {
      const error = new Error('Simulated network error');
      error.config = axiosConfig;
      reject(error);
    }
    else
    {
      // reject() reason will be passed as-is.
      // Use HTTP error status code to simulate server failure.
      resolve([500, {
        error:
          {
            code: 'SERVICE_UNAVAILABLE',
            message: 'Simulated backend failure'
          }
      }]);
    }
  }, Math.random() * fakeTimeout); // random timeout
}
