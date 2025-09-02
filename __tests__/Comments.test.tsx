import { render, waitFor } from '../tests/test-utils';

jest.mock('@/api/endpoints', () => ({
  getItemDetails: jest.fn(),
}));

import { getItemDetails } from '@/api/endpoints';
import { Comments } from '@/components/comments/comments';

describe('Comments', () => {
  beforeEach(() => jest.resetAllMocks());

  it('renders list of comments when kids provided', async () => {
    // Mock getItemDetails to return a comment
    (getItemDetails as jest.Mock).mockImplementation((id: number) =>
      Promise.resolve({ json: async () => ({ id, by: 'user', text: 'hello' }) })
    );

    const { getByText } = render(
      <Comments id={1} kids={[101]}>
        {null}
      </Comments>
    );

    await waitFor(() => expect(getByText('hello')).toBeTruthy());
  });
});
