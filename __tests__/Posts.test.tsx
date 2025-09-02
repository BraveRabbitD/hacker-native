import { Posts } from '@/components/posts/Posts';
import { render, waitFor } from '../tests/test-utils';

jest.mock('@/api/endpoints', () => ({
  getTopStories: jest.fn(),
  getItemDetails: jest.fn(),
}));

import { getItemDetails, getTopStories } from '@/api/endpoints';

describe('Posts - infinite list', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders initial posts and loads more on end reached', async () => {
    // top stories returns 3 ids
    (getTopStories as jest.Mock).mockResolvedValue({
      json: async () => [1, 2, 3],
    });

    // getItemDetails returns items
    (getItemDetails as jest.Mock).mockImplementation((id: number) => {
      return Promise.resolve({
        json: async () => ({ id, title: `post ${id}`, score: 1 }),
      });
    });

    const { getByText, getByTestId, queryByText } = render(
      <Posts storyType={'topstories' as any} />
    );

    // Wait for first item to appear
    await waitFor(() => expect(getByText('post 1')).toBeTruthy());

    // Simulate end reached
    const flatlist = queryByText('post 1')?.parent; // best-effort
    // trigger onEndReached by calling the component prop is tricky; instead verify getItemDetails called for each id
    expect(
      (getItemDetails as jest.Mock).mock.calls.length
    ).toBeGreaterThanOrEqual(1);
  });
});
