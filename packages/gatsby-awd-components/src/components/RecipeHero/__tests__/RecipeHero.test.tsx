import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { RecipeHero } from '../index';
import toJson from 'enzyme-to-json';
import dataSource from '../../../mocks/recipe.json';

describe('<RecipeDietaryAttributes />', () => {
  let wrapper: ReactWrapper;
  const props: any = {
    content: {
      ...dataSource,
      localImage: {
        id: '0bcf6c75-0450-554d-89c7-85316cc28839',
        childImageSharp: {
          fluid: {
            base64:
              'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAAPABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAMBBP/EABYBAQEBAAAAAAAAAAAAAAAAAAIBA//aAAwDAQACEAMQAAABtaDF46jn/8QAGBABAAMBAAAAAAAAAAAAAAAAAQACIRH/2gAIAQEAAQUCOiJLOisNaT//xAAWEQEBAQAAAAAAAAAAAAAAAAAAARL/2gAIAQMBAT8Baj//xAAWEQEBAQAAAAAAAAAAAAAAAAAAARL/2gAIAQIBAT8BjFf/xAAaEAACAgMAAAAAAAAAAAAAAAABEQAQIUFx/9oACAEBAAY/AtKI0Qsij2f/xAAbEAACAwADAAAAAAAAAAAAAAABEQAhMWFx4f/aAAgBAQABPyF8Tbl6ZgBwY00h0xMNR2vyAKEApGZ//9oADAMBAAIAAwAAABBED//EABgRAAIDAAAAAAAAAAAAAAAAAAARASFh/9oACAEDAQE/EJwVSP/EABYRAQEBAAAAAAAAAAAAAAAAABEAIf/aAAgBAgEBPxDRLrf/xAAaEAEAAwEBAQAAAAAAAAAAAAABABEhMUGR/9oACAEBAAE/ENEODrpaeRSbBgdhYqZVT4xhxuFRsZdVsebQii6YCKmT/9k=',
            aspectRatio: 1.3639181649101053,
            src:
              '/static/19d6fa90d8c16a12c22f10dd36139c04/bc3a8/c2a86e7d-9037-478a-926d-8e2cc27cda69.jpg',
            srcSet:
              '/static/19d6fa90d8c16a12c22f10dd36139c04/d278e/c2a86e7d-9037-478a-926d-8e2cc27cda69.jpg 200w,\n/static/19d6fa90d8c16a12c22f10dd36139c04/8539d/c2a86e7d-9037-478a-926d-8e2cc27cda69.jpg 400w,\n/static/19d6fa90d8c16a12c22f10dd36139c04/bc3a8/c2a86e7d-9037-478a-926d-8e2cc27cda69.jpg 800w,\n/static/19d6fa90d8c16a12c22f10dd36139c04/81ef8/c2a86e7d-9037-478a-926d-8e2cc27cda69.jpg 1200w,\n/static/19d6fa90d8c16a12c22f10dd36139c04/989b1/c2a86e7d-9037-478a-926d-8e2cc27cda69.jpg 1600w,\n/static/19d6fa90d8c16a12c22f10dd36139c04/c82f6/c2a86e7d-9037-478a-926d-8e2cc27cda69.jpg 2400w,\n/static/19d6fa90d8c16a12c22f10dd36139c04/8c25d/c2a86e7d-9037-478a-926d-8e2cc27cda69.jpg 4400w',
            srcWebp:
              '/static/19d6fa90d8c16a12c22f10dd36139c04/c6096/c2a86e7d-9037-478a-926d-8e2cc27cda69.webp',
            srcSetWebp:
              '/static/19d6fa90d8c16a12c22f10dd36139c04/1932c/c2a86e7d-9037-478a-926d-8e2cc27cda69.webp 200w,\n/static/19d6fa90d8c16a12c22f10dd36139c04/f4957/c2a86e7d-9037-478a-926d-8e2cc27cda69.webp 400w,\n/static/19d6fa90d8c16a12c22f10dd36139c04/c6096/c2a86e7d-9037-478a-926d-8e2cc27cda69.webp 800w,\n/static/19d6fa90d8c16a12c22f10dd36139c04/b6424/c2a86e7d-9037-478a-926d-8e2cc27cda69.webp 1200w,\n/static/19d6fa90d8c16a12c22f10dd36139c04/7a72d/c2a86e7d-9037-478a-926d-8e2cc27cda69.webp 1600w,\n/static/19d6fa90d8c16a12c22f10dd36139c04/c5845/c2a86e7d-9037-478a-926d-8e2cc27cda69.webp 2400w,\n/static/19d6fa90d8c16a12c22f10dd36139c04/dc113/c2a86e7d-9037-478a-926d-8e2cc27cda69.webp 4400w',
            sizes: '(max-width: 800px) 100vw, 800px',
          },
        },
      },
    },
    imagePlaceholder: {
      id: '0bcf6c75-0450-554d-89c7-85316cc28839',
      childImageSharp: {
        fluid: {
          aspectRatio: 1,
          base64:
            'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA+Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBkZWZhdWx0IHF1YWxpdHkK/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgBLAEsAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A9MooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKzm1Us7eRayTRqcFx0/CgDRoqG3uY7i3E6HCd89vrVL+1x/rPs0v2fOPN/+tQBp0VG80ccBmZvkA3Z9qpJq2XQy20kUTnCyN0oA0aKKKACiiigAoqpd3y2zpGsbSyvyEX0pLW/E8xhkheGUDO1u49qALlFU7q/8iYQxQvNLjJVew96ktLtLuMkKUdThkbqDQBYoqhPqRjnaKG3edk++V6CrNtcpdQCWPODwQeoNAE1FFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAjDcpXpkY4qhLPBo9vFFtkYHO3p+v51ekZlidlGWAJA9TUFrcJeWYkYLgg7l7CgDPUlNBnlyP3pLYU9MkDFaSwL9hEGPl8vbj8KzIYt+j3gjBKGRig9hj/CtAXSf2YLjcMeXn8cdPzoAzixl0O1Qk/PIIz9Mn/CtHUI1fTplxwEJH4c1QeNotCt22nMbCQj8f/r1c1GdF02RgwIkXavvmgCxauZLSFyclkUn8qr6jJcQRLPC3yocumByKsW6GO2iQ9VQA/lTL2dLe0kkcAjGAp7k9qAKz3j3N1BDaPhSN8jYBwPStGsXSQbO5a3mQK8qh1Pr7VtUAV5IooZpL1txZYyCPYc8VRt7pNQ1SOSMbFhQ8MeWzVxbs/2i9q4AG0Mh9agmVP7btigAfaxfHpjjNADrAbrq9lPUy7M/SiMeXrcoHAkhDH6g4pLJhHfXkJ4JfzB7g0QsJtZndeVjjEeffOaAF0gZtGl7ySMxP40WI8u+voh90OrAfUc0mlMFglgPDRSMCD6UaefNuryccqzhVPrgUAaFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVQk0e1kkL/ADpuOSqtgGr9FADI4khiWNFCoowBVP8Ase083fh9uc7N3y1fooARkV0KMAVIwR7VSi0m1imEgDttOVVmyBV6igAqC4tI7mSJpC2IzkKDwT71PRQBXubSO5aNmLK8ZyrKeasUUUAVrqxhvNvmAhl6MpwRRa2MNmWMYYu3VmOTVmigCrdWEN2ys+5XXgMhwaktraK1i8uJcDqSepNTUUAU7nTLe6l8xt6uRglDjP1qzDDHBEsca7VHQU+igAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiisyCUpBFMvntiPdLvLYPy54z7+lAGnRVZZJw/lv5ZdoyyFQcAjHB/MUz7dvBCKMlV2E9Cxxx+G4UAXKKpzXciTSKiFhHgECNmLcZ4I4HWpS8rXZjQoEVVYkgknJPHX2oAnpCwBAJAJOB71Ut7uSZ0Ow7H5H7tht7jJPBpokllktJG2eW7llAByPkbGfWgC6WAIBIBJwPelqtd799t5e3d5vG7p91qQ3EixSMwUmJ8PgcFcA5H4H9KALVFRRSGVnIx5YOFI7+p/p+FRLNIs9wohlkAcYKlcD5V45I/yaALVFZ5BktRKzSq/nbceYRgeZjHBx04p9xvhlh8tnKxo7lSxO4ArnOevBOKALtFUoZGlvhIHPlOjhFzwQCvP6n8KntGLWcDMSSY1JJ78UATUVXcGW6MRdlRUDYViNxJPcc8Y/WiYFEiiWRgHfaXJ5AwT1/DFAFiiqM+63SZEkcgwO43MSVI9+vf9KiuJZfs0luHYSRKzM4PO0DIOffj9aANOiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACmrGqRiNR8gG0DrxTqKAI4reOEkopBIxySePTmkFtCoXCD5WLL7E1LRQBE9vHI+5gc9DhiM/XHWnhFEhcD5iACfYZx/M06igCJbeNH3qCD1xuOB9B0pFtYVkEgT5lJI+Y4GeuB+NTUUARywxzBRIudp3DkjB/CmPCUgMcAUbs5LE8Z6n3NT0UANjjWKNY0GFUYFCoqliBgscn3OAP6CnUUAM8mPZs2/Lu34z3zu/nSlFMgcj5gCAfY4z/ACFOooAaUUyByPmAIB9jjP8AIVHHaxwldnmAKMAGRiB+BOKmooAiNtEURNpAQYUhiCB9RzSmGMxeUVynoTUlFAEK20Ko6bSQ4w2WJJH1PNSOiyRsjDKsCCPanUUAFFFFAH//2Q==',
          sizes: '(max-width: 300px) 10vw, 300px',
          src: '/static/17960958527413a2fca4ac3a7e0fe78d/bc3a8/knorr.jpg',
          srcSet:
            '/static/17960958527413a2fca4ac3a7e0fe78d/d278e/knorr.jpg 1vw,↵/static/17960958527413a2fca4ac3a7e0fe78d/8539d/knorr.jpg 20vw,↵/static/17960958527413a2fca4ac3a7e0fe78d/bc3a8/knorr.jpg 800w,↵/static/17960958527413a2fca4ac3a7e0fe78d/81ef8/knorr.jpg 11vw,↵/static/17960958527413a2fca4ac3a7e0fe78d/989b1/knorr.jpg 1600w,↵/static/17960958527413a2fca4ac3a7e0fe78d/c82f6/knorr.jpg 220vw,↵/static/17960958527413a2fca4ac3a7e0fe78d/65c7d/knorr.jpg 4009w',
        },
      },
    },
    viewType: 'default',
  };

  beforeEach(() => {
    wrapper = mount(<RecipeHero {...props} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
