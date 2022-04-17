import MockAdapter from 'axios-mock-adapter';
import mockResult from './mockRandom';
import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8';

// auth
const SECRET_KEY = '123456789';
const expiresIn = 10 * 60 * 1000; // milliseconds
const users = [
  {
    id: 1,
    name: 'Administrator',
    username: 'admin',
    password: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/83.jpg',
    roles: ['administrator']
  },
  {
    id: 2,
    name: 'Jean-Marc Giorgi',
    username: 'jean',
    password: 'marc',
    avatar: 'https://randomuser.me/api/portraits/men/17.jpg',
    roles: ['administrator']
  },
  {
    id: 3,
    name: 'Test account',
    username: 'test',
    password: 'test',
    avatar: 'https://randomuser.me/api/portraits/men/31.jpg',
    roles: ['user']
  },
  {
    username: 'sveta',
    password: 'popova',
    email: 'sveta@abv.bg',
    name: 'sveta popova',
    avatar: 'https://randomuser.me/api/portraits/men/39.jpg',
    roles: ['user']
  },
];

// mockup data
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
  googleTranslation: '',
  scrapingBee: '',
};

// Create a token from a payload
function createToken(payload)
{
  return aes.encrypt(JSON.stringify({
    ...payload,
    expire: Date.now() + expiresIn
  }), SECRET_KEY).toString();
}

// Verify the token
function verifyToken(token)
{
  const bytes = aes.decrypt(token, SECRET_KEY);
  let js;
  try
  {
    js = JSON.parse(bytes.toString(enc));
    if (js && js.expire && js.expire > Date.now() && js.id)
    {
      return users.find(item => +item.id === +js.id);
    }
  }
  catch (e)
  {}
  return false;
}
/*
function decodeToken(token)
{
  return jwt.decode(token, SECRET_KEY);
}
 */
// Check if the user exists in database
function isAuthenticated({ username, password })
{
  const idx = users.findIndex(user => user.username === username && user.password === password);
  return idx !== -1 ? users[idx] : null;
}

function checkAuthorization(config)
{
  if (!('Authorization' in config.headers))
  {
    return [401,
      {
        error:
          {
            code: 'UNAUTHORIZED',
            message: 'No active user session'
          }
      }];
  }
  if (config.headers.Authorization === undefined || config.headers.Authorization.split(' ')[0] !== 'Bearer')
  {
    return [401, {
      error:
        {
          code: 'INVALID_AUTH',
          message: 'Only Bearer type of authorization supported'
        }
    }];
  }
  if (!verifyToken(config.headers.Authorization.split(' ')[1]))
  {
    return [401, {
      error:
        {
          code: 'SESSION_EXPIRED',
          msg: 'Your session has expired'
        }
    }];
  }
}

export default function(axiosInstance)
{
  const mock = new MockAdapter(axiosInstance);

  // ===== Login =====

  mock.onGet('/ping').reply(config =>
  {
    const token = config.headers.Authorization.split(' ')[1];
    const data = verifyToken(token);
    if (data)
    {
      const user = users.find(user => user.id === data.id);
      return [200, {
        data: user,
      }];
    }
    else
    {
      return [401, {
        error:
          {
            code: 'SESSION_EXPIRED',
            msg: 'Your session has expired'
          }
      }];
    }
  });

  mock.onPost('/login').reply(config =>
  {
    let js;
    try
    {
      js = JSON.parse(config.data || '{}');
      const user = isAuthenticated({
        username: js.username,
        password: js.password,
      });
      if (!user)
      {
        return [200, {
          error:
          {
            code: 'UNKNOWN_LOGIN',
            message: 'Invalid username or password'
          }
        }];
      }

      return [200, {
        data:
          {
            token: createToken({ id: user.id }),
            name: user.name,
          }
      }];
    }
    catch (e)
    {
      console.error(e);
      return [400, {
        error:
          {
            code: 'INVALID_JSON',
            message: 'Could not parse the supplied payload'
          }
      }];
    }
  });

  mock.onPost('/logout').reply(config =>
  {
    return new Promise((resolve, reject) =>
    {
      mockResult(config, resolve, reject, {
        data: true
      });
    });
  });

  // ===== Blogs =====

  mock.onGet('/blogs').reply(config =>
  {
    return checkAuthorization(config) || new Promise((resolve, reject) =>
    {
      mockResult(config, resolve, reject, blogUrls);
    });
  });

  mock.onDelete(/\/blog\/\d+$/).reply(config =>
  {
    return checkAuthorization(config) || new Promise((resolve, reject) =>
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
    return checkAuthorization(config) || new Promise((resolve, reject) =>
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
    return checkAuthorization(config) || new Promise((resolve, reject) =>
    {
      mockResult(config, resolve, reject, apiKeys);
    });
  });

  mock.onPut('/keys').reply(config =>
  {
    return checkAuthorization(config) || new Promise((resolve, reject) =>
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
    return checkAuthorization(config) || new Promise((resolve, reject) =>
    {
      mockResult(config, resolve, reject, {});
    });
  });
}
