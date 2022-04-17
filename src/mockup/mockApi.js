import MockAdapter from 'axios-mock-adapter';
import mockResult from './mockRandom';

const blogUrls = [
  {
    id: 1,
    url: 'https://google.com',
  },
  {
    id: 2,
    url: 'https://cnn.com',
  },
  {
    id: 3,
    url: 'https://amazon.com',
  },
  {
    id: 4,
    url: 'https://microsoft.com',
  },
  {
    id: 5,
    url: 'https://yahoo.com',
  },
  {
    id: 6,
    url: 'https://facebook.com',
  },
];

const apiKeys = {
  googleTranslation: 'e3b0c44298fc1c149afbf4c8996fb92427',
  scrapingBee: '09d1396c1dd1162aba9109354bc90499',
};

export default function(axiosInstance)
{
  const mock = new MockAdapter(axiosInstance);

  // ===== Blogs =====

  mock.onGet('/blogs').reply(config =>
  {
    return new Promise((resolve, reject) =>
    {
      mockResult(config, resolve, reject, blogUrls);
    });
  });

  mock.onDelete(/\/blog\/\d+$/).reply(config =>
  {
    return new Promise((resolve, reject) =>
    {
      const id = config.url.match(/\/blog\/(\d+)/)[1]; // we need only the ID
      const index = blogUrls.findIndex(item => +item.id === +id);
      let result = {};
      if (index !== -1)
      {
        result = blogUrls[index];
        blogUrls.splice(index, 1);
      }
      mockResult(config, resolve, reject, result);
    });
  });

  mock.onPost('/blogs').reply(config =>
  {
    return new Promise((resolve, reject) =>
    {
      window.blogNextID = window.blogNextID || 50; // use a global counter to get new fake IDs
      mockResult(config, resolve, reject, Object.assign({}, JSON.parse(config.data), { // config.data is always a String for application/json
        id: window.blogNextID++,
      }));
    });
  });

  // ===== API keys =====

  mock.onGet('/keys').reply(config =>
  {
    return new Promise((resolve, reject) =>
    {
      mockResult(config, resolve, reject, apiKeys);
    });
  });

  mock.onPut('/keys').reply(config =>
  {
    return new Promise((resolve, reject) =>
    {
      const data = JSON.parse(config.data); // config.data is always a String for application/json
      if (data.googleTranslation) apiKeys.googleTranslation = data.googleTranslation;
      if (data.scrapingBee) apiKeys.scrapingBee = data.scrapingBee;
      mockResult(config, resolve, reject, Object.assign({}, apiKeys));
    });
  });

  // ===== Content =====

  mock.onPost('/generate').reply(config =>
  {
    return new Promise((resolve, reject) =>
    {
      mockResult(config, resolve, reject, {});
    });
  });
}
