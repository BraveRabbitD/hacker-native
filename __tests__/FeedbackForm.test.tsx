jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

import FeedbackForm from '@/components/FeedbackForm';
import { fireEvent, render, waitFor } from '../tests/test-utils';

import AsyncStorage from '@react-native-async-storage/async-storage';

describe('FeedbackForm', () => {
  beforeEach(() => jest.resetAllMocks());

  it('validates rating required and saves to storage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const { getByTestId, getByText } = render(<FeedbackForm />);

    const submit = getByTestId('submit-button');
    fireEvent.press(submit);

    await waitFor(() => expect(getByText('Rating is required')).toBeTruthy());

    const rating = getByTestId('rating-input');
    fireEvent.changeText(rating, '4');

    fireEvent.press(submit);

    await waitFor(() => expect(getByText('Saved')).toBeTruthy());
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
