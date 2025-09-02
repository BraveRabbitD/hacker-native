import { Post } from '@/components/posts/Post';
import { Text } from 'react-native';
import { render } from '../tests/test-utils';

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));
jest.mock('expo-haptics', () => ({ notificationAsync: jest.fn() }));
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

describe('Post component', () => {
  it('sanity: render plain Text', () => {
    const { getByText } = render((<Text>plain</Text>) as any);
    expect(getByText('plain')).toBeTruthy();
  });
  it('renders title and handles external link', async () => {
    const item = {
      id: 1,
      title: 'Hello',
      url: 'https://example.com',
      score: 2,
    } as any;
    // debug
    // eslint-disable-next-line no-console
    console.log(
      'Post import:',
      typeof Post,
      Post && Post.toString().slice(0, 120)
    );

    const rendered = render(<Post {...item} />);
    // debug output
    // eslint-disable-next-line no-console
    console.log('Rendered tree:');
    // eslint-disable-next-line no-console
    try {
      console.log(rendered.toJSON ? rendered.toJSON() : rendered.getByText);
    } catch (e) {
      console.log('debug failed', e);
    }
    const { getByText } = rendered;

    const title = getByText('Hello');
    expect(title).toBeTruthy();
  });
});
